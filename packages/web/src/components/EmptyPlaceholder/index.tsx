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
  wrapperProps?: Partial<Omit<typeof View, 'variants' | 'styles'>>
  imageWrapperProps?: Partial<Omit<typeof View, 'variants' | 'styles'>>
  indicatorProps?: Partial<ActivityIndicatorProps>
}

export const EmptyPlaceholder:React.FC<EmptyPlaceholderProps> = (props: EmptyPlaceholderProps) => {
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
    indicatorProps = {}
  } = props
  
  const emptyText = title || (itemName && `No ${itemName} found.`) || 'No items.'

  const variantStyles = useDefaultComponentStyle<'u:EmptyPlaceholder', typeof EmptyPlaceholderPresets>('u:EmptyPlaceholder', {
    variants,
    responsiveVariants,
    styles,
  })

  const activityIndicatorStyles = React.useMemo(() => {
    return getNestedStylesByKey('loader', variantStyles)
  }, [variantStyles])

  if (loading) {
    return (
      <View css={[variantStyles.wrapper, variantStyles['wrapper:loading']]}>
        <ActivityIndicator {...indicatorProps} styles={activityIndicatorStyles}/>
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
      <View css={variantStyles.wrapper}>
        <RenderEmpty {..._emptyProps}/>
      </View>
    )
  }

  const _Image = React.useMemo(() => {
    if (TypeGuards.isNil(IconEmpty)) return null

    if (TypeGuards.isString(IconEmpty)) {
      return <Icon name={IconEmpty as IconPlaceholder} forceStyle={variantStyles.icon} />
    } else if (React.isValidElement(IconEmpty)) {
      // @ts-ignore
      return <IconEmpty {...props} />
    } else {
      return <IconEmpty {...props} />
    }
  }, [])

  return (
    <View {...wrapperProps} css={[variantStyles.wrapper, style]}>
      <View {...imageWrapperProps} css={variantStyles.imageWrapper}>
        {_Image}
      </View>

      {React.isValidElement(emptyText) 
        ? emptyText 
        : <Text text={emptyText} css={variantStyles.title}/>
      }
      
      {React.isValidElement(description) 
        ? description 
        : TypeGuards.isString(description) && <Text text={description} css={variantStyles.description}/>
      }
    </View>
  )
}
