import { View } from 'react-native'
import { GenericStyledComponent, StyleProp, StyledComponentProps } from '@codeleap/styles'
import { ViewV2Composition } from './styles'
import { MobileStyleRegistry } from '../../Registry'

type ViewV2Props = {
  style?: StyleProp<ViewV2Composition>
}

export * from './styles'

const ViewV2CP = (props: ViewV2Props) => {

  const styles = MobileStyleRegistry.current.styleFor(ViewV2.styleRegistryName, props.style)
  console.log('styles', styles)

  return (
    <View {...props} style={styles.wrapper} />
  )
}

export const ViewV2: GenericStyledComponent<typeof ViewV2CP, ViewV2Composition> = ViewV2CP

ViewV2.styleRegistryName = 'ViewV2'

ViewV2.elements = ['wrapper']

ViewV2.rootElement = 'wrapper'

ViewV2.withVariantTypes = (styles) => {
  return ViewV2 as (
    (props: StyledComponentProps<ViewV2Props, typeof styles, ViewV2Composition>) => ReturnType<typeof ViewV2CP>
  )
}

MobileStyleRegistry.registerComponent(ViewV2)
