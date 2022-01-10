import { AnyFunction, onUpdate } from '@codeleap/common';
import {  useRef, useState } from 'react';
import {v4} from 'uuid'
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

type UseClickOutsideOpts = {customId?:string, deps:any[]}
export function useClickOutside(callback: AnyFunction, {customId, deps = []} : UseClickOutsideOpts){
  const id = useRef(customId || v4()).current

  function onClick(e:Event){
    const element = document.getElementById(id)
    const isInside = element.contains(e.target as Node)
   
    if (!isInside){
      callback(e)
    }
  }
 
  onUpdate(() => {
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('click', onClick)
    }
  }, [...deps, onClick])

  return id
}
