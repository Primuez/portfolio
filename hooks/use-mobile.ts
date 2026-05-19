import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Safely detect mobile on both server and client.
 * Uses a synchronous initializer on the client to avoid the flash where
 * isMobile = false on first render then flips to true (which causes
 * useScroll/useTransform to produce NaN and crash React).
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // SSR: default to false (desktop layout) — safe because we suppress hydration warnings
    if (typeof window === "undefined") return false
    // Client: read immediately so the FIRST paint already has the correct value
    return window.innerWidth < MOBILE_BREAKPOINT
  })

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    // Also sync on mount in case the initializer ran during SSR
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => {
      mql.removeEventListener("change", onChange)
    }
  }, [])

  return isMobile
}
