import { useState, useEffect, useRef } from 'react';

/**
 * Hook for hiding header on scroll down, showing on scroll up
 * @param {Object} options
 * @param {number} options.hideAfter - Start hiding after scrolling this many pixels (default: 64)
 * @param {number} options.showDelta - Show header after scrolling up this many pixels (default: 8)
 * @param {boolean} options.mobileOnly - Only enable on mobile viewport (default: true)
 * @param {number} options.mobileBreakpoint - Mobile breakpoint in pixels (default: 768)
 * @returns {boolean} isHidden - Whether the header should be hidden
 */
export function useScrollHide({
  hideAfter = 64,
  showDelta = 8,
  mobileOnly = true,
  mobileBreakpoint = 768,
} = {}) {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    function onScroll() {
      // Check if we should only apply on mobile
      if (mobileOnly && window.innerWidth > mobileBreakpoint) {
        setIsHidden(false);
        return;
      }

      const y = window.scrollY;
      const goingDown = y > lastScrollY.current;
      const delta = Math.abs(y - lastScrollY.current);

      if (goingDown && y > hideAfter && delta > 2) {
        setIsHidden(true);
      } else if (!goingDown && delta > showDelta) {
        setIsHidden(false);
      }

      lastScrollY.current = y;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [hideAfter, showDelta, mobileOnly, mobileBreakpoint]);

  return isHidden;
}
