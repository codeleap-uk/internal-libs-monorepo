/** @jsx jsx */
import { CSSObject, jsx } from '@emotion/react'
import {
  ComponentVariants,
  TooltipComposition,
  TooltipStyles,
  useBooleanToggle,
  useComponentStyle,
  useDebounce,
} from '@codeleap/common'
import { ReactNode } from 'react'
import { View } from './View'

import { StylesOf } from '../types/utility'
import { Touchable } from './Touchable'
import { useClickOutside } from '../lib/hooks'

type TooltipPosition = 'left' | 'top' | 'bottom' | 'right';

const arrowPositionStyles = {
  left: {
    right: `100%`,
    top: '50%',
    transform: 'translate(50%,-50%)',
    borderRight: 'none',
    borderTop: 'none',
  },
  right: {
    left: `100%`,
    top: '50%',
    transform: 'translate(-50%,-50%)',
    borderLeft: 'none',
    borderBottom: 'none',
  },
  bottom: {
    left: '50%',
    top: `100%`,
    transform: 'translate(-50%,-50%)',
    borderTop: 'none',
    borderLeft: 'none',
  },
  top: {
    left: '50%',
    bottom: `100%`,
    transform: 'translate(-50%,50%)',
    borderBottom: 'none',
    borderRight: 'none',
  },
}

const tooltipPositionStyles = {
  left: (arrow = 0, visible = false) => ({
    right: `calc(100% + ${arrow}px)`,
    top: '50%',
    transform: `translate(0%,-50%) scale(${visible ? '1' : '0'})`,
  }),
  right: (arrow = 0, visible = false) => ({
    left: `calc(100% + ${arrow}px)`,
    top: '50%',
    transform: `translate(0%,-50%) scale(${visible ? '1' : '0'})`,
  }),
  bottom: (arrow = 0, visible = false) => ({
    left: '50%',
    top: `calc(100% + ${arrow}px)`,
    transform: `translate(-50%,0%) scale(${visible ? '1' : '0'})`,
  }),
  top: (arrow = 0, visible = false) => ({
    left: '50%',
    bottom: `calc(100% + ${arrow}px)`,
    transform: `translate(-50%,0%) scale(${visible ? '1' : '0'})`,
  }),
}

export type TooltipProps = {
  position: TooltipPosition;
  styles?: StylesOf<TooltipComposition>;
  showOn?: 'click' | 'hover';
  content?: string | ReactNode;
} & ComponentVariants<typeof TooltipStyles>;

const invert = (pos) => {
  switch (pos) {
    case 'left':
      return 'right'
    case 'right':
      return 'left'
    case 'top':
      return 'bottom'
    case 'bottom':
      return 'top'
  }
}

export const Tooltip: React.FC<TooltipProps> = (props) => {
  const {
    children,
    position = 'top',
    styles,
    variants,
    responsiveVariants,
    showOn,
    content,
  } = props

  const [isVisible, setVisible] = useBooleanToggle(false)

  const [debouncedVisible] = useDebounce(isVisible, 100)
  const arrowPos = arrowPositionStyles[invert(position)]

  const variantStyles = useComponentStyle('Tooltip', {
    responsiveVariants,
    variants,
    styles,
  })

  const style = {
    transition: 'transform 0.2s ease',
    ...variantStyles.bubble,
    '&:after': {
      ...variantStyles.arrow,
      ...arrowPos,
      transform: arrowPos.transform + ' rotate(45deg)',
    },
    ...styles,
    ...tooltipPositionStyles[position](10, debouncedVisible),
  } as CSSObject

  const wrapperId = useClickOutside(
    () => {
      if (isVisible) {
        setVisible(false)
      }
    },
    {
      deps: [setVisible, isVisible],
    },
  )

  if (showOn === 'click') {
    return (
      <Touchable
        onPress={() => setVisible()}
        id={wrapperId}
        css={variantStyles.wrapper}
      >
        <View css={style}>{content}</View>
        {children}
      </Touchable>
    )
  }

  return (
    <View onHover={setVisible} id={wrapperId} css={variantStyles.wrapper}>
      <View css={style}>{content}</View>
      {children}
    </View>
  )
}
