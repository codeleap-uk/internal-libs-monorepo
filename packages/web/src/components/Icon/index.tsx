/** @jsx jsx */
import { jsx } from '@emotion/react'
import { View } from '../View'
import { useGlobalContext } from '../../contexts/GlobalContext'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { AnyRecord, IJSX, StyledComponentProps, useTheme } from '@codeleap/styles'
import { WebStyleRegistry } from '../../lib'
import { IconProps } from './types'

export * from './styles'

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

  const Component = theme?.icons?.[name]

  if (!name) {
    const iconStyle = styles.icon
    return renderEmptySpace ? <View css={{
      height: iconStyle.size ?? iconStyle.height,
      width: iconStyle.size ?? iconStyle.width,
    }}/> : null
  }

  if (!Component) {
    logger.warn(
      `Icon: No icon found in theme for name "${name}".`,
      { props: { style, name, styles }},
      'Component',
    )
    return null
  }
  return <Component style={styles.icon} {...otherProps}/>
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
