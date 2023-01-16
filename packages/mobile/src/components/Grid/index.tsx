import * as React from 'react'
import { forwardRef } from 'react'
import {
  useDefaultComponentStyle,
  ComponentVariants,
} from '@codeleap/common'

import { FlatGrid, FlatGridProps, GridRenderItemInfo } from 'react-native-super-grid'
import { RefreshControl, StyleSheet, RefreshControlProps, FlatList } from 'react-native'
import { View, ViewProps } from '../View'
import { EmptyPlaceholder, EmptyPlaceholderProps } from '../EmptyPlaceholder'
import { GridComposition, GridStyles } from './styles'
import { StylesOf } from '../../types'
import { GetKeyboardAwarePropsOptions, useKeyboardAwareView } from '../../utils'

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
type GridRef = React.ClassAttributes<FlatGrid<any>>['ref']
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
  } & ComponentVariants<typeof GridStyles>

const GridCP = forwardRef<GridRef, GridProps>(
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

    const refreshStyles = StyleSheet.flatten([variantStyles.refreshControl, styles.refreshControl])
    const Component = FlatGrid

    const _gridProps = {
      style: [variantStyles.wrapper, style],
      contentContainerStyle: variantStyles.content,
      ref: ref as unknown as React.LegacyRef<GridRef>,
      ItemSeparatorComponent: separator,
      refreshControl:
          !!onRefresh && (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={refreshStyles?.color}
              colors={[refreshStyles?.color]}
              {...refreshControlProps}
            />
          ),

      ListEmptyComponent: <EmptyPlaceholder {...placeholder}/>,
      ...props,
    }
    const keyboard = useKeyboardAwareView({
      debugName,
    })
    const gridProps = keyboard.getKeyboardAwareProps(_gridProps, {
      baseStyleProp: 'contentContainerStyle',
      adapt: 'paddingBottom',
      ...keyboardAware,
    })
    return (
      // @ts-ignore 
      <Component
        {...gridProps}
        
      />
    )
  },
)

export type GridComponentType = <T extends any[] = any[]>(props: FlatGridProps<T>) => React.ReactElement

export const Grid = GridCP as GridComponentType

