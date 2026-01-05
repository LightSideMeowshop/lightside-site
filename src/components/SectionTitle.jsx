/**
 * Section title component with kicker, title, and subtitle
 */
export function SectionTitle({ icon, kicker, title, subtitle }) {
  return (
    <div className="max-w-3xl mx-auto text-center mb-12">
      <div className="flex items-center justify-center gap-2 text-[var(--color-accent)] uppercase tracking-widest text-xs font-semibold">
        {icon}
        <span>{kicker}</span>
      </div>
      <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
      {subtitle && <p className="mt-3 text-white/70">{subtitle}</p>}
    </div>
  );
}
