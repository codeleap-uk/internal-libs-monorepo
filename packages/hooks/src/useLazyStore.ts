import { globalState } from "@codeleap/store"
import { useMemo } from "react"

export function useLazyStore<T>(initialValue: T) {
    const store = useMemo(() => {
        return globalState(initialValue)
    }, [])

    return store
}