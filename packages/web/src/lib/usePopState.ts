import { AnyFunction, useIsomorphicEffect, useUnmount } from '@codeleap/common'

export const usePopState = (dependence: boolean, handler: AnyFunction) => {
  useIsomorphicEffect(() => {
    if (dependence) {
      window.history.pushState(null, null, window.location.pathname)
      window.addEventListener('popstate', handler)
    } else {
      window.removeEventListener('popstate', handler)
    }
  }, [dependence])

  useUnmount(() => {
    window.removeEventListener('popstate', handler)
  })
}
