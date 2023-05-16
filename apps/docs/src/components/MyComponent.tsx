import { React, Text, View } from '@/app'
import { ComponentVariants, StylesOf, useDefaultComponentStyle } from '@codeleap/common'

import { MyComponentComposition, MyComponentStyle } from '../app/stylesheets/MyComponent'

export const MyComponent:React.FC<{
    styles?: StylesOf<MyComponentComposition>
} & ComponentVariants<typeof MyComponentStyle>> = ({ styles, variants }) => {
  const variantStyles = useDefaultComponentStyle<typeof MyComponentStyle >('MyComponent', {
    styles,
    variants,
  })

  return <View style={variantStyles.wrapper}>
    <Text text={'My Component'} style={variantStyles.text}/>
  </View>
}
