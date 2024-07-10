import { forwardRef, Ref } from 'react'
import { ComponentWithDefaultProps, NativeHTMLElement } from '../../types'
import { View } from '../View'
import { AnyRecord, GenericStyledComponentAttributes, IJSX, StyledComponentProps } from '@codeleap/styles'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { ScrollComponentProps, ScrollProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'

export const Scroll = forwardRef(<T extends NativeHTMLElement = 'div'>(props: ScrollProps<T>, ref: Ref<any>) => {

  const styles = useStylesFor(Scroll.styleRegistryName, props?.style)

  return (
    // @ts-expect-error
    <View
      {...props}
      ref={ref}
      scroll
      style={styles.wrapper}
    />
  )
}) as ComponentWithDefaultProps<ScrollProps<any>> & GenericStyledComponentAttributes<AnyRecord>

Scroll.styleRegistryName = 'Scroll'
Scroll.elements = ['wrapper']
Scroll.rootElement = 'wrapper'

Scroll.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  // @ts-expect-error @verify
  return Scroll as (<T extends React.ElementType = 'div'>(props: StyledComponentProps<ScrollProps<T>, typeof styles>) => IJSX)
}

Scroll.defaultProps = {} as Partial<ScrollComponentProps>

WebStyleRegistry.registerComponent(Scroll)

export * from './styles'
export * from './types'

