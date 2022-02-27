/* eslint-disable max-lines */
/** @jsx jsx */
import { jsx } from '@emotion/react'
import { useWindowSize } from '@codeleap/web'
import {
  View,
  React,
  useState,
  variantProvider,
  Image,
  Theme,
  Link,
  CenterWrapper,
  Touchable,
  Drawer,
  Avatar,
  Tooltip,
} from '@/app'
import { Settings } from '../app/Settings'
import { useWindowScroll, useThrottledCallback } from 'beautiful-react-hooks'
import { FaBars } from 'react-icons/fa'
import { useAppSelector } from '@/redux'
import { useBooleanToggle, useComponentStyle } from '@codeleap/common'

type HeaderProps = any

const buttons = [
  { text: 'HOME', to: '/' },
  { text: 'COMPONENTS', to: '/components' },
]

function NavButton(props) {
  const { text, to, pill } = props.button
  const styles = useComponentStyle(componentStyles)
  return (
    <View css={styles.navButtonTextWrapper}>
      <Link
        variants={['p3']}
        to={to}
        text={text}
        css={[
          styles.navButtonText,
          props.inverted && styles.navButtonTextTransparent,
          pill && styles.navButtonTextButton,
        ]}
      />
    </View>
  )
}

function ProfileTooltip() {
  return (
    <View variants={['column']}>
      <Link to='/account' text={'My account'} variants={['p2']} />
      <Link to='/' text={'Logout'} variants={['p2']} />
    </View>
  )
}

function NavButtons(props) {

  const { profile, isLoggedIn } = useAppSelector((store) => store.Session)
  return <React.Fragment>
    {buttons.map((button, idx) => {
      return <NavButton key={idx} button={button} {...props} />
    })}

    {isLoggedIn ? (
      <Tooltip content={<ProfileTooltip />} position='bottom'>
        {/* <Avatar profile={profile} variants={['verySmall']} /> */}
      </Tooltip>
    ) : (
      <React.Fragment>
        <NavButton
          button={{ text: 'LOGIN', to: '/account/login', pill: true }}
          {...props}
        />
        <NavButton
          button={{ text: 'SIGN UP', to: '/account/signup', pill: true }}
          {...props}
        />
      </React.Fragment>
    )}

  </React.Fragment>

}

function MobileDropdown() {

  const [isOpen, toggleOpen] = useBooleanToggle(false)

  const styles = useComponentStyle(componentStyles)
  return (
    <View>
      <Touchable
        onPress={() => toggleOpen()}
        gaLabel={`HeaderNavButton`}
        gaAction={`hamburger`}
        css={styles.hamburger}
      >
        <FaBars size={20} color={'white'} />
      </Touchable>
      <Drawer
        open={isOpen}
        toggle={() => toggleOpen()}
        position={'top'}
        size={450}
        styles={{ box: { backgroundColor: '#1f1f1f' }}}
      >
        <CenterWrapper
          variants={['flex', 'fullHeight', 'column']}
          styles={{ wrapper: { flex: 1 }}}
        >
          <View>
            <Touchable
              gaLabel={`HeaderNavButton`}
              gaAction={`logo image`}
              css={styles.logoWrapper}
              onPress={() => {
                toggleOpen()
              }}
            >
              <Image
                source={`logo_white.webp`}
                alt='CodeLeap'
                css={styles.logoImage}
              />
            </Touchable>
            <Touchable
              gaLabel={`HeaderNavButton`}
              gaAction={`hamburger`}
              onPress={() => toggleOpen()}
              css={styles.hamburger}
              variants={['marginLeft:auto']}
            >
              <FaBars size={20} color={'white'} />
            </Touchable>
          </View>

          {buttons.map((button, idx) => {
            return (
              <NavButton
                key={idx}
                button={button}
                mobile={true}
                pressed={() => toggleOpen()}
              />
            )
          })}
        </CenterWrapper>
      </Drawer>
    </View>
  )
}

export const Header: React.FC<HeaderProps> = (headerProps) => {
  const { alwaysDark } = headerProps
  const [scrollY, setScrollY] = useState(
    Settings.Application.IsBrowser && window.scrollY,
  )

  useWindowScroll(
    useThrottledCallback(
      () => {
        setScrollY(window.scrollY)
      },
      [],
      1000,
      null,
    ),
  )

  const [, height] = useWindowSize()

  const nearTop = scrollY < height
  const inverted = true
  const showAppbar = true

  const styles = useComponentStyle(componentStyles)

  return (
    <View css={styles.wrapper}>
      <View
        css={[
          styles.appBar,
          !showAppbar && styles.appBarHidden,
          nearTop && !alwaysDark && styles.appBarTransparent,
        ]}
      >
        <CenterWrapper
          css={styles.innerWrapper}
          innerCss={styles.innerWrapperInner}
          contentContainerStyle={styles.centerWrapper}
        >
          <Link css={styles.logoWrapper} to={'/'}>
            <Image
              source='codeleap_logo_white.png'
              alt='CodeLeap'
              type='static'
              css={styles.logoImage}
            />
          </Link>
          <View up={'mid'} variants={['marginLeft:auto']}>
            <View css={styles.navButtons}>
              <NavButtons />
            </View>
          </View>
          <View down={'mid'} variants={['marginLeft:auto']}>
            <View css={styles.navButtonsMobile}>
              <MobileDropdown />
            </View>
          </View>
        </CenterWrapper>
      </View>
    </View>
  )
}

const componentStyles = variantProvider.createComponentStyle((theme) => ({
  wrapper: {
    ...theme.presets.fullWidth,
    display: 'flex',
    zIndex: theme.values.zIndex.header,
    position: 'sticky',
    top: 0,
  },
  logoWrapper: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  contactBanner: {
    position: 'sticky',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'black',
    height: 0,
    zIndex: 10000,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    [Theme.media.is('small')]: {
      display: 'none',
    },
  },
  contactBannerText: {
    color: '#4287f',
    marginLeft: Theme.spacing.value(2),
    marginRight: Theme.spacing.value(2),
  },
  contactBannerLink: {
    color: '#4287f',
    textDecoration: 'none',
    '&:hover': {
      opacity: 0.8,
    },
    cursor: 'pointer',
  },
  contactBannerSpacing: {
    width: 30,
  },
  appBar: {
    top: 0,
    height: 'max(50px, min(calc(16px + 3vw), 64px))',
    [Theme.media.is('small')]: {
      top: 0,
    },
    left: 0,
    right: 0,
    position: 'sticky',
    flex: 1,
    display: 'flex',
    backgroundColor: '#00000055',
    backdropFilter: 'blur(4px)',
    transition: '300ms',
  },
  appBarHidden: {
    backgroundColor: '#00000055',
  },
  appBarTransparent: {
    backgroundColor: '#00000000',
  },
  logoImage: {
    objectFit: 'cover',
    width: 'max(100px, min(calc(0px + 9vw), 150px))',
    [Theme.media.is('small')]: {
      marginLeft: Theme.spacing.value(2),
    },
  },
  navButtons: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: Theme.spacing.value(2),
  },
  navButtonsMobile: {
    display: 'flex',
  },
  navButtonTextWrapper: {
    padding: '12px',
  },
  navButtonText: {
    zIndex: 'inherit',
    padding: '12px',
    textDecorationLine: 'none',
    color: theme.colors.textP,
    fontWeight: '500',
    '&:hover': {
      opacity: 0.8,
    },
  },
  navButtonTextTransparent: {
    color: '#4287f',
  },
  navButtonTextButton: {
    borderRadius: 5,
    backgroundColor: '#ffffff33',
    // '&:hover': {
    //   textDecorationStyle: 'none !important',
    //   textDecorationLine: 'none !important',
    // },
  },
  innerWrapperInner: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  centerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 0,
    // zIndex: 1000,
  },
}))
