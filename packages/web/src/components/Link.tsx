/** @jsx jsx */
import {  jsx } from '@emotion/react'
import { ComponentPropsWithRef } from 'react'
import { TextProps } from '.';
import { scrollToElem } from '../lib/utils/pollyfils/scroll';
import { stopPropagation } from '../lib/utils/stopPropagation';

import { Text } from './Text';
import { Touchable } from './Touchable';

export type LinkProps =  TextProps & ComponentPropsWithRef<'a'>

const LinkText = (props) => {
  return <Text {...props} component='a'/>
}

export const Link = (linkProps:LinkProps) => {
  const { href, ...props } = linkProps

  function handleClick(event: React.MouseEvent){
    if (href.startsWith('#')){
      event.preventDefault()
      stopPropagation(event)

      scrollToElem(href)
    }
     
  }

 
  return (
    <Touchable {...props} component={LinkText} onClick={handleClick} href={href}  />
  )
}
