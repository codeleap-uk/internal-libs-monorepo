import { AnyFunction, useIsomorphicEffect, useUnmount } from '@codeleap/common'

export const usePopState = (dependence: boolean, handler: AnyFunction, scrollLocked = true) => {
  useIsomorphicEffect(() => {
    if (dependence) {
      if (scrollLocked) {
        document.body.style.overflow = 'hidden'
        document.body.style.overflowX = 'hidden'
        document.body.style.overflowY = 'hidden'
        document.body.style.maxHeight = '100vh'
      }

      window.history.pushState(null, null, window.location.pathname)
      window.addEventListener('popstate', handler)
    } else {
      if (scrollLocked) {
        document.body.style.overflow = 'hidden'
        document.body.style.overflowX = 'hidden'
        document.body.style.overflowY = 'auto'
        document.body.style.maxHeight = 'auto'
      }

      window.removeEventListener('popstate', handler)
    }
  }, [dependence])

  useUnmount(() => {
    window.removeEventListener('popstate', handler)
  })
}
