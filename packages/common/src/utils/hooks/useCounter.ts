import { useReducer } from 'react'

export function useCounter() {
  return useReducer((x) => x + 1, 0)
}
