import { onUpdate } from '@codeleap/common';
import {  useState } from 'react';

export function useWindowSize(){
  const [size, setSize] = useState([window.innerWidth, window.innerWidth])

  function handleResize(){
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

export function useToggle<T extends readonly [any, any], V extends T[0]|T[1]>(options: T, initial:V){
  const [value, setValue] = useState(initial)

  function toggleOrSetValue(newValue?: V){
    const v:V = newValue || options[Math.abs(options.indexOf(value) - 1)]

    setValue(v)
  }

  return [value, toggleOrSetValue] as const
}

export function useBooleanToggle(initial:boolean){
  const [v, setV] = useState(initial)

  function toggleOrSet(value?:boolean){
    if (typeof value === 'boolean'){
      setV(value)
    } else {
      setV(previous => !previous)
    }

  }

  return [v, toggleOrSet] as const
}
