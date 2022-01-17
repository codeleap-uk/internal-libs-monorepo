/** @jsx jsx */
import {  jsx } from '@emotion/react'
import { standardizeVariants } from '@codeleap/common';
import { ElementType } from 'react';
import { TextProps } from '.';
import { scrollToElem } from '../lib/utils/pollyfils/scroll';
import { stopPropagation } from '../lib/utils/stopPropagation';
import { Text } from './Text';

export type LinkProps<T extends ElementType> = TextProps<T> & {
  openNewTab?:boolean
}

export const Link = <T extends ElementType = 'a'>(linkProps: LinkProps<T>) => {
  const {  variants, to, openNewTab, component = 'a', ...props } = linkProps

  const isExternal =  to.startsWith('http')

  const Component = isExternal ? 'a' : component

  function handleClick(event: React.MouseEvent){
    if (to){
      if (to.startsWith('#')){
        event.preventDefault()
        stopPropagation(event)
        
        scrollToElem(to)
      }
      if (openNewTab){
        window.open(to, '_blank')
      }
    }
  }

  const passedVariants = standardizeVariants(variants || []) as TextProps<T>['variants']
  
  const linkPropOverride = {
    [isExternal ? 'href' :  'to']: to,
  }

  return <Text   
    {...props}
    {...linkPropOverride} 
    component={Component}
    text={props.text} 
   
    variants={[...passedVariants]}
    onClick={handleClick}
  />
}
