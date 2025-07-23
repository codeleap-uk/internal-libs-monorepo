import { View } from '../View'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { AnyRecord, IJSX, StyledComponentProps, useTheme } from '@codeleap/styles'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { IconProps } from './types'

export * from './styles'
export * from './types'

export const Icon = (props:IconProps) => {
  const {
    name,
    style,
    renderEmptySpace,
    ...otherProps
  } = {
    ...Icon.defaultProps,
    ...props,
  }

  const themeIcons = useTheme(store => store.theme?.icons)

  const styles = useStylesFor(Icon.styleRegistryName, style)

  const Component = themeIcons?.[name]

  if (!name) {
    const iconStyle = styles.icon as React.CSSProperties & { size: number }

    return renderEmptySpace ? (
      <View
        style={{
          height: iconStyle.size ?? iconStyle.height,
          width: iconStyle.size ?? iconStyle.width,
        }}
      />
    ) : null
  }

  if (!Component) return null

  return <Component {...otherProps} style={styles.icon} />
}

Icon.styleRegistryName = 'Icon'
Icon.elements = ['icon']
Icon.rootElement = 'icon'

Icon.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return Icon as (props: StyledComponentProps<IconProps, typeof styles>) => IJSX
}

Icon.defaultProps = {} as Partial<IconProps>

WebStyleRegistry.registerComponent(Icon)
