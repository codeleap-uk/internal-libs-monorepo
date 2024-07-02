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

  const theme = useTheme(store => store.current)

  const styles = useStylesFor(Icon.styleRegistryName, style)

  // @ts-expect-error theme type
  const Component = theme?.icons?.[name]

  if (!name) {
    const iconStyle = styles.icon

    return renderEmptySpace ? (
      <View
        style={{
          // @ts-expect-error icss type
          height: iconStyle.size ?? iconStyle.height,
          // @ts-expect-error icss type
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
