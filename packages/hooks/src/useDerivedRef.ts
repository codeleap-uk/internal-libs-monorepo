import { useEffect, useRef } from 'react'

export const useDerivedRef = <T, D>(
    derivedValue: D,
    getValue: (derivedValue: D) => T,
): React.MutableRefObject<T> => {
    const ref = useRef(getValue(derivedValue))

    useEffect(() => {
        ref.current = getValue(derivedValue)
    }, [derivedValue])

    return ref
}