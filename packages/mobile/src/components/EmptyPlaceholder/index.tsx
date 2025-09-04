import React from 'react'

import { EmptyPlaceholderProps } from './types'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'
import { View } from '../View'
import { EmptyPlaceholderContext } from './context'
import { EmptyPlaceholderButton, EmptyPlaceholderIllustration, EmptyPlaceholderInfo, EmptyPlaceholderLoading } from './Components'

export * from './styles'
export * from './types'

export const EmptyPlaceholder = (props: EmptyPlaceholderProps) => {
  const {
    children,
    style,
    ...contextValue
  } = {
    ...EmptyPlaceholder.defaultProps,
    ...props,
  }

  const styles = useStylesFor(EmptyPlaceholder.styleRegistryName, style)

  return (
    <EmptyPlaceholderContext.Provider value={{ styles, ...contextValue }}>
      {contextValue?.loading ? (
        <EmptyPlaceholderLoading />
      ) : (
        <View style={styles.wrapper}>
          {children}
        </View>
      )}
    </EmptyPlaceholderContext.Provider>
  )
}

EmptyPlaceholder.styleRegistryName = 'EmptyPlaceholder'
EmptyPlaceholder.elements = ['wrapper', 'loader', 'title', 'description', 'image', 'icon']
EmptyPlaceholder.rootElement = 'wrapper'

EmptyPlaceholder.Info = EmptyPlaceholderInfo
EmptyPlaceholder.Button = EmptyPlaceholderButton
EmptyPlaceholder.Illustration = EmptyPlaceholderIllustration

EmptyPlaceholder.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return EmptyPlaceholder as ((props: StyledComponentProps<EmptyPlaceholderProps, typeof styles>) => IJSX) & Pick<typeof EmptyPlaceholder, 'Button' | 'Illustration' | 'Info'>
}

EmptyPlaceholder.defaultProps = {} as Partial<EmptyPlaceholderProps>

MobileStyleRegistry.registerComponent(EmptyPlaceholder)
