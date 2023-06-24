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

export type TooltipProps = PrimitiveTooltipProps & {
  content: React.ReactNode
  styles?: StylesOf<TooltipComposition>
  side?: 'left' | 'right' | 'bottom' | 'top'
  isOpen?: boolean
} & ComponentVariants<typeof TooltipPresets>

export const Tooltip = (props: TooltipProps) => {
  const {
    children,
    content,
    side = 'bottom',
    isOpen,
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

  const open = !isOpen ? undefined : true

  const tooltipDirectionStyle = side ? variantsStyles[`wrapper:${side}`] : variantsStyles.wrapper

  return (
    <TooltipContainer>
      <TooltipWrapper open={open}>
        <TooltipTrigger asChild >
          {children}
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent css={[tooltipDirectionStyle, variantsStyles.wrapper]} sideOffset={2} {...rest} >
            {content}
            <TooltipArrow />
          </TooltipContent>
        </TooltipPortal>
      </TooltipWrapper>

    </TooltipContainer>
  )
}

export * from './styles'
