import { TypeGuards } from '@codeleap/common'
import React, { useEffect } from 'react'

type HandlerClickOutside = (clickedOutside: boolean) => void

type UseClickOutsideElementReturn = {
  ref: React.MutableRefObject<any>
  clickedOutside: boolean
}

export function useClickOutsideElement(
  handler: HandlerClickOutside, 
  validators: Array<any> = [true],
  elements: Array<React.MutableRefObject<any>> = null,
): UseClickOutsideElementReturn {
  const elementRef = React.useRef(null)
  const [clickedOutside, setClickedOutside] = React.useState(false)

  const isActivated = React.useMemo(() => validators?.every(validator => !!validator), [validators])

  const handlerClickOutside = React.useCallback((to: boolean) => {
    handler(to)
    setClickedOutside(to)
  }, [handler, validators])

  const handleClickOutside = React.useCallback((event: MouseEvent) => {
    if (!isActivated || !elementRef.current) return

    const elementClickedOutside = !elementRef.current.contains(event.target)

    let elementsClickedOutside = true

    if (TypeGuards?.isArray(elements)) {
      elements?.forEach(element => {
        if (element.current) {
          elementsClickedOutside = !element.current.contains(event.target)
        }
      })
    }

    if (elementClickedOutside && elementsClickedOutside) {
      handlerClickOutside(true)
    } else {
      handlerClickOutside(false)
    }
  }, [handlerClickOutside, isActivated])

  useEffect(() => {
    if (isActivated) {
      document.addEventListener('click', handleClickOutside)

      return () => {
        document.removeEventListener('click', handleClickOutside)
      }
    }
  }, [handleClickOutside, isActivated])

  return {
    ref: elementRef,
    clickedOutside,
  }
}
