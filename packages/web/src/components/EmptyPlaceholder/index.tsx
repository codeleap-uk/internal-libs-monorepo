import React from 'react'
import { Icon } from '../Icon'
import { View } from '../View'
import { Text } from '../Text'
import { ActivityIndicator } from '../ActivityIndicator'
import {
  IconPlaceholder,
  TypeGuards,
} from '@codeleap/common'
import { EmptyPlaceholderProps } from './types'
import { useStylesFor } from '../../lib/hooks/useStylesFor'
import { WebStyleRegistry } from '../../lib'
import { AnyRecord, IJSX, StyledComponentProps, useNestedStylesByKey } from '@codeleap/styles'

export const EmptyPlaceholder = (props: EmptyPlaceholderProps) => {

  const {
    itemName,
    title,
    loading,
    description,
    style,
    icon: IconEmpty = null,
    renderEmpty: RenderEmpty = null,
    wrapperProps = {},
    imageWrapperProps = {},
    indicatorProps = {},
    debugName,
  } = {
    ...EmptyPlaceholder.defaultProps,
    ...props,
  }

  const styles = useStylesFor(EmptyPlaceholder.styleRegistryName, style)

  const emptyText = title || (itemName && `No ${itemName} found.`) || 'No items.'

  const activityIndicatorStyles = React.useMemo(() => {
    return useNestedStylesByKey('loader', styles)
  }, [styles])

  const _Image = React.useMemo(() => {
    if (TypeGuards.isNil(IconEmpty)) return null

    if (TypeGuards.isString(IconEmpty)) {
      return <Icon debugName={debugName} name={IconEmpty as IconPlaceholder} forceStyle={styles.icon} />
    } else if (React.isValidElement(IconEmpty)) {
      return <IconEmpty {...props} />
    }
  }, [IconEmpty])

  if (loading) {
    return (
      <View css={[styles.wrapper, styles['wrapper:loading']]}>
        <ActivityIndicator debugName={debugName} {...indicatorProps} styles={activityIndicatorStyles}/>
      </View>
    )
  }

  if (!TypeGuards.isNil(RenderEmpty)) {
    const _emptyProps = {
      emptyText,
      emptyIconName: IconEmpty as IconPlaceholder,
      styles: {
        ...styles,
        activityIndicatorStyles,
      },
    }

    return (
      <View {...wrapperProps} css={[styles.wrapper, style]}>
        <RenderEmpty {..._emptyProps}/>
      </View>
    )
  }

  return (
    <View {...wrapperProps} css={[styles.wrapper, style]}>
      <View {...imageWrapperProps} css={styles.imageWrapper}>
        {_Image}
      </View>

      {TypeGuards.isString(emptyText)
        ? <Text debugName={debugName} text={emptyText} css={styles.title}/>
        : React.isValidElement(emptyText) ? emptyText : null
      }

      {TypeGuards.isString(description)
        ? <Text debugName={debugName} text={description} css={styles.description}/>
        : React.isValidElement(description) ? description : null
      }
    </View>
  )
}

EmptyPlaceholder.styleRegistryName = 'EmptyPlaceholder'

EmptyPlaceholder.elements = [
  'wrapper',
  `loader`,
  'title',
  'description',
  'image',
  'imageWrapper',
  'icon',
]

EmptyPlaceholder.rootElement = 'wrapper'

EmptyPlaceholder.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return EmptyPlaceholder as (props: StyledComponentProps<EmptyPlaceholderProps, typeof styles>) => IJSX
}

EmptyPlaceholder.defaultProps = {} as Partial<EmptyPlaceholderProps>

WebStyleRegistry.registerComponent(EmptyPlaceholder)

export * from './styles'
export * from './types'
