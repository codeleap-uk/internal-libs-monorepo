import React from 'react'
import { Icon } from '../Icon'
import { View, ViewProps } from '../View'
import { Text } from '../Text'
import { ActivityIndicator, ActivityIndicatorComposition, ActivityIndicatorProps } from '../ActivityIndicator'
import { EmptyPlaceholderComposition, EmptyPlaceholderPresets } from './styles'
import {
  ComponentVariants,
  getNestedStylesByKey,
  IconPlaceholder,
  StylesOf,
  TypeGuards,
  useDefaultComponentStyle,
} from '@codeleap/common'
import { ComponentCommonProps } from '../../types'

export * from './styles'

type RenderEmptyProps = {
  emptyText: string | React.ReactElement
  emptyIconName?: IconPlaceholder
  styles: StylesOf<EmptyPlaceholderComposition> & {
    activityIndicatorStyles: StylesOf<ActivityIndicatorComposition>
  }
}

export type EmptyPlaceholderProps = ComponentVariants<typeof EmptyPlaceholderPresets> & {
  itemName?: string
  title?: React.ReactElement | string
  description?: React.ReactElement | string
  icon?: IconPlaceholder | ((props: EmptyPlaceholderProps) => JSX.Element) | null
  loading?: boolean
  styles?: StylesOf<EmptyPlaceholderComposition>
  style?: React.CSSProperties
  renderEmpty?: (props: RenderEmptyProps) => React.ReactElement
  wrapperProps?: Partial<typeof View>
  imageWrapperProps?: Partial<typeof View>
  indicatorProps?: Partial<ActivityIndicatorProps>
} & ComponentCommonProps

const defaultProps: Partial<EmptyPlaceholderProps> = {}

export const EmptyPlaceholder = (props: EmptyPlaceholderProps) => {
  const allProps = {
    ...EmptyPlaceholder.defaultProps,
    ...props,
  }

  const {
    itemName,
    title,
    loading,
    description,
    styles = {},
    style,
    variants = [],
    responsiveVariants = {},
    icon: IconEmpty = null,
    renderEmpty: RenderEmpty = null,
    wrapperProps = {},
    imageWrapperProps = {},
    indicatorProps = {},
    debugName,
  } = allProps
  
  const emptyText = title || (itemName && `No ${itemName} found.`) || 'No items.'

  const variantStyles = useDefaultComponentStyle<'u:EmptyPlaceholder', typeof EmptyPlaceholderPresets>('u:EmptyPlaceholder', {
    variants,
    responsiveVariants,
    styles,
  })

  const activityIndicatorStyles = React.useMemo(() => {
    return getNestedStylesByKey('loader', variantStyles)
  }, [variantStyles])

  const _Image = React.useMemo(() => {
    if (TypeGuards.isNil(IconEmpty)) return null

    if (TypeGuards.isString(IconEmpty)) {
      return <Icon debugName={debugName} name={IconEmpty as IconPlaceholder} forceStyle={variantStyles.icon} />
    } else if (React.isValidElement(IconEmpty)) {
      // @ts-ignore
      return <IconEmpty {...props} />
    } else {
      return <IconEmpty {...props} />
    }
  }, [])

  if (loading) {
    return (
      <View css={[variantStyles.wrapper, variantStyles['wrapper:loading']]}>
        <ActivityIndicator debugName={debugName} {...indicatorProps} styles={activityIndicatorStyles}/>
      </View>
    )
  }

  if (!TypeGuards.isNil(RenderEmpty)) {
    const _emptyProps = {
      emptyText,
      emptyIconName: IconEmpty as IconPlaceholder,
      styles: {
        ...variantStyles,
        activityIndicatorStyles,
      },
    }

    return (
      <View {...wrapperProps} css={[variantStyles.wrapper, style]}>
        <RenderEmpty {..._emptyProps}/>
      </View>
    )
  }
  
  return (
    <View {...wrapperProps} css={[variantStyles.wrapper, style]}>
      <View {...imageWrapperProps} css={variantStyles.imageWrapper}>
        {_Image}
      </View>

      {React.isValidElement(emptyText) 
        ? emptyText 
        : <Text debugName={debugName} text={emptyText} css={variantStyles.title}/>
      }
      
      {React.isValidElement(description) 
        ? description 
        : TypeGuards.isString(description) && <Text debugName={debugName} text={description} css={variantStyles.description}/>
      }
    </View>
  )
}

EmptyPlaceholder.defaultProps = defaultProps
