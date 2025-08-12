#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Export Google Sheet localizations to JSON files per language.

Usage:
  python export_locales.py "https://docs.google.com/spreadsheets/d/<ID>/edit#gid=0" \
      --out ./locales \
      --key-col key \
      --format nested \
      --sep . \
      --allow ru en de \
      --gid 0

Assumptions:
- First row is headers.
- One column contains localization keys (default header: "key").
- Every other header is a language code (ru, en, ...). You can limit with --allow.
- The sheet is publicly accessible (Anyone with the link: Viewer).

Outputs:
  ./locales/{lang}/common.json

Author: ChatGPT
"""
import argparse
import csv
import io
import json
import os
import re
import sys
import urllib.request
from urllib.error import HTTPError, URLError
from typing import Dict, List, Tuple, Optional

def infer_export_csv_url(url: str, gid: Optional[int]) -> str:
    """
    Try to build a direct CSV export URL from a shared Google Sheets link.
    Supports links like:
      - https://docs.google.com/spreadsheets/d/<ID>/edit#gid=0
      - https://docs.google.com/spreadsheets/d/<ID>/edit?gid=0
      - https://docs.google.com/spreadsheets/d/<ID>/pub?output=csv
      - https://docs.google.com/spreadsheets/d/e/<PUBID>/pub?output=csv
    If the URL already contains 'output=csv', returns it as-is.
    """
    if "output=csv" in url:
        return url

    m = re.search(r"https://docs\.google\.com/spreadsheets/d/([^/]+)/", url)
    if not m:
        raise ValueError("Cannot extract spreadsheet ID from URL. Paste a standard Google Sheets link.")
    sheet_id = m.group(1)

    gid_from_url = None
    m_gid = re.search(r"[?#&]gid=(\\d+)", url)
    if m_gid:
        gid_from_url = int(m_gid.group(1))

    gid_value = gid if gid is not None else (gid_from_url if gid_from_url is not None else 0)
    return f"https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv&gid={gid_value}"

def fetch_csv(url: str, timeout: int = 30) -> str:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            content_type = resp.headers.get("Content-Type", "")
            data = resp.read()
        # Google may return text/csv or application/vnd.ms-excel; decode as UTF-8 with fallback
        try:
            return data.decode("utf-8")
        except UnicodeDecodeError:
            return data.decode("utf-16", errors="replace")
    except HTTPError as e:
        raise RuntimeError(f"HTTP error {e.code} while fetching CSV. Is the sheet public? URL: {url}") from e
    except URLError as e:
        raise RuntimeError(f"Network error while fetching CSV: {e}") from e

def read_rows(csv_text: str) -> List[List[str]]:
    # Handle \r\n or \n uniformly
    f = io.StringIO(csv_text)
    reader = csv.reader(f)
    rows = [row for row in reader]
    # Trim trailing empty columns in each row (cosmetic)
    rows = [trim_trailing_empty(r) for r in rows]
    return rows

def trim_trailing_empty(row: List[str]) -> List[str]:
    i = len(row) - 1
    while i >= 0 and (row[i] is None or str(row[i]).strip() == ""):
        i -= 1
    return row[: i + 1]

def set_deep(obj: Dict, dotted_key: str, value: str, sep: str = ".", strict: bool = False) -> None:
    parts = [p for p in str(dotted_key).split(sep) if p != ""]
    cur = obj
    for idx, p in enumerate(parts):
        is_last = idx == len(parts) - 1
        if is_last:
            if strict and isinstance(cur.get(p), dict):
                raise ValueError(f"Key collision: '{dotted_key}' — path already holds an object.")
            cur[p] = value
        else:
            if p not in cur:
                cur[p] = {}
            elif not isinstance(cur[p], dict):
                if strict:
                    raise ValueError(f"Key collision on path '{dotted_key}' — non-object encountered at '{p}'.")
                # Non-strict: overwrite to object
                cur[p] = {}
            cur = cur[p]

def build_locale_dicts(
    rows: List[List[str]],
    key_col_name: str = "key",
    include_missing_as_empty: bool = True,
    comment_prefix: Optional[str] = "#",
    nested: bool = True,
    sep: str = ".",
    allow_langs: Optional[List[str]] = None,
) -> Tuple[Dict[str, Dict], List[str]]:
    if not rows or not rows[0]:
        raise ValueError("Empty CSV: no header row found.")
    header = [str(h or "").strip() for h in rows[0]]
    if key_col_name not in header:
        # Try case-insensitive match
        lowered = [h.lower() for h in header]
        try:
            key_idx = lowered.index(key_col_name.lower())
        except ValueError:
            raise ValueError(f'Key column "{key_col_name}" not found in header: {header}')
    else:
        key_idx = header.index(key_col_name)

    # Language columns = all headers except the key column
    langs_cols: List[Tuple[str, int]] = []
    for idx, h in enumerate(header):
        if idx == key_idx:
            continue
        if not h:
            continue
        if allow_langs and h not in allow_langs:
            continue
        langs_cols.append((h, idx))

    if not langs_cols:
        raise ValueError("No language columns detected. Check header row.")

    # Prepare per-language dict
    out: Dict[str, Dict] = {}
    for lang, _ in langs_cols:
        out[lang] = {} if nested else {}

    # Iterate data rows
    for r in rows[1:]:
        if key_idx >= len(r):
            continue
        raw_key = r[key_idx] or ""
        key = str(raw_key).strip()
        if key == "":
            continue
        if comment_prefix and key.startswith(comment_prefix):
            continue

        for lang, col in langs_cols:
            val = r[col] if col < len(r) else ""
            val = "" if val is None else str(val)
            val = val.strip()

            if val == "" and not include_missing_as_empty:
                continue

            if nested:
                set_deep(out[lang], key, val, sep=sep, strict=False)
            else:
                out[lang][key] = val

    langs = [lc[0] for lc in langs_cols]
    return out, langs

def write_locales(struct: Dict[str, Dict], out_dir: str) -> None:
    for lang, data in struct.items():
        lang_dir = os.path.join(out_dir, lang)
        os.makedirs(lang_dir, exist_ok=True)
        path = os.path.join(lang_dir, "common.json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write("\n")
        print(f"Wrote {path}")

def main(argv: List[str]) -> int:
    p = argparse.ArgumentParser(description="Export Google Sheet translations to locales/{lang}/common.json")
    p.add_argument("url", help="Public Google Sheet link (the sheet containing translations)")
    p.add_argument("--out", default="./locales", help="Output folder (default: ./locales)")
    p.add_argument("--key-col", default="key", help="Header name of the key column (default: key)")
    p.add_argument("--format", choices=["nested","flat"], default="nested", help="JSON format: nested (a.b.c) or flat")
    p.add_argument("--sep", default=".", help="Key separator for nested format (default: .)")
    p.add_argument("--allow", nargs="*", help="Restrict to these language headers (e.g. --allow ru en)")
    p.add_argument("--gid", type=int, help="Sheet gid to export (overrides gid found in URL)")
    p.add_argument("--timeout", type=int, default=30, help="HTTP timeout seconds (default: 30)")
    p.add_argument("--include-missing-as-empty", action="store_true", default=True,
                   help="Include missing translations as empty strings (default: on)")
    p.add_argument("--no-include-missing-as-empty", action="store_false", dest="include_missing_as_empty",
                   help="Do not include missing translations")
    p.add_argument("--comment-prefix", default="#", help="Skip rows whose key starts with this prefix (default: #; set empty to disable)")

    args = p.parse_args(argv)

    export_url = infer_export_csv_url(args.url, args.gid)
    print(f"Fetching CSV: {export_url}")
    csv_text = fetch_csv(export_url, timeout=args.timeout)
    rows = read_rows(csv_text)

    nested = args.format == "nested"
    struct, langs = build_locale_dicts(
        rows,
        key_col_name=args.key_col,
        include_missing_as_empty=args.include_missing_as_empty,
        comment_prefix=(args.comment_prefix if args.comment_prefix != "" else None),
        nested=nested,
        sep=args.sep,
        allow_langs=args.allow,
    )
    print(f"Detected languages: {', '.join(langs)}")
    write_locales(struct, args.out)
    print("Done.")
    return 0

if __name__ == "__main__":
    try:
        sys.exit(main(sys.argv[1:]))
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(2)
