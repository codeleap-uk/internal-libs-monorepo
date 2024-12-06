import { AnyFunction } from '@codeleap/types'
import { useUnmount } from '@codeleap/hooks'
import { useIsomorphicEffect } from './useIsomorphicEffect'

export const usePopState = (dependence: boolean, handler: AnyFunction) => {
  useIsomorphicEffect(() => {
    if (dependence) {
      const pathname = location.pathname
      const searchParams = location.search
      const newUrl = pathname + searchParams

      window.history.pushState(null, null, newUrl)
      window.addEventListener('popstate', handler)
    } else {
      window.removeEventListener('popstate', handler)
    }
  }, [dependence])

  useUnmount(() => {
    window.removeEventListener('popstate', handler)
  })
}
