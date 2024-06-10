/** @jsx jsx */
import { jsx } from '@emotion/react'
import { View } from '../View'
import { useGlobalContext } from '@codeleap/common'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { AnyRecord, IJSX, StyledComponentProps, useTheme } from '@codeleap/styles'
import { WebStyleRegistry } from '../../lib'
import { IconProps } from './types'

const IconCP = (props:IconProps) => {

  const {
    name,
    style,
    renderEmptySpace,
    ...otherProps
  } = {
    ...IconCP.defaultProps,
    ...props,
  }

  const theme = useTheme(store => store.current)
  const styles = useStylesFor(IconCP.styleRegistryName, style)

  const { logger } = useGlobalContext()

  // @ts-expect-error @verify
  const Component = theme?.icons?.[name]

  if (!name) {
    const iconStyle = styles.icon
    return renderEmptySpace ? (
      <View
        style={{
          // @ts-expect-error @verify
          height: iconStyle.size ?? iconStyle.height,
          // @ts-expect-error @verify
          width: iconStyle.size ?? iconStyle.width,
        }}
      />
    ) : null
  }

  if (!Component) {
    logger.warn(
      `Icon: No icon found in theme for name "${name}".`,
      { props: { style, name, styles }},
      'Component',
    )
    return null
  }
  return <Component {...otherProps} style={styles.icon} />
}

IconCP.styleRegistryName = 'Icon'
IconCP.elements = ['icon']
IconCP.rootElement = 'icon'

IconCP.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return IconCP as (props: StyledComponentProps<IconProps, typeof styles>) => IJSX
}

IconCP.defaultProps = {} as Partial<IconProps>

WebStyleRegistry.registerComponent(IconCP)

export const Icon = IconCP as ((props: IconProps) => jsx.JSX.Element)

export * from './styles'
export * from './types'
