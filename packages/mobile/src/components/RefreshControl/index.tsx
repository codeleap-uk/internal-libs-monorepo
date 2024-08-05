import React from 'react'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { RefreshControl as RNRefreshControl } from 'react-native'
import { MobileStyleRegistry } from '../../Registry'
import { RefreshControlProps } from './types'
import { useStylesFor } from '../../hooks'
import { ColorValue } from 'react-native'

export * from './styles'
export * from './types'

export const RefreshControl = (props: RefreshControlProps) => {
  const {
    style,
    ...rest
  } = {
    ...RefreshControl.defaultProps,
    ...props,
  }

  const styles = useStylesFor(RefreshControl.styleRegistryName, style)

  const color: ColorValue = (styles?.loadingAnimation as AnyRecord)?.color
  const titleColor: ColorValue = (styles?.titleColor as AnyRecord)?.color
  const progressBackgroundColor: ColorValue = (styles?.progressBackgroundColor as AnyRecord)?.color

  return (
    <RNRefreshControl
      colors={[color]}
      tintColor={color}
      progressBackgroundColor={progressBackgroundColor}
      titleColor={titleColor}
      {...rest}
    />
  )
}

RefreshControl.styleRegistryName = 'RefreshControl'
RefreshControl.elements = ['loadingAnimation', 'progressBackgroundColor', 'titleColor']
RefreshControl.rootElement = 'wrapper'

RefreshControl.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return RefreshControl as (props: StyledComponentProps<RefreshControlProps, typeof styles>) => IJSX
}

RefreshControl.defaultProps = {} as Partial<RefreshControlProps>

MobileStyleRegistry.registerComponent(RefreshControl)
