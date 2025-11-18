import { useEffect, useLayoutEffect, useState } from 'react'

const isReactNativeOrServer = typeof navigator !== 'undefined'

const useIsomorphicLayoutEffect =
  isReactNativeOrServer ? useLayoutEffect : useEffect

/**
 * Hook to check if the component has mounted. SSR safe.
 *
 * @example
 * const isMounted = useIsMounted()
 * if (isMounted) {
 *   // Safe to use browser APIs
 * }
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
 *
 * @example
 * const { isClient } = useIsClient()
 * if (isClient) {
 *   // Safe to use browser APIs
 * }
 */
export function useIsClient() {
  return {
    isClient: useIsMounted(),
  }
}
