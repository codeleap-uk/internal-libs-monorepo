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
import { TooltipComposition, TooltipPresets } from './styles'

export type TooltipProps = PrimitiveTooltipProps & React.PropsWithChildren<{}> & {
  content: React.ReactNode
  styles?: StylesOf<TooltipComposition>
} & ComponentVariants<typeof TooltipPresets>

export const TooltipCP = (props: TooltipProps) => {
  const {
    children,
    content,
    variants,
    responsiveVariants,
    styles,
    ...rest
  } = props

  const variantsStyles = useDefaultComponentStyle<'u:Tooltip', typeof TooltipPresets>('u:Tooltip', {
    responsiveVariants,
    variants,
    styles,
  })

  const tooltipSide = rest.side ? variantsStyles[`wrapper:${rest.side}`] : variantsStyles.wrapper

  return (
    <TooltipContainer>
      <TooltipWrapper>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent css={[tooltipSide]} sideOffset={2} {...rest} >
            {content}
            <TooltipArrow style={variantsStyles.arrow} />
          </TooltipContent>
        </TooltipPortal>
      </TooltipWrapper>

    </TooltipContainer>
  )
}
