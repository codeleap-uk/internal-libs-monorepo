import React from 'react'
import { Icon } from '../Icon'
import { View } from '../View'
import { Text } from '../Text'
import { ActivityIndicator } from '../ActivityIndicator'
import { Image } from '../Image'
import { EmptyPlaceholderProps } from './types'
import { AnyRecord, AppIcon, useNestedStylesByKey, IJSX, StyledComponentProps } from '@codeleap/styles'
import { MobileStyleRegistry } from '../../Registry'
import { useStylesFor } from '../../hooks'

export * from './styles'
export * from './types'

export const EmptyPlaceholder = (props: EmptyPlaceholderProps) => {
  const {
    itemName,
    title,
    loading,
    description,
    image,
    icon = null,
    renderEmpty,
    style,
  } = {
    ...EmptyPlaceholder.defaultProps,
    ...props,
  }

  const emptyText = title || (itemName && `No ${itemName} found.`) || 'No items.'

  const styles = useStylesFor(EmptyPlaceholder.styleRegistryName, style)

  const activityIndicatorStyles = useNestedStylesByKey('loader', styles)

  if (loading) {
    return (
      <View style={[styles.wrapper, styles['wrapper:loading']]} >
        <ActivityIndicator style={activityIndicatorStyles} />
      </View>
    )
  }

  if (renderEmpty) {
    return (
      <View style={styles.wrapper}>
        {renderEmpty({
          emptyText,
          emptyIconName: icon as AppIcon,
          style: styles,
        })}
      </View>
    )
  }

  let _image = null

  if (icon) {
    _image = <Icon name={icon as AppIcon} style={styles.icon} />
  } else if (image) {
    _image = <Image source={image} style={styles.image} />
  }

  return (
    <View style={styles.wrapper}>
      {React.isValidElement(_image) ? (
        <View style={styles.imageWrapper}>
          {_image}
        </View>
      ) : null}

      {React.isValidElement(emptyText) ? emptyText : <Text text={emptyText} style={styles.title} />}
      {React.isValidElement(description) ? description : <Text text={description} style={styles.description} />}
    </View>
  )
}

EmptyPlaceholder.styleRegistryName = 'EmptyPlaceholder'
EmptyPlaceholder.elements = ['wrapper', 'loader', 'title', 'description', 'image', 'icon']
EmptyPlaceholder.rootElement = 'wrapper'

EmptyPlaceholder.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return EmptyPlaceholder as (props: StyledComponentProps<EmptyPlaceholderProps, typeof styles>) => IJSX
}

EmptyPlaceholder.defaultProps = {} as Partial<EmptyPlaceholderProps>

MobileStyleRegistry.registerComponent(EmptyPlaceholder)
