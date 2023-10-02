import React from 'react'
import { useDefaultComponentStyle } from '@codeleap/common'
import { View, ViewProps } from '../View'
import { EmptyPlaceholder } from '../EmptyPlaceholder'
import { CropPickerPresets, GridPresets } from './styles'
import { CropPickerProps } from './types'
import { ListLayout, useInfiniteScroll } from '../List'
import { ItemMasonryProps, ListMasonry, useMasonryReload } from '../../lib'

export * from './styles'
export * from './types'

export function CropPicker(props: CropPickerProps) {
  const allProps = {
    ...CropPicker,
    ...props,
  } as CropPickerProps

  const {
    variants = [],
    responsiveVariants = {},
    styles = {},
  } = allProps

  const variantStyles = useDefaultComponentStyle<'u:CropPicker', typeof CropPickerPresets>('u:CropPicker', {
    variants,
    responsiveVariants,
    styles,
  })

  return (
    <Text variant={`p1`} text={`Hello world!`} /> >
  )
}

// CropPicker.defaultProps = defaultProps
