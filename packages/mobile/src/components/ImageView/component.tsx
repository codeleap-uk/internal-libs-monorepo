import React from 'react'
import { onUpdate, PropsOf } from '@codeleap/common'
import _ImageView from 'react-native-image-viewing'
import { StatusBar } from 'react-native'

export type ImageViewProps = PropsOf<typeof _ImageView>

export const ImageView = (props: ImageViewProps) => {
  onUpdate(() => {
    StatusBar.setHidden(props.visible)
  }, [props.visible])

  return (
    <_ImageView
      doubleTapToZoomEnabled={false}
      presentationStyle={'overFullScreen'}
      {...props}
    />
  )
}
