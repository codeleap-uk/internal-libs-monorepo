import { CSSProperties } from 'react'
import { ThemeValues } from '.'

export type  BorderHelpers<T extends ThemeValues> = {
    [Property in keyof T['colors']] : (width: number|string, style?:CSSProperties['borderStyle']) => string
  } & {
    create: (width: number|string, color:string, style?:CSSProperties['borderStyle']) => string
  }
  
export function createBorderHelpers<T extends ThemeValues>(values:T):BorderHelpers<T>{
  const helpers = {
    create: (width, color, style = 'solid') => `${typeof width === 'number' ? `${width}px` :  width} ${style} ${color}`,
  } 
  
  for (const [name, color] of Object.entries(values.colors)){
     
    helpers[name] = (width, style = 'solid') => `${typeof width === 'number' ? `${width}px` :  width} ${style} ${color}`
  }
  
    
  return helpers as BorderHelpers<T>
}
