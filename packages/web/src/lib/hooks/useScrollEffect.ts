import { useEffect } from 'react'

export function useScrollEffect(
  effect: (passed: boolean, current: number) => any,
  breakpoint: number,
  extraDependencies = [],
) {
  function handleScroll() {
    const passed = window.scrollY > breakpoint
    effect(passed, window.scrollY)
  }

  useEffect(() => {
    document.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [breakpoint, ...extraDependencies])
}
