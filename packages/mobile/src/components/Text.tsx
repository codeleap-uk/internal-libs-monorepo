import * as React from 'react'
import { ComponentPropsWithoutRef, forwardRef } from 'react'
import {
  ComponentVariants,
  useDefaultComponentStyle,
  BaseViewProps,
  TextStyles,
} from '@codeleap/common'
import { Text as NativeText } from 'react-native'

export type TextProps = ComponentPropsWithoutRef<typeof NativeText> & {
  text?: string;
  variants?: ComponentVariants<typeof TextStyles>['variants'];
} & BaseViewProps;

export const Text = forwardRef<NativeText, TextProps>((textProps, ref) => {
  const { variants = [], text, style, ...props } = textProps

  const variantStyles = useDefaultComponentStyle('Text', {
    variants,
    rootElement: 'text',
  })

  const styles = [variantStyles.text, style]
  return (
    <NativeText {...props} style={styles} ref={ref}>
      {text}
    </NativeText>
  )
})
