import React from 'react'
import { theme } from '@/app'
import { customTextStyles } from '@/app/stylesheets/Text'
import { View, CenterWrapper, Drawer, Logo, Link, ActionIcon } from '@/components'
import { onUpdate, useState } from '@codeleap/common'
import { createStyles } from '@codeleap/styles'
import { useMediaQuery } from '@codeleap/web'
import { useLocation } from '@reach/router'
import { ElementType } from 'react'

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
    name: 'CLI',
    url: '/cli',
  },
  {
    name: 'Concepts',
    url: '/concepts',
  },
  {
    name: 'Updates',
    url: '/updates',
    page: true,
  },
]

const BREAKPOINT = 'tabletSmall'

const NavContent = () => {
  const location = useLocation()

  return (
    <View style={['gap:1', 'center', { breakpoints: { tabletSmall: ['column', 'gap:2', 'alignStart', 'paddingVertical:3'] } }]}>
      {
        navItems.map(i => {
          const isSelected = location?.pathname?.includes(i?.url)
          return (
            <Link
              key={i.url}
              text={i.name}
              to={i.url + (i?.page ? '/' : '/index')}
              style={[styles.navItem, isSelected && styles['navItem:selected']]}
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
      debugName='header'
      open={drawerOpen}
      size={75}
      position='right'
      toggle={toggleDrawer}
      showCloseButton
    >
      <NavContent />
    </Drawer>

    <ActionIcon
      debugName='close header'
      icon='menu'
      style={['marginLeft:auto', 'minimal', 'neutral10']}
      onPress={toggleDrawer}
    />
  </>
}

export const Header = ({ center, searchBar = null }) => {
  const mediaQuery = theme.media.down(BREAKPOINT)
  const isMobile = useMediaQuery(mediaQuery, { getInitialValueInEffect: false })

  const Wrapper: ElementType = center ? CenterWrapper : View

  return (
    <Wrapper
      style={[
        styles.floatingHeader, 
        { innerWrapper: styles.wrapper, wrapper: styles.floatingHeader }
      ]}
    >
      <Link to={'/'} style={styles.logoWrapper}>
        <Logo debugName='logo' />
      </Link>

      {searchBar}

      {isMobile ? (
        <DrawerMenu isMobile={isMobile} />
      ) : (
        <View style={'alignCenter'}>
          <NavContent />
        </View>
      )}
    </Wrapper>
  )
}

const closeIconSize = 24
const logoSize = 32

const styles = createStyles((theme) => ({
  wrapper: {
    ...theme.presets.row,
    ...theme.presets.alignCenter,
  },
  floatingHeader: {
    position: 'static',
    zIndex: 2,
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.transparent,
    backdropFilter: 'blur(4px)',

    paddingLeft: 40,
    paddingRight: 40,

    borderBottom: `1px solid ${theme.colors.neutral3}`,
    alignItems: 'center',
  },
  logoWrapper: {
    marginRight: 'auto',
    textDecoration: 'none',

    [theme.media.down(BREAKPOINT)]: {
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
    ...theme.border({ width: 1, color: 'neutral5' }),
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
    ...customTextStyles('h5'),
    ...theme.presets.textCenter,
    color: theme.colors.neutral9,
    fontWeight: '600',
    textDecoration: 'none',
    ...theme.spacing.paddingHorizontal(2),
    ...theme.spacing.paddingVertical(0.5),
    borderRadius: theme.borderRadius.rounded,

    [theme.media.down(BREAKPOINT)]: {
      width: '100%',
      ...customTextStyles('p1'),
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

    [theme.media.down(BREAKPOINT)]: {
      backgroundColor: theme.colors.primary1,
      color: theme.colors.primary3,
      fontWeight: '600',
    },
  },
}))
