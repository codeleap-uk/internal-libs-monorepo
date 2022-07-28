import * as React from 'react'
import { forwardRef } from 'react'
import {
  useDefaultComponentStyle,
  ComponentVariants,
} from '@codeleap/common'

import { FlatGrid, FlatGridProps, GridRenderItemInfo } from 'react-native-super-grid'
import { RefreshControl, StyleSheet, RefreshControlProps } from 'react-native'
import { View, ViewProps } from '../View'
import { EmptyPlaceholder, EmptyPlaceholderProps } from '../EmptyPlaceholder'
import { GridComposition, GridStyles } from './styles'
import { StylesOf } from '../../types'
import listenToKeyboardEvents from 'react-native-keyboard-aware-scroll-view/lib/KeyboardAwareHOC'

export type DataboundFlatGridPropsTypes = 'data' | 'renderItem' | 'keyExtractor' | 'getItemLayout'

export type ReplaceFlatGridProps<P, T> = Omit<P, DataboundFlatGridPropsTypes> & {
  data: T[]
  keyExtractor?: (item: T, index: number) => string
  renderItem: (data: GridRenderItemInfo<T>) => React.ReactElement
  onRefresh?: () => void
  getItemLayout?: ((
    data:T,
    index: number,
) => { length: number; offset: number; index: number })
}

export * from './styles'

const KeyboardAwareFlatGrid = listenToKeyboardEvents(FlatGrid) as React.FC<FlatGridProps>

export type GridProps<
  T = any[],
  Data = T extends Array<infer D> ? D : never
> =FlatGridProps<Data> &
  Omit<ViewProps, 'variants'> & {
    separators?: boolean
    placeholder?: EmptyPlaceholderProps
    keyboardAware?: boolean
    styles?: StylesOf<GridComposition>
    refreshControlProps?: Partial<RefreshControlProps>
  } & ComponentVariants<typeof GridStyles>

const GridCP = forwardRef<FlatGrid, GridProps>(
  (flatGridProps, ref) => {
    const {
      variants = [],
      style,
      styles = {},
      onRefresh,
      refreshing,
      placeholder,
      keyboardAware = true,
      refreshControlProps = {},
      ...props
    } = flatGridProps

    const variantStyles = useDefaultComponentStyle<'u:Grid', typeof GridStyles>('u:Grid', {
      variants,
      styles,
      transform: StyleSheet.flatten,

    })

    const renderSeparator = () => {
      return (
        <View variants={['separator']}></View>
      )
    }

    const separatorProp = props.separators
    const isEmpty = !props.data || !props.data.length
    const separator = !isEmpty && separatorProp == true && renderSeparator

    const Component = keyboardAware ? KeyboardAwareFlatGrid : FlatGrid
    const refreshStyles = StyleSheet.flatten([variantStyles.refreshControl, styles.refreshControl])

    return (
      <Component
        style={[variantStyles.wrapper, style]}
        contentContainerStyle={variantStyles.content}
        ref={ref as unknown as FlatGrid}
        ItemSeparatorComponent={separator}
        refreshControl={
          !!onRefresh && (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={refreshStyles?.color}
              colors={[refreshStyles?.color]}
              {...refreshControlProps}
            />
          )
        }

        ListEmptyComponent={<EmptyPlaceholder {...placeholder}/>}
        {...props}
      />
    )
  },
)

export type GridComponentType = <T extends any[] = any[]>(props: FlatGridProps<T>) => React.ReactElement

export const Grid = GridCP as GridComponentType

