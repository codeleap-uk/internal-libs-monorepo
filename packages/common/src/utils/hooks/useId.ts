import {
  useId as useReactId,
} from 'react'

export function useId(prefix?: string) {
  const _id = useReactId()
  return prefix ? `${prefix}${_id}` : _id
}
