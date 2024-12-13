import { useEffect, useState } from 'react'

/**
 * Hook to check if the code is running on the client-side.
 * @return `isClient: true` after the component is mounted in the browser.
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  return {
    isClient
  }
}