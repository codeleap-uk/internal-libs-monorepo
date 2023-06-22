import React from 'react'
import {
  Provider as TooltipContainer,
  Root as TooltipWrapper,
  Trigger as TooltipTrigger,
  Portal as TooltipPortal,
  Content as TooltipContent,
  Arrow as TooltipArrow,
  TooltipProps as PrimitiveTooltipProps,
} from '@radix-ui/react-tooltip'
import { Button } from '../Button'
import { Text } from '../Text'

import './estilo.css'
import { useDefaultComponentStyle } from '@codeleap/common'
import { TooltipTestPresets } from './styles'

export type TooltipProps = PrimitiveTooltipProps & {
  children: any
  content: any
}

export const TooltipCP = (props: any) => {
  const {
    children,
    content,
    variants,
    styles,
  } = props

  const variantsStyles = useDefaultComponentStyle<'u:TooltipTest', typeof TooltipTestPresets>('u:TooltipTest', {
    variants,
    styles,
  })

  console.log('variant styles tooltiptest', variantsStyles.wrapper)

  return (
    <TooltipContainer>
      <TooltipWrapper open={true}>
        <TooltipTrigger asChild>
          {/* Componente de exemplo */}
          {children}
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent style={variantsStyles.wrapper} sideOffset={2} side={'bottom'}>
            {content}
            <TooltipArrow style={variantsStyles.arrow} />
          </TooltipContent>
        </TooltipPortal>
      </TooltipWrapper>

    </TooltipContainer>
  )
}
