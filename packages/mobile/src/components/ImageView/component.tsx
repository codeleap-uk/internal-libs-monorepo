import * as React from 'react'

import { onUpdate, PropsOf, useBooleanToggle } from '@codeleap/common'
import _ImageView from 'react-native-image-viewing'
import { StatusBar } from 'react-native'
import { View } from '../View'
import { Text } from '../Text'

type FooterComponentType = React.ComponentType<{
  imageIndex: number
  imagesLength: number
}>

const FooterComponent: FooterComponentType = ({ imageIndex, imagesLength }) => (
  <View variants={['marginBottom:5', 'alignCenter']}>
    <Text text={imageIndex + 1 + '/' + imagesLength} />
  </View>
)

export type ImageViewProps = PropsOf<typeof _ImageView> & {
  showFooter?: boolean
}

export const ImageView: React.FC<ImageViewProps> = (props) => {
  const {
    showFooter = true,
  } = props

  onUpdate(() => {
    StatusBar.setHidden(props.visible)
  }, [props.visible])

  return (
    <_ImageView
      doubleTapToZoomEnabled={false}
      FooterComponent={({ imageIndex }) => showFooter ? <FooterComponent imageIndex={imageIndex} imagesLength={props.images.length} /> : null}
      presentationStyle={'overFullScreen'}
      {...props}
    />
  )
}
