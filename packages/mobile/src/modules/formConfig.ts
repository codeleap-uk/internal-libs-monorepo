import React from 'react'
import { Field } from '@codeleap/form'
import { StatusBar, View } from 'react-native'
import { Scrollable } from './scroll'

Field.methodGetPadding = (field) => {
  return StatusBar.currentHeight - 16
}

Field.methodMeasurePosition = (field, wrapperRef: React.MutableRefObject<View>) => {
  return new Promise((resolve, reject) => {
    wrapperRef.current.measure(
      (x, y, width, height, pageX, pageY) => {
        resolve({ x, y, width, height, pageX, pageY })
      }
    )
  })
}

Field.methodScrollTo = (field, scrollRef: React.MutableRefObject<Scrollable>, measure) => {
  return new Promise((resolve, reject) => {
    const target = measure?.pageY - field.getPadding()

    const unsub = scrollRef.current.subscribe('onMomentumScrollEnd', e => {
      resolve(null)
      unsub()
    })

    scrollRef.current.scrollTo({
      y: target,
      animated: true,
    })
  })
}