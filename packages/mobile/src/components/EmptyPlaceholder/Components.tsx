import { AppIcon, useCompositionStyles } from '@codeleap/styles'
import { Icon } from '../Icon'
import { Text } from '../Text'
import { EmptyPlaceholderButtonProps, EmptyPlaceholderIllustrationProps, EmptyPlaceholderInfoProps } from './types'
import { Image } from '../Image'
import { useEmptyPlaceholderContext } from './context'
import { Button } from '../Button'
import React from 'react'
import { View } from '../View'
import { ActivityIndicator } from '../ActivityIndicator'

export const EmptyPlaceholderInfo = (props: EmptyPlaceholderInfoProps) => {
  const { title, description, styles, itemName } = useEmptyPlaceholderContext(props)

  const emptyText = title || (itemName && `No ${itemName} found.`)

  return <>
    {title || itemName ? <Text text={emptyText} style={styles.title} /> : null}
    {description ? <Text text={description} style={styles.description} /> : null}
  </>
}

export const EmptyPlaceholderIllustration = (props: EmptyPlaceholderIllustrationProps) => {
  const { icon, image, styles } = useEmptyPlaceholderContext(props)

  return <>
    {icon ? <Icon name={icon as AppIcon} style={styles.icon} /> : null}
    {image ? <Image source={image} style={styles.image} /> : null}
  </>
}

export const EmptyPlaceholderButton = (props: EmptyPlaceholderButtonProps) => {
  const { styles, buttonText, text, ...buttonProps } = useEmptyPlaceholderContext(props)

  const buttonStyles = useCompositionStyles('button', styles)

  const txt = text || buttonText

  return (
    <Button
      {...buttonProps}
      debugName={`emptyPlaceholderButton:${buttonText}`}
      style={buttonStyles}
      text={txt}
    />
  )
}

export const EmptyPlaceholderLoading = () => {
  const { styles, loading, LoadingComponent } = useEmptyPlaceholderContext()

  const activityIndicatorStyles = useCompositionStyles('loader', styles)

  if (!loading) return null

  if (React.isValidElement(LoadingComponent)) return LoadingComponent

  return (
    <View style={[styles.wrapper, styles['wrapper:loading']]} >
      <ActivityIndicator style={activityIndicatorStyles} />
    </View>
  )
}