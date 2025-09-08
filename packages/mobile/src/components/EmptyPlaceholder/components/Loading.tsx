import React from 'react'
import { useCompositionStyles } from '@codeleap/styles'
import { useEmptyPlaceholderContext } from '../context'
import { View } from '../../View'
import { ActivityIndicator } from '../../ActivityIndicator'

export const EmptyPlaceholderLoading = () => {
  const { styles, loading, LoadingComponent } = useEmptyPlaceholderContext()

  const activityIndicatorStyles = useCompositionStyles('loader', styles)

  if (!loading) return null

  if (React.isValidElement(LoadingComponent)) {
    return <>{LoadingComponent}</>
  }

  return (
    <View style={[styles.wrapper, styles['wrapper:loading']]} >
      <ActivityIndicator style={activityIndicatorStyles} />
    </View>
  )
}