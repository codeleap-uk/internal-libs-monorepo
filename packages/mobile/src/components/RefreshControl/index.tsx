import React from 'react'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { RefreshControl as RNRefreshControl } from 'react-native'
import { MobileStyleRegistry } from '../../Registry'
import { RefreshControlProps } from './types'
import { useStylesFor } from '../../hooks'

export * from './styles'
export * from './types'

export const RefreshControl = (props: RefreshControlProps) => {
  const { style, ...rest } = props

  const styles = useStylesFor(RefreshControl.styleRegistryName, style)

  return (
    <RNRefreshControl
      // @ts-expect-error
      colors={[styles?.loadingAnimation?.color]} // @ts-expect-error
      tintColor={styles?.loadingAnimation?.color} // @ts-expect-error
      progressBackgroundColor={styles?.progressBackgroundColor?.color} // @ts-expect-error
      titleColor={styles?.titleColor?.color}
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

MobileStyleRegistry.registerComponent(RefreshControl)
