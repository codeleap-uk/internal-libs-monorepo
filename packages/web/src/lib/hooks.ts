import { AnyFunction, onMount, onUpdate } from '@codeleap/common'
import { useCallback, useRef, useState } from 'react'
import { v4 } from 'uuid'
export function useWindowSize() {
  const [size, setSize] = useState([])

  onMount(() => {
    setSize([window.innerWidth, window.innerWidth])
  })

  function handleResize() {
    setSize([window.innerWidth, window.innerHeight])
  }

  onUpdate(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return size
}

type UseClickOutsideOpts = any[]
export function useClickOutside(
  callback: AnyFunction,
  deps: UseClickOutsideOpts,
) {
  const id = useRef(v4())
  const onClick = useCallback((e: Event) => {
    const element = document.getElementById(id.current)

    let isInside = element.contains(e.target as Node) || ((e.target as HTMLElement).id === id.current)

    const iterNodes = (el:HTMLElement|Element) => {
      if (isInside) return
      for (let i = 0; i < el.children.length; i++) {
        const node = el.children.item(i)
        console.log(node)
        const _isInside = node.contains(e.target as Node)
        if (_isInside) {
          isInside = _isInside
        }
        if (isInside) break

        if (node.hasChildNodes()) {
          iterNodes(node)
        }

        if (isInside) break
      }
    }

    if (!isInside) {
      iterNodes(element)
    }
    console.log(isInside, element, e.target)
    if (!isInside) {
      callback(e)
    }
  }, deps)
  onUpdate(() => {

    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onClick)
    }
  }, [onClick])

  return id
}

export function useScrollEffect(
  effect: (passed: boolean, current: number) => any,
  breakpoint: number,
  extraDependencies = [],
) {
  function handleScroll() {
    const passed = window.scrollY > breakpoint
    effect(passed, window.scrollY)
  }

  onUpdate(() => {
    document.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [breakpoint, ...extraDependencies])
}
