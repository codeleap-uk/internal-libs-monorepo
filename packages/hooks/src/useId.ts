import { useRef } from 'react'
import uuid from 'react-native-uuid'

export function useId(id = uuid.v4()) {
  const idRef = useRef(id)

  return idRef.current as unknown as string
}