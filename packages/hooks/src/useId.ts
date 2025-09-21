import { useRef, useId as _useId } from 'react'

export function useId(id?: string | number) {
  const defaultId = _useId()
  const idRef = useRef(id)

  return idRef.current ?? defaultId
}