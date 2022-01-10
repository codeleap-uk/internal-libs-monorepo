/** @jsx jsx */
import {  CSSObject, jsx } from '@emotion/react'
import { onUpdate, useBooleanToggle, useDebounce } from '@codeleap/common'
import { useRef, useState } from 'react'
import { v4 } from 'uuid'
import { View } from './View'
import {  stopPropagation } from '../lib/utils'

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

export type TooltipProps = {
    position?: TooltipPosition
    styles?: CSSObject
    showOn?: 'click' | 'hover'
}

const invert = (pos) => {
  if (['top', 'bottom'].includes(pos)) return pos === 'top' ? 'bottom' : 'top'
  if (['left', 'right'].includes(pos)) return pos === 'left' ? 'right' : 'left'
}

export const Tooltip:React.FC<TooltipProps> = ({children, position, styles, showOn}) => {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [isVisible, setVisible] = useBooleanToggle(false)
  const [isCursorOnTooltip, setCursorOnTooltip] = useState(false)
  onUpdate(() => {
    if (tooltipRef.current){
      
      const parent = tooltipRef.current.parentElement
      
      if (!parent.style.position || parent.style.position === 'static'){
        parent.style.setProperty('position', 'relative')
      }
      
      if (showOn === 'click'){
        
        const onOutsideClick = (e) => {
          const isToolTipOrParent = [
            parent.isSameNode(e.target),
            parent.contains(e.target),
            tooltipRef.current.isSameNode(e.target),
            tooltipRef.current.contains(e.target),
          ].some((a) => a)
          
          if (
            isToolTipOrParent
          ){
            if (!isVisible){
              setVisible()          
            }
          } else if (isVisible){
            setVisible(false)
          }
  
        }
          
          
          
        document.addEventListener('click', onOutsideClick)
        return () => {
            
          document.removeEventListener('click', onOutsideClick)
            
        }
      } else {
        const onEnter = () => setVisible(true)
        const onLeave = () => {
          if (isCursorOnTooltip) return
          setVisible(false)
        }
          
        parent.addEventListener('mouseenter', onEnter)
        parent.addEventListener('mouseleave', onLeave)  
          
        return () => {
          parent.removeEventListener('mouseenter', onEnter)
          parent.removeEventListener('mouseleave', onLeave)  
        }

      }
      
    }
  }, [showOn, isVisible, isCursorOnTooltip])
  const debouncedVisible = useDebounce(isVisible, 100)
  const arrowPos = arrowPositionStyles[invert(position)]

  const style = {
    position: 'absolute',
    // visibility: isVisible ? 'visible' :'hidden',
    zIndex: 10,
    transition: 'transform 0.2s ease',
    '&:after': {
      content: '""',
      position: 'absolute',
      background: 'black',
      height: 10,
      width: 10,
      ...arrowPos,
      transform: arrowPos.transform + ' rotate(45deg)',
    },
    ...styles,
    ...tooltipPositionStyles[position](10, debouncedVisible),
  } as CSSObject
  return <View css={style} ref={tooltipRef} onHover={(hovering ) => {
    setCursorOnTooltip(hovering)
    if (showOn === 'hover' && debouncedVisible && !hovering) setVisible(false)  
  }}>
    {children}
  </View>
}
