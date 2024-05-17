import { useEffect } from 'react'
import { useLayoutEffect } from 'react'

export const useIsomorphicEffect = typeof document !== 'undefined' ? useLayoutEffect : useEffect
