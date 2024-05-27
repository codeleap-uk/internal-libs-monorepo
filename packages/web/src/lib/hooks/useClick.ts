import { TypeGuards } from '@codeleap/common'
import React, { useEffect, useRef, useCallback } from 'react'

type HandlerClickOutside = (clickedOutside: boolean) => void

type UseClickOutsideElementReturn = React.MutableRefObject<any>

export function useClickOutsideElement(
  handler: HandlerClickOutside, 
  elements: Array<React.MutableRefObject<any>> = null,
): UseClickOutsideElementReturn {
  const elementRef = useRef(null)

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (!elementRef.current) return

    const clickedOutsideElement = !elementRef.current.contains(event?.target)
    const clickedOutsideElements = [true]

    if (TypeGuards?.isArray(elements)) {
      elements?.forEach(element => {
        if (element.current) {
          clickedOutsideElements.push(!element.current.contains(event?.target))
        }
      })
    }

    if (clickedOutsideElement && clickedOutsideElements.every((clickedOutside) => !!clickedOutside)) {
      handler(true)
    } else {
      handler(false)
    }
  }, [handler])

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [handleClickOutside])

  return elementRef
}
