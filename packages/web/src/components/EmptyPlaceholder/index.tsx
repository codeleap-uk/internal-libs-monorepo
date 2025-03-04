import React from 'react'
import { Icon } from '../Icon'
import { View } from '../View'
import { Text } from '../Text'
import { ActivityIndicator } from '../ActivityIndicator'
import { TypeGuards } from '@codeleap/types'
import { EmptyPlaceholderProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib/WebStyleRegistry'
import { AnyRecord, AppIcon, IJSX, StyledComponentProps, useNestedStylesByKey } from '@codeleap/styles'

export * from './styles'
export * from './types'

export const EmptyPlaceholder = (props: EmptyPlaceholderProps) => {
  const {
    itemName,
    title,
    loading,
    description,
    style,
    icon: IconEmpty,
    renderEmpty: RenderEmpty,
    image,
    imageProps,
    wrapperProps,
    imageWrapperProps,
    indicatorProps,
    debugName,
    ImageComponent,
  } = {
    ...EmptyPlaceholder.defaultProps,
    ...props,
  }

  const styles = useStylesFor(EmptyPlaceholder.styleRegistryName, style)

  const emptyText = title || (itemName && `No ${itemName} found.`) || 'No items.'

  const activityIndicatorStyles = useNestedStylesByKey('loader', styles)

  const _Image = React.useMemo(() => {

    if (!TypeGuards.isNil(image)) {

      return <ImageComponent
        {...imageProps}
        // @ts-ignore
        source={image as HTMLImageElement['src']}

        css={styles.image}
      />
    }

    if (TypeGuards.isNil(IconEmpty)) return null

    if (TypeGuards.isString(IconEmpty)) {
      return <Icon debugName={debugName} name={IconEmpty as AppIcon} forceStyle={styles.icon} />
    } else if (React.isValidElement(IconEmpty)) {
      return <IconEmpty {...props} />
    }
  }, [IconEmpty, image])

  if (loading) {
    return (
      <View style={[styles.wrapper, styles['wrapper:loading']]}>
        <ActivityIndicator debugName={debugName} {...indicatorProps} style={activityIndicatorStyles} />
      </View>
    )
  }

  if (!TypeGuards.isNil(RenderEmpty)) {
    return (
      <View {...wrapperProps} style={styles.wrapper}>
        <RenderEmpty
          emptyText={emptyText}
          emptyIconName={IconEmpty as AppIcon}
          styles={{
            ...styles,
            activityIndicatorStyles,
          }}
        />
      </View>
    )
  }

  return (
    <View {...wrapperProps} style={styles.wrapper}>
      <View {...imageWrapperProps} style={styles.imageWrapper}>
        {_Image}
      </View>

      {TypeGuards.isString(emptyText)
        ? <Text debugName={debugName} text={emptyText} style={styles.title} />
        : React.isValidElement(emptyText) ? emptyText : null
      }

      {TypeGuards.isString(description)
        ? <Text debugName={debugName} text={description} style={styles.description} />
        : React.isValidElement(description) ? description : null
      }
    </View>
  )
}

EmptyPlaceholder.styleRegistryName = 'EmptyPlaceholder'
EmptyPlaceholder.elements = ['wrapper', 'loader', 'title', 'description', 'image', 'imageWrapper', 'icon']
EmptyPlaceholder.rootElement = 'wrapper'
EmptyPlaceholder.ImageComponent = 'img'
EmptyPlaceholder.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return EmptyPlaceholder as (props: StyledComponentProps<EmptyPlaceholderProps, typeof styles>) => IJSX
}

EmptyPlaceholder.defaultProps = {} as Partial<EmptyPlaceholderProps>

WebStyleRegistry.registerComponent(EmptyPlaceholder)
