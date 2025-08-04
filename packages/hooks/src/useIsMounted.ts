import { useEffect, useLayoutEffect, useState } from 'react'

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * Hook to check if the component has mounted. SSR safe.
 * @return true after the component's html is mounted in the browser.
 */
export function useIsMounted() {
  const [mounted, setMounted] = useState(false)

  useIsomorphicLayoutEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}

/**
 * Hook to check if the code is running on the client-side.
 * NOTE: This is just a mirror of `useIsMounted` for retrocompatibility reasons
 * @return `isClient: true` after the component is mounted in the browser.
 */
export function useIsClient() {
  return {
    isClient: useIsMounted(),
  }
}
