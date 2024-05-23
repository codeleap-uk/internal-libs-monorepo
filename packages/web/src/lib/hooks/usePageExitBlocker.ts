import { globalHistory } from '@reach/router'
import { useEffect } from 'react'

export const usePageExitBlocker = (
  handler: (willLeavePage: boolean) => void,
  deps: Array<any> = [],
  message = 'Are you sure you want to leave?',
) => {
  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (!event) return null

    event?.preventDefault()
    event.returnValue = ''
    return
  }

  useEffect(() => {
    if (!window) return null

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, deps)

  useEffect(() => {
    return globalHistory.listen((args) => {
      if (!window) return null

      const historyPathname = args?.location?.pathname
      const windowPathname = window?.location?.pathname

      const isPopAction = args?.action === 'POP'
      const isLeaveAction = args?.action === 'PUSH' && !historyPathname?.includes(windowPathname)

      if (isLeaveAction || isPopAction) {
        const willLeavePage = window.confirm(message)

        handler?.(willLeavePage)
      }
    })
  }, deps)
}
