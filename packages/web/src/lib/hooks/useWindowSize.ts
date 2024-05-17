import { onMount, onUpdate } from '@codeleap/common'
import { useState } from 'react'

export function useWindowSize() {
  const [size, setSize] = useState([])

  onMount(() => {
    setSize([window.innerWidth, window.innerHeight])
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
