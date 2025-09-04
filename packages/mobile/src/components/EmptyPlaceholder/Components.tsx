import React from 'react'
import { AppIcon, useCompositionStyles } from '@codeleap/styles'
import { Icon } from '../Icon'
import { Text } from '../Text'
import { EmptyPlaceholderButtonProps, EmptyPlaceholderIllustrationProps, EmptyPlaceholderInfoProps } from './types'
import { Image } from '../Image'
import { useEmptyPlaceholderContext } from './context'
import { Button } from '../Button'
import { View } from '../View'
import { ActivityIndicator } from '../ActivityIndicator'
import { TypeGuards } from '@codeleap/types'

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
  const { styles, buttonText, text, onPress, ...buttonProps } = useEmptyPlaceholderContext(props)

  const buttonStyles = useCompositionStyles('button', styles)

  const displayText = text || buttonText

  if (!TypeGuards.isFunction(onPress)) return null

  return (
    <Button
      {...buttonProps}
      onPress={onPress}
      debugName={`emptyPlaceholderButton:${buttonText}`}
      style={buttonStyles}
      text={displayText}
    />
  )
}

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

export const EmptyPlaceholderContent = ({ children }: React.PropsWithChildren) => {
  const { loading, styles } = useEmptyPlaceholderContext()

  if (loading) {
    return <EmptyPlaceholderLoading />
  }

  if (children) {
    return <View style={styles.wrapper}>{children}</View>
  }

  return (
    <View style={styles.wrapper}>
      <EmptyPlaceholderIllustration />
      <EmptyPlaceholderInfo />
      <EmptyPlaceholderButton />
    </View>
  )
}
