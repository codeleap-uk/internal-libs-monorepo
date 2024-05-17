import { useRef } from 'react'
import { useCodeleapContext } from 'src/styles'

export function useWarning(condition: boolean, ...logArgs: any[]) {
  const logged = useRef(false)
  const { logger } = useCodeleapContext()

  if (!logged.current && condition) {
    logged.current = true
    logger?.warn(...logArgs)
  }
}
