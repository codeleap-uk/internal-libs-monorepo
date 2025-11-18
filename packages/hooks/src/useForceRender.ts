import { useReducer } from 'react'

/**
 * Hook that returns a function to force a component re-render.
 *
 * @example
 * const forceRender = useForceRender()
 * forceRender() // Forces component to re-render
 */
export function useForceRender() {
  const [_, forceRender] = useReducer((x) => x + 1, 0)
  return forceRender
}
