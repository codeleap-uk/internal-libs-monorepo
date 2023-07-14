import * as React from 'react'

import { ComponentVariants, useDefaultComponentStyle } from '@codeleap/common'
import { StyleSheet } from 'react-native'
import Modal, { ModalProps } from '../Modal'
import { DrawerPresets } from './styles'
export * from './styles'
export type DrawerProps = Omit<ModalProps, 'variants'> & ComponentVariants<typeof DrawerPresets>

export const Drawer:React.FC<DrawerProps> = (props) => {
  const { variants, styles, scrollProps, ...modalProps } = props

  const variantStyles = useDefaultComponentStyle('u:Drawer', {
    variants,
    styles,
    transform: StyleSheet.flatten,
  })

  return <Modal
    styles={variantStyles}
    scroll={false}

    {...modalProps}
    scrollProps={{
      ...scrollProps,
    }}
  />
}
