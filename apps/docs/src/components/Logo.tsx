import { AppImages, Breakpoint, Settings, TCSS, Theme } from '@/app'
import { ComponentVariants, PropsOf, useDefaultComponentStyle } from '@codeleap/common'
import { Text, Touchable } from '@/components'
import { LogoStyles, LogoComposition } from '../app/stylesheets/Logo'
import { StylesOf, useMediaQuery } from '@codeleap/web'

type LogoProps = {
  styles?: StylesOf<LogoComposition>
  style?: TCSS
  switchServerOnPress?: boolean
  breakpoint?: Breakpoint
  responsive?: boolean
  image?: any
} & ComponentVariants<typeof LogoStyles> & Omit<PropsOf<typeof Touchable>, 'variants'|'styles'>

export function Logo(props: LogoProps) {
  const { responsiveVariants, variants, styles, switchServerOnPress, image = null, breakpoint = 'mid', responsive = true } = props

  const mediaQuery = Theme.media.down(breakpoint)
  const isMobile = useMediaQuery(mediaQuery, { getInitialValueInEffect: false })

  let logoImage = AppImages.LogoTemplate

  if (responsive) {
    logoImage = isMobile ? AppImages.LogoTemplateMobile : AppImages.LogoTemplate
  }

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
