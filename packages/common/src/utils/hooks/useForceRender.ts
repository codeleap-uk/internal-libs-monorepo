import { useReducer } from 'react'

export function useForceRender() {
  const [_, forceRender] = useReducer((x) => x + 1, 0)
  return forceRender
}
