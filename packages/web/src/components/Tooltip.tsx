/** @jsx jsx */
import {  CSSObject, jsx } from '@emotion/react'
import { ComponentVariants, onUpdate, TooltipComposition, TooltipStyles, useBooleanToggle, useComponentStyle, useDebounce } from '@codeleap/common'
import { ReactNode, useRef, useState } from 'react'
import { v4 } from 'uuid'
import { View } from './View'
import {  stopPropagation} from '../lib/utils'
import { StylesOf } from '../types/utility'
import { Touchable } from './Touchable'
import {  useClickOutside } from '../lib/hooks'

type TooltipPosition = 'left'| 'top' | 'bottom' | 'right'
const arrowPositionStyles = {
  left: {
    right: `100%`,
    top: '50%',
    transform: 'translate(50%,-50%)',
  },
  right: {
    left: `100%`,
    top: '50%',
    transform: 'translate(-50%,-50%)',
  },
  bottom: {
    left: '50%',
    top: `100%`,
    transform: 'translate(-50%,-50%)',
  },
  top: {
    left: '50%',
    bottom: `100%`,
    transform: 'translate(-50%,50%)',
  },
}

const tooltipPositionStyles = {
  left: (arrow = 0, visible = false) => ({
    right: `calc(100% + ${arrow}px)`,
    top: '50%',
    transform: `translate(0%,-50%) scale(${visible ? '1' : '0' })`,
  }),
  right: (arrow = 0, visible = false) => ({
    left: `calc(100% + ${arrow}px)`,
    top: '50%',
    transform: `translate(0%,-50%) scale(${visible ? '1' : '0' })`,
  }),
  bottom: (arrow = 0, visible = false) => ({
    left: '50%',
    top: `calc(100% + ${arrow}px)`,
    transform: `translate(-50%,0%) scale(${visible ? '1' : '0' })`,
  }),
  top: (arrow = 0, visible = false) => ({
    left: '50%',
    bottom: `calc(100% + ${arrow}px)`,
    transform: `translate(-50%,0%) scale(${visible ? '1' : '0' })`,
  }),
}

const borders = {
  left: ['top','right'],
  right: ['left', 'bottom'],
  bottom: ['top','left'],
  top: ['bottom','right'],
}

export type TooltipProps = {
    position: TooltipPosition
    styles?: StylesOf<TooltipComposition>
    showOn?: 'click' | 'hover'
    content?:ReactNode
} & ComponentVariants<typeof TooltipStyles>

const invert = (pos) => {
  if (['top', 'bottom'].includes(pos)) return pos === 'top' ? 'bottom' : 'top'
  if (['left', 'right'].includes(pos)) return pos === 'left' ? 'right' : 'left'
}

export const Tooltip:React.FC<TooltipProps> = (props) => {
  const {children, position, styles,variants,responsiveVariants, showOn, content} = props

  const tooltipRef = useRef<HTMLDivElement>(null)
  const [isVisible, setVisible] = useBooleanToggle(false)
 
 
  const debouncedVisible = useDebounce(isVisible, 100)
  const arrowPos = arrowPositionStyles[invert(position)]

  const variantStyles = useComponentStyle('Tooltip', {
    responsiveVariants,
    variants,
    styles
  })

  const style = {
    transition: 'transform 0.2s ease',
    ...variantStyles.wrapper,
    '&:after': {
      ...variantStyles.arrow,
      ...arrowPos,
      transform: arrowPos.transform + ' rotate(45deg)',
    },
    ...styles,
    ...tooltipPositionStyles[position](10, debouncedVisible),
  } as CSSObject

  const wrapperId = useClickOutside(() => {
    if(isVisible){
      setVisible(false)
    } 
  },{
    deps: [setVisible, isVisible]
  })

  if(showOn === 'click'){
    return <Touchable onPress={() => setVisible()}  id={wrapperId}>
      <View css={style} ref={tooltipRef} >
        {content}
      </View>
      {children}
    </Touchable>
     
  }


  
  return <View onHover={setVisible} id={wrapperId}>
      <View css={style} >
        {content}
      </View>
      {children}
    </View>
}
