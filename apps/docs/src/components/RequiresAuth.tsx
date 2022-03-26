import { useAppSelector } from '@/redux'
import { onUpdate } from '@codeleap/common'

export function RequiresAuth({ onUnauthorized = null, children }) {
  const { isLoggedIn, appMounted } = useAppSelector((store) => store.Session)
  onUpdate(() => {
    if (!isLoggedIn && appMounted) {
      onUnauthorized?.()
    }
  }, [isLoggedIn, appMounted, onUnauthorized])

  return isLoggedIn ? children : null
}
