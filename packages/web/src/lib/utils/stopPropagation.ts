import { AnyFunction } from '@codeleap/types'

export function stopPropagation(event: any) {
  const tryCalls = [
    event?.stopPropagation.bind(event),
    event?.preventDefault.bind(event),
    event.nativeEvent?.stopImmediatePropagation.bind(event.nativeEvent) as AnyFunction,
  ]

  for (const call of tryCalls) {
    try {
      call()
    } catch (e) {}
  }
}
