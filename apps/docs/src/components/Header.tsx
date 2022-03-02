import { React, Button, CenterWrapper, variantProvider, View, Tooltip, Theme, Drawer } from '@/app'
import { Logo } from './Logo'
import { Link } from './Link'
import { onUpdate, useBooleanToggle, useCodeleapContext, useComponentStyle } from '@codeleap/common'
import { AppStatus, useAppSelector } from '@/redux'
import { Avatar } from './Avatar'
import { AuthModal } from './AuthModal'
import { useNavigate } from '@reach/router'
import { navigate } from 'gatsby'
const navItems = [
  {
    name: 'Components',
    url: '/components',
  },
  {
    name: 'CRUD Example',
    url: '/crudexample',
  },
  {
    name: 'About',
    url: '/about',
  },
]

const NavButton = (buttonProps) => {
  const { url, text, ...props } = buttonProps

  return <Link to={url} {...props}>
    <Button
      text={text}
      onPress={() => {}}
      variants={['neutral']}
      responsiveVariants={{
        small: ['list'],
      }}
    />
  </Link>
}

export const Header = () => {
  const { currentTheme } = useCodeleapContext()
  const { isLoggedIn, profile } = useAppSelector(store => store.Session)
  const styles = useComponentStyle(componentStyles)
  const [drawerOpen, setDrawer] = useBooleanToggle(false)

  const toggleTheme = () => {
    variantProvider.setColorScheme(currentTheme == 'dark' ? 'light' : 'dark')
  }
  const isMobile = Theme.hooks.down('small')

  const toggleDrawer = () => {
    if (drawerOpen) {
      document.body.style.overflow = 'auto'
    } else {
      document.body.style.overflow = 'hidden'
    }

    setDrawer()
  }

  onUpdate(() => {

    if (!isMobile && drawerOpen) {
      toggleDrawer()
    }

  }, [drawerOpen, isMobile])

  const NavComponent = isMobile ? Drawer : View

  return <>
    <CenterWrapper styles={{ innerWrapper: styles.wrapper, wrapper: styles.floatingHeader }}>
      <Link to={'/'} css={styles.logoWrapper}>
        <Logo variants={currentTheme === 'dark' ? 'white' : 'black'} style={styles.logo}/>
      </Link>
      <NavComponent styles={{
        box: styles.nav,

      }} css={styles.nav} open={drawerOpen} size='50vh' position='left' toggle={toggleDrawer} >
        {
          isMobile && <Link to={'/'} css={styles.logoWrapper}>
            <Logo
              variants={currentTheme === 'dark' ? 'white' : 'black'}
              style={styles.logo}
            />
          </Link>
        }
        <View variants={['gap:2', 'padding:1']} responsiveVariants={{ small: ['column'] }}>

          {
            navItems.map(i => (
              <Link key={i.url} text={i.name} to={i.url} css={styles.navLink} />
            ))
          }
        </View>
        <Button
          variants={['icon', 'marginRight:1']}

          responsiveVariants={{

            small: ['marginHorizontal:auto', 'marginVertical:3'],
          }}
          styles={{ icon: styles.themeSwitch }}
          onPress={toggleTheme}
          icon={currentTheme === 'dark' ? 'darkMode' : 'lightMode'}
        />
        {
          isMobile && <View variants={['separator', 'marginVertical:3']} />
        }

        <Avatar
          profile={profile}
          variants={['small', 'alignSelfCenter']}
          debugName={'Header Avatar'}
          onPress={() => {
            if (isLoggedIn) {
              navigate('/profile')
            } else {
              AppStatus.setModal('auth')

            }
          }}
        />

      </NavComponent>
      {
        isMobile && (
          <Button
            icon='menu'
            variants={['marginLeft:auto', 'icon', currentTheme === 'dark' ? 'icon:white' : 'icon:black']}
            onPress={() => toggleDrawer()}
          />
        )
      }
    </CenterWrapper>
    <AuthModal/>
  </>
}

const componentStyles = variantProvider.createComponentStyle((theme) => ({
  wrapper: {
    ...theme.presets.row,
    ...theme.presets.alignCenter,
    ...theme.spacing.padding(1),

  },
  logo: {
    width: 140,
    [theme.media.down('small')]: {
      width: 120,
    },

  },
  logoWrapper: {
    marginRight: 'auto',
    [theme.media.down('small')]: {
      display: 'flex',
      ...theme.presets.justifyCenter,
    },
  },
  floatingHeader: {
    position: 'sticky',
    zIndex: theme.values.zIndex.header,

    top: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background + '55',
    backdropFilter: 'blur(4px)',

  },
  nav: {

    ...theme.presets.row,
    ...theme.presets.alignCenter,
    gap: theme.spacing.value(2),

    [theme.media.down('small')]: {
      ...theme.presets.column,
      backgroundColor: theme.colors.background,
      alignItems: 'stretch',
      height: '100vh',
    },
  },
  navButton: {

  },
  navLink: {

    [theme.media.down('small')]: {
      ...theme.presets.textCenter,
      textDecoration: 'none',
    },
  },
  themeSwitch: {
    color: theme.colors.textH,

  },

}))
