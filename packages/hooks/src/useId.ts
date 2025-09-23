import { useRef, useId as _useId } from 'react'

export function useId<T>(id?: T) {
  const defaultId = _useId()
  const idRef = useRef(id)

  return idRef.current ?? defaultId
}