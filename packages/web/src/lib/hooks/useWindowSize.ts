import { useState, useEffect } from 'react'

export function useWindowSize() {
  const [size, setSize] = useState([])

  function handleResize() {
    setSize([window.innerWidth, window.innerHeight])
  }

  useEffect(() => {
    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return size
}
