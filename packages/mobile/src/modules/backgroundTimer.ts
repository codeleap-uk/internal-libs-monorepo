import { AnyFunction } from '@codeleap/types'
import BackgroundTimer from '@boterop/react-native-background-timer'
import { uuid } from '..'

const throttleTimerId = {}

export function throttle(func:AnyFunction, ref?: string, delay = 200) {
  if (!ref) {
    ref = uuid.v4() as string
  }
  if (throttleTimerId[ref]) {
    return
  }
  throttleTimerId[ref] = BackgroundTimer.setTimeout(function () {
    func()
    throttleTimerId[ref] = undefined
  }, delay)

  return ref
}

const debounceTimerId = {}

export function debounce(func:AnyFunction, ref?: string, delay = 200) {
  if (!ref) {
    ref = uuid.v4() as string
  }

  if (debounceTimerId[ref]) {
    BackgroundTimer.clearTimeout(debounceTimerId[ref])
  }

  debounceTimerId[ref] = BackgroundTimer.setTimeout(function () {
    func()
    debounceTimerId[ref] = undefined
  }, delay)

  return ref
}
