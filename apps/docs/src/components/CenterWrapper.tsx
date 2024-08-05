import React, { ReactNode } from 'react'
import { StyleSheets, StyleRegistry } from '@/app'
import { View } from '@/components'
import { CenterWrapperComposition } from '../app/stylesheets/CenterWrapper'
import { StyledProp, StyledComponent } from '@codeleap/styles'
import { useStylesFor, ViewProps } from '@codeleap/web'

export type CenterWrapperProps = {
  innerProps?: ViewProps
  style?: StyledProp<CenterWrapperComposition>
  children?: ReactNode
}

export const CenterWrapper: StyledComponent<typeof StyleSheets.CenterWrapperStyles, CenterWrapperProps> = (props) => {
  const {
    children,
    style,
    innerProps = {},
    ...rest
  } = props

  const styles = useStylesFor(CenterWrapper.styleRegistryName, style)

  return (
    <View {...rest} style={styles.wrapper}>
      <View {...innerProps} style={styles.innerWrapper}>
        {children}
      </View>
    </View>
  )
}

CenterWrapper.styleRegistryName = 'CenterWrapper'
CenterWrapper.elements = ['wrapper', 'innerWrapper']

StyleRegistry.registerComponent(CenterWrapper)
