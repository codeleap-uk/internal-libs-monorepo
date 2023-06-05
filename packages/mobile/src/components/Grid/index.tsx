import * as React from 'react'
import { forwardRef } from 'react'
import {
  useDefaultComponentStyle,
  ComponentVariants,
} from '@codeleap/common'

import { FlatGrid, FlatGridProps, GridRenderItemInfo } from 'react-native-super-grid'
import { StyleSheet, ScrollView } from 'react-native'
import { View, ViewProps } from '../View'
import { EmptyPlaceholder, EmptyPlaceholderProps } from '../EmptyPlaceholder'
import { GridComposition, GridPresets } from './styles'
import { StylesOf } from '../../types'
import { GetKeyboardAwarePropsOptions } from '../../utils'
import { RefreshControlProps, RefreshControl } from '../RefreshControl'

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
type GridRef = React.ClassAttributes<typeof FlatGrid>['ref']
export type GridProps<
  T = any[],
  Data = T extends Array<infer D> ? D : never
> =FlatGridProps<Data> &
  Omit<ViewProps, 'variants'> & {
    separators?: boolean
    placeholder?: EmptyPlaceholderProps
    keyboardAware?: GetKeyboardAwarePropsOptions
    debugName?: string
    styles?: StylesOf<GridComposition>
    refreshControlProps?: Partial<RefreshControlProps>
  } & ComponentVariants<typeof GridPresets>

const GridCP = forwardRef<ScrollView, GridProps>(
  (flatGridProps, ref) => {
    const {
      variants = [],
      style,
      styles = {},
      onRefresh,
      refreshing,
      placeholder,
      keyboardAware,
      debugName,
      refreshControlProps = {},
      ...props
    } = flatGridProps

    const variantStyles = useDefaultComponentStyle<'u:Grid', typeof GridPresets>('u:Grid', {
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

    const Component = FlatGrid

    const _gridProps = {
      style: [variantStyles.wrapper, style],
      contentContainerStyle: variantStyles.content,
      showsVerticalScrollIndicator: false,
      ref: ref,
      ItemSeparatorComponent: separator,
      refreshControl:
          !!onRefresh && (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              {...refreshControlProps}
            />
          ),

      ListEmptyComponent: <EmptyPlaceholder {...placeholder}/>,
      ...props,
    }

    return (
      // @ts-ignore
      <Component
        {..._gridProps}

      />
    )
  },
)

export type GridComponentType = <T extends any[] = any[]>(props: FlatGridProps<T>) => React.ReactElement

export const Grid = GridCP as GridComponentType

