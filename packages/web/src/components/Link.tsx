/** @jsx jsx */
import {  jsx } from '@emotion/react'
import { standardizeVariants } from '@codeleap/common';
import { ElementType } from 'react';
import { TextProps } from '.';
import { scrollToElem } from '../lib/utils/pollyfils/scroll';
import { stopPropagation } from '../lib/utils/stopPropagation';
import { Text } from './Text';

export const Link = <T extends ElementType = 'a'>(linkProps:TextProps<T>) => {
  const {  variants, to, ...props } = linkProps

  function handleClick(event: React.MouseEvent){
    if (to){

      if (to.startsWith('#')){
        event.preventDefault()
        stopPropagation(event)
        
        scrollToElem(to)
      }
      
    }
  }

  const passedVariants = standardizeVariants(variants || []) as TextProps<T>['variants']
 
  return (
    <Text {...props} text={props.text} to={to} variants={[...passedVariants, 'link']} onClick={handleClick} />
  )
}
