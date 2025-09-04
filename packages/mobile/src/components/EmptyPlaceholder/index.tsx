import React from 'react'
import { EmptyPlaceholderProps } from './types'
import { AnyRecord, IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'
import { EmptyPlaceholderContext } from './context'
import { EmptyPlaceholderContent, EmptyPlaceholderButton, EmptyPlaceholderIllustration, EmptyPlaceholderInfo } from './Components'

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
    <EmptyPlaceholderContext.Provider value={{ ...contextValue, styles }}>
      <EmptyPlaceholderContent>
        {children}
      </EmptyPlaceholderContent>
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
