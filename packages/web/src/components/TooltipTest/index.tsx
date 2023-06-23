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

import { ComponentVariants, StylesOf, useDefaultComponentStyle } from '@codeleap/common'
import { TooltipTestComposition, TooltipTestPresets } from './styles'

export type TooltipProps = PrimitiveTooltipProps & React.PropsWithChildren<{}> & {
  content: React.ReactNode
  styles?: StylesOf<TooltipTestComposition>
} & ComponentVariants<typeof TooltipTestPresets>

export const TooltipCP = (props: TooltipProps) => {
  const {
    children,
    content,
    variants,
    styles,
    ...rest
  } = props

  const variantsStyles = useDefaultComponentStyle<'u:TooltipTest', typeof TooltipTestPresets>('u:TooltipTest', {
    variants,
    styles,
  })

  return (
    <TooltipContainer>
      <TooltipWrapper>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent {...rest} style={{
            ...variantsStyles.wrapper, wrapper: [variantsStyles.wrapper],
          }} sideOffset={2}>
            {content}
            <TooltipArrow style={variantsStyles.arrow} />
          </TooltipContent>
        </TooltipPortal>
      </TooltipWrapper>

    </TooltipContainer>
  )
}
