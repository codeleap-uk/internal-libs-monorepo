import { StyleRegistry, theme } from '../styles'
import { createStyles } from '@codeleap/styles'

export type CenterWrapperComposition = 'wrapper' | 'innerWrapper'

const createCenterWrapperVariant = createStyles<CenterWrapperComposition>

const safeHorizontalPaddings = theme.presets.safeHorizontalPaddings()

export const CenterWrapperStyles = {
  default: createCenterWrapperVariant((theme) => ({
    wrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      width: '100%',
    },
    innerWrapper: {
      flex: 1,
      display: 'flex',
      width: '100%',
      maxWidth: theme.values.maxContentWidth,

      [theme.media.up('desktopHuge')]: {
        paddingLeft: safeHorizontalPaddings.desktopHuge,
        paddingRight: safeHorizontalPaddings.desktopHuge,
      },
      [theme.media.down('desktopLarge')]: {
        paddingLeft: safeHorizontalPaddings.desktopLarge,
        paddingRight: safeHorizontalPaddings.desktopLarge,
      },
      [theme.media.down('desktop')]: {
        paddingLeft: safeHorizontalPaddings.desktop,
        paddingRight: safeHorizontalPaddings.desktop,
      },
      [theme.media.down('laptop')]: {
        paddingLeft: safeHorizontalPaddings.laptop,
        paddingRight: safeHorizontalPaddings.laptop,
      },
      [theme.media.down('tablet')]: {
        paddingLeft: safeHorizontalPaddings.tablet,
        paddingRight: safeHorizontalPaddings.tablet,
      },
      [theme.media.down('tabletSmall')]: {
        paddingLeft: safeHorizontalPaddings.tabletSmall,
        paddingRight: safeHorizontalPaddings.tabletSmall,
      },
      [theme.media.down('mobile')]: {
        paddingLeft: safeHorizontalPaddings.mobile,
        paddingRight: safeHorizontalPaddings.mobile,
      },
    },
  })),
}

StyleRegistry.registerVariants('CenterWrapper', CenterWrapperStyles)
