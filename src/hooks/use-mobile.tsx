import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initialize with null to indicate "not calculated yet"
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Safe check for window object
    if (typeof window === 'undefined') return false
    return window.innerWidth < MOBILE_BREAKPOINT
  })

  React.useEffect(() => {
    // Safety check for SSR
    if (typeof window === 'undefined') return

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Use the matches property instead of checking innerWidth
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }

    // Set initial value using matches
    setIsMobile(mql.matches)

    // Modern event listener API
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isMobile
}