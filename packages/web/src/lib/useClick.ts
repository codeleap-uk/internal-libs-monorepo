import React, { useEffect } from 'react'

type HandlerClickOutside = (clickedOutside: boolean) => void

type UseClickOutsideElementReturn = {
  ref: React.MutableRefObject<any>
  clickedOutside: boolean
}

export function useClickOutsideElement(handler: HandlerClickOutside): UseClickOutsideElementReturn {
  const elementRef = React.useRef(null)
  const [clickedOutside, setClickedOutside] = React.useState(false)

  const handlerClickOutside = React.useCallback((to: boolean) => {
    handler(to)
    setClickedOutside(to)
  }, [handler])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (elementRef.current && !elementRef.current.contains(event.target)) {
        handlerClickOutside(true)
      } else {
        handlerClickOutside(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  return {
    ref: elementRef,
    clickedOutside,
  }
}
