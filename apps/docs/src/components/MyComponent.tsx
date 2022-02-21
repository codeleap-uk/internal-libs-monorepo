import { React, Text,  View } from '@/app'
import { ComponentVariants, StylesOf, useDefaultComponentStyle } from '@codeleap/common'

import { MyComponentComposition, _MyComponentStyle } from '../app/stylesheets/MyComponent'

export const MyComponent:React.FC<{
    styles?: StylesOf<MyComponentComposition>
} & ComponentVariants<typeof _MyComponentStyle>> = ({ styles, variants }) => {
  const variantStyles = useDefaultComponentStyle<'u:MyComponent', typeof _MyComponentStyle >('u:MyComponent', {
    styles,
    variants,
  })

  return <View style={variantStyles.wrapper}>
    <Text text={'My Component'} style={variantStyles.text}/>
  </View>
}
