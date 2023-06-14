import React from 'react'
import { Icon } from '../Icon'
import { View } from '../View'
import { Text } from '../Text'
import { ActivityIndicator, ActivityIndicatorComposition } from '../ActivityIndicator'
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
  emptyText:string | React.ReactElement
  emptyIconName?: IconPlaceholder
  styles: StylesOf<EmptyPlaceholderComposition> & {activityIndicatorStyles: StylesOf<ActivityIndicatorComposition>}
}

export type EmptyPlaceholderProps = {
  itemName?: string
  title?: React.ReactElement | string
  description?: React.ReactElement | string
  icon?: IconPlaceholder | ((props: EmptyPlaceholderProps) => JSX.Element) | null
  loading?: boolean
  styles?: StylesOf<EmptyPlaceholderComposition>
  variants?: ComponentVariants<typeof EmptyPlaceholderPresets>['variants']
  renderEmpty?: (props: RenderEmptyProps) => React.ReactElement
}

export const EmptyPlaceholder:React.FC<EmptyPlaceholderProps> = (props: EmptyPlaceholderProps) => {
  const {
    itemName,
    title,
    loading,
    description,
    styles = {},
    variants = [],
    icon: IconEmpty = null,
    renderEmpty: RenderEmpty = null,
  } = props
  const emptyText = title || (itemName && `No ${itemName} found.`) || 'No items.'

  const variantStyles = useDefaultComponentStyle<'u:EmptyPlaceholder', typeof EmptyPlaceholderPresets>('u:EmptyPlaceholder', {
    variants,
    styles,
  })

  const activityIndicatorStyles = React.useMemo(() => {
    return getNestedStylesByKey('loader', variantStyles)
  }, [variantStyles])

  if (loading) {
    return (
      <View css={[variantStyles.wrapper, variantStyles['wrapper:loading']]} >
        <ActivityIndicator styles={activityIndicatorStyles}/>
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

  let _image = null

  const _Image = () => {
    if (TypeGuards.isNil(IconEmpty)) return null

    if (TypeGuards.isString(IconEmpty)) {
      return <Icon name={IconEmpty as IconPlaceholder} forceStyle={variantStyles.icon} />
    } else if (React.isValidElement(IconEmpty)) {
      // @ts-ignore
      return <IconEmpty {...props} />
    } else {
      return <IconEmpty {...props} />
    }
  }

  return (
    <View css={variantStyles.wrapper}>
      <View css={variantStyles.imageWrapper}>
        <_Image />
      </View>

      {React.isValidElement(emptyText) ? emptyText : <Text text={emptyText} css={variantStyles.title}/> }
      {React.isValidElement(description) ? description : <Text text={description} css={variantStyles.description}/> }
    </View>
  )
}
