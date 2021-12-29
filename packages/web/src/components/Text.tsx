/** @jsx jsx */
import {  jsx } from '@emotion/react'
import {  ComponentVariants, TextComposition, TextStyles, useComponentStyle } from '@codeleap/common';
import { ComponentPropsWithoutRef, ElementType } from 'react';
import { StylesOf } from '../types/utility';

export type TextProps< T extends ElementType = 'h1'> = {
    component?: T
    text: string
    styles?: StylesOf<TextComposition>
} & ComponentPropsWithoutRef<T> & ComponentVariants<typeof TextStyles>

export const Text = <T extends ElementType = 'p'>(textProps:TextProps<T>) => {
  const {variants = [], responsiveVariants  = {}, text, children, component = 'div', ...props} = textProps
  const styles = useComponentStyle('Text', {
    rootElement: 'text',
    responsiveVariants,
    variants,
  })

  const Component = component


  return <Component {...props} css={{...styles.text, ...props.style}} >
    {text || children}
  </Component>
}
