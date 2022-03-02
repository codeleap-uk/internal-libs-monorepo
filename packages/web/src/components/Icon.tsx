import React from 'react'
import {
  ComponentVariants,
  IconPlaceholder,
  IconStyles,
  useDefaultComponentStyle,
  useCodeleapContext,
} from '@codeleap/common'
import { View } from './View'

export type IconProps = {
  name: IconPlaceholder
  style?: any
  renderEmptySpace?: boolean
} & ComponentVariants<typeof IconStyles>

export const Icon: React.FC<IconProps> = ({ name, style, variants, renderEmptySpace, ...otherProps }) => {
  const { Theme, logger } = useCodeleapContext()
  const Component = Theme?.icons?.[name]

  const variantStyles = useDefaultComponentStyle('Icon', {
    variants,
    styles: {
      icon: style,
    },
    rootElement: 'icon',
  })

  if (!name) {
    const iconStyle = variantStyles.icon
    return renderEmptySpace ? <View css={{
      height: iconStyle.size ?? iconStyle.height,
      width: iconStyle.size ?? iconStyle.width,
    }}/> : null
  }

  if (!Component) {
    logger.warn(
      `Icon: No icon found in theme for name "${name}".`,
      { props: { style, name, variants, variantStyles }},
      'Component',
    )
    return null
  }
  return <Component {...otherProps} style={variantStyles.icon}/>
}
