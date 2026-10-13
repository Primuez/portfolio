import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Safely detect mobile device screen size on client side.
 * Defaults to false on SSR and initial client hydration to prevent
 * React 19 hydration mismatches between SSR HTML and initial client DOM.
 * Syncs to actual window.innerWidth inside useEffect after mounting.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Sync on mount after hydration
    checkMobile();

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    mql.addEventListener("change", checkMobile);
    return () => {
      mql.removeEventListener("change", checkMobile);
    };
  }, []);

  return isMobile;
}
