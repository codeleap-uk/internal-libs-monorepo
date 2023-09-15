import { variantProvider, Theme, assignTextStyle, React } from '@/app'
import { View, CenterWrapper, Drawer, Logo, Link, ActionIcon, Text } from '@/components'
import { onUpdate, useState } from '@codeleap/common'
import { useMediaQuery } from '@codeleap/web'
import { useLocation } from '@reach/router'

const navItems = [
  {
    name: 'Common',
    url: '/common',
  },
  {
    name: 'Web',
    url: '/web',
  },
  {
    name: 'Mobile',
    url: '/mobile',
  },
  {
    name: 'Concepts',
    url: '/concepts',
  },
]

const BREAKPOINT = 'mid'

const NavContent = () => {
  const location = useLocation()

  return (
    <View variants={['gap:1', 'center']} responsiveVariants={{ [BREAKPOINT]: ['column', 'gap:2', 'alignStart', 'paddingVertical:3'] }}>
      {
        navItems.map(i => {
          const isSelected = location?.pathname?.includes(i?.url)
          return (
            <Link
              key={i.url}
              text={i.name}
              to={i.url + '/index'}
              variants={['noUnderline']}
              css={[styles.navItem, isSelected && styles['navItem:selected']]}
            />
          )
        })
      }
    </View>
  )
}

const DrawerMenu = ({ isMobile }) => {
  const [drawerOpen, setDrawer] = useState(false)

  const toggleDrawer = (to = !drawerOpen) => {
    if (to) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    setDrawer(to)
  }

  onUpdate(() => {
    if (!isMobile && drawerOpen) {
      toggleDrawer(false)
    }
  }, [drawerOpen, isMobile])

  return <>
    <Drawer
      styles={{
        box: styles.drawer,
      }}
      css={[styles.drawer]}
      open={drawerOpen}
      size='75vw'
      position='right'
      toggle={toggleDrawer}
      showCloseButton
    >

      <NavContent />
    </Drawer>

    <ActionIcon
      icon='menu'
      variants={['marginLeft:auto', 'minimal', 'neutral10']}
      onPress={toggleDrawer}
    />
  </>
}

export const Header = ({ center, searchBar = null }) => {
  const mediaQuery = Theme.media.down(BREAKPOINT)
  const isMobile = useMediaQuery(mediaQuery, { getInitialValueInEffect: false })

  const Wrapper = center ? CenterWrapper : View

  return (
    <Wrapper
      styles={{
        innerWrapper: styles.wrapper,
        wrapper: styles.floatingHeader as any,
      }}
      style={styles.floatingHeader}
      variants={['paddingVertical:2']}
    >
      <Link to={'/'} css={styles.logoWrapper}>
        <Logo style={styles.logo} />
      </Link>

      {searchBar}

      {
        isMobile ? (
          <DrawerMenu isMobile={isMobile} />
        ) : (
          <View variants={['alignCenter']}>
            <NavContent />
          </View>
        )
      }
    </Wrapper>
  )
}

const closeIconSize = 24
const logoSize = 32

const styles = variantProvider.createComponentStyle((theme) => ({
  wrapper: {
    ...theme.presets.row,
    ...theme.presets.alignCenter,
  },
  floatingHeader: {
    position: 'sticky',
    zIndex: 2,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.transparent,
    backdropFilter: 'blur(4px)',

    paddingLeft: 40,
    paddingRight: 40,

    borderBottom: `1px solid ${theme.colors.neutral3}`,
    // justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    width: logoSize * 4,
    [Theme.media.down(BREAKPOINT)]: {
      width: logoSize,
    },
  },
  logoWrapper: {
    marginRight: 'auto',
    textDecoration: 'none',

    [Theme.media.down(BREAKPOINT)]: {
      marginRight: theme.spacing.value(0),
      display: 'flex',
      ...theme.presets.justifyCenter,
    },
  },
  drawer: {
    ...theme.presets.column,
    ...theme.presets.alignCenter,
    gap: theme.spacing.value(2),
    backgroundColor: theme.colors.background,
    alignItems: 'stretch',
  },
  close: {
    backgroundColor: theme.colors.transparent,
    color: theme.colors.neutral9,
    width: closeIconSize,
    height: closeIconSize,
  },
  closeWrapper: {
    width: closeIconSize,
    marginLeft: 'auto',
    ...theme.spacing.marginBottom(2),
  },
  profileWrapper: {
    borderRadius: theme.borderRadius.small,
    ...theme.border.neutral5({ width: 1 }),
    ...theme.presets.centerRow,
    ...theme.spacing.padding(2),
    ...theme.presets.fullWidth,
    ...theme.spacing.gap(2),
    ...theme.spacing.marginBottom(1),
  },
  profileInfos: {
    width: `calc(100% - ${theme.values.itemHeight.small + theme.spacing.value(3)}px)`,
    ...theme.presets.column,
    ...theme.presets.justifySpaceBetween,
    ...theme.spacing.gap(0.5),
  },
  email: {
    color: theme.colors.neutral8,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  navItem: {
    ...assignTextStyle('h5')(theme).text,
    ...theme.presets.textCenter,
    color: theme.colors.neutral9,
    fontWeight: '600',
    textDecoration: 'none',
    ...theme.spacing.paddingHorizontal(2),
    ...theme.spacing.paddingVertical(0.5),
    borderRadius: theme.borderRadius.rounded,

    [Theme.media.down(BREAKPOINT)]: {
      width: '100%',
      ...assignTextStyle('p1')(theme).text,
      ...theme.presets.textLeft,
      ...theme.spacing.padding(2),
      backgroundColor: theme.colors.transparent,
      borderRadius: theme.borderRadius.small,
      color: theme.colors.neutral10,
      fontWeight: '400',
    },
  },
  'navItem:selected': {
    color: theme.colors.primary3,

    backgroundColor: theme.colors.primary1,

    [Theme.media.down(BREAKPOINT)]: {
      backgroundColor: theme.colors.primary1,
      color: theme.colors.primary3,
      fontWeight: '600',
    },
  },
}), true)
