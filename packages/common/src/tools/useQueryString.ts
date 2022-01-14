import { useEffect, useRef, useState } from "react";

export function useSearchParams() {
    const searchParams = useRef(new URLSearchParams(location.search))
    const [params,setParams] = useState(() => {
        return Object.fromEntries( searchParams.current as any)
    })
    useEffect(() => {
        Object.entries(params).forEach(([k,v]) => {
            searchParams.current.set(k,v)
        })
    })

    return [params, setParams]
} 