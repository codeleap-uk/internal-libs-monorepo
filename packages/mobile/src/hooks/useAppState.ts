import { DependencyList, useEffect, useState } from 'react'
import { AppState, AppStateStatus } from 'react-native'

export function useAppState(
  callbackFn: (state: AppStateStatus) => void,
  deps: DependencyList = []
) {
  useEffect(() => {
    const listener = AppState.addEventListener('change', callbackFn)

    return () => {
      listener.remove()
    }
  }, deps)
}

export function useAppStateStatus() {
  const [status, setStatus] = useState<AppStateStatus>(AppState.currentState)

  useAppState((newStatus) => setStatus(newStatus))

  return status
}