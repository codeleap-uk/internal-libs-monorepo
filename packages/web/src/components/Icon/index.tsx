/** @jsx jsx */
import { CSSObject, jsx } from '@emotion/react'
import { CSSInterpolation } from '@emotion/css'
import {
  ComponentVariants,
  IconPlaceholder,
  IconStyles,
  useDefaultComponentStyle,
  useCodeleapContext,
} from '@codeleap/common'
import { View } from '../View'

export * from './styles'

export type IconProps = {
  name: IconPlaceholder
  style?: any
  renderEmptySpace?: boolean
  forceStyle?: CSSObject | CSSInterpolation | React.CSSProperties
  css?: any
} & ComponentVariants<typeof IconStyles>

const IconCP = ({ name, style, variants, renderEmptySpace, ...otherProps }:IconProps) => {
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
  return <Component css={variantStyles.icon} {...otherProps}/>
}

export const Icon = IconCP as ((props: IconProps) => jsx.JSX.Element)
