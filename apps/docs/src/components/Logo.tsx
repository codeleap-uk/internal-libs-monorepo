import { Settings, TCSS } from '@/app'
import { ComponentVariants, PropsOf, useDefaultComponentStyle } from '@codeleap/common'
import { Text, Touchable } from '@/components'
import { LogoStyles, LogoComposition } from '../app/stylesheets/Logo'
import { StylesOf } from '@codeleap/web'

type LogoProps = {
  styles?: StylesOf<LogoComposition>
  style?: TCSS
} & ComponentVariants<typeof LogoStyles> & Omit<PropsOf<typeof Touchable>, 'variants'|'styles'>

export function Logo(props: LogoProps) {
  const { responsiveVariants, variants, styles } = props

  const variantStyles = useDefaultComponentStyle<'u:Logo', typeof LogoStyles>('u:Logo', {
    responsiveVariants,
    rootElement: 'wrapper',
    styles,
    variants,
  })

  return (
    <Text variants={['h4', 'extraBold', 'color:neutral10']} text={Settings.AppName} style={variantStyles.image} />
  )
}
