import { useRef } from 'react'
import { useGlobalContext } from '../../contexts/GlobalContext'

export function useWarning(condition: boolean, ...logArgs: any[]) {
  const logged = useRef(false)
  const { logger } = useGlobalContext()

  if (!logged.current && condition) {
    logged.current = true
    logger?.warn(...logArgs)
  }
}
