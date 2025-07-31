import { AnyFunction } from '@codeleap/types'
import { uuid } from '..'

const throttleTimerId = {}

export function throttle(func: AnyFunction, ref?: string, delay = 200) {
  if (!ref) {
    ref = uuid.v4() as string
  }
  if (throttleTimerId[ref]) {
    return
  }
  throttleTimerId[ref] = setTimeout(function () {
    func()
    throttleTimerId[ref] = undefined
  }, delay)

  return ref
}

const debounceTimerId = {}

export function debounce(func: AnyFunction, ref?: string, delay = 200) {
  if (!ref) {
    ref = uuid.v4() as string
  }

  if (debounceTimerId[ref]) {
    clearTimeout(debounceTimerId[ref])
  }

  debounceTimerId[ref] = setTimeout(function () {
    func()
    debounceTimerId[ref] = undefined
  }, delay)

  return ref
}