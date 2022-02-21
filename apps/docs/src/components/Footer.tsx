/* eslint-disable max-lines */
/** @jsx jsx */
import {jsx} from '@emotion/react'
import { View, Image, Text, CenterWrapper, Link, Theme } from '@/app'

import { variantProvider } from '@/app/theme'

import { Settings } from '../app/Settings'

import { FaFacebookSquare, FaLinkedin } from 'react-icons/fa'

import { format } from 'date-fns'
import { useComponentStyle } from '@codeleap/common'

type FooterProps = any;

const linksA = [
  { text: 'HOME', to: '/#' },
  { text: 'SERVICES', to: '/#services' },
  { text: 'PORTFOLIO', to: '/#portfolio' },
  { text: 'PRICING', to: '/#pricing' },
]

const linksB = [
  { text: 'ABOUT', to: '/about' },
  { text: 'BLOG', to: '/blog' },
  { text: 'CAREERS', to: '/careers' },
  { text: 'CONTACT', to: '/#contact' },
]

function renderLinkCol(arr) {
  
  const links = arr.map(({ to, text }, index) => {
    return (
      <Link
        key={index}
        to={to}
        text={text}
        variants={['p3']}
        css={[styles.footerNavText, styles.link]}
      />
    )
  })
  return <View css={styles.linkCol}>{links}</View>
}

function Menu() {
  
  return (
    <View>
      <View css={styles.footerLinkWrapper}>
        {renderLinkCol(linksA)}
        {renderLinkCol(linksB)}
      </View>
    </View>
  )
}

function Disclaimers() {
  
  return (
    <View css={styles.disclaimersWrapper}>
      <Text css={styles.regDetailsText}>Visit us in Camden, London, UK.</Text>
      <Text css={styles.regDetailsText}>
        CodeLeap Ltd. is registered in England&nbsp;&&nbsp;Wales,
        company&nbsp;no.&nbsp;11967804.
      </Text>
      <Text variants={['inline']} css={styles.regDetailsText}>
        This website uses&thinsp;
        <Link css={styles.link} to='/terms/licence'>
          third-party assets and software
        </Link>
        . By using our website you agree to the&thinsp;
        <Link css={styles.link} to='/terms/website'>
          terms of use
        </Link>
        .
      </Text>
    </View>
  )
}

function Contact() {
  const year = format(new Date(), 'yyyy')
  
  return (
    <View css={styles.contactWrapper}>
      <Link
        text={Settings.ContactINFO.ContactEMAIL}
        to={`/mailto:${Settings.ContactINFO.ContactEMAIL}`}
        css={[styles.footerNavText, styles.link]}
      />
      <Link
        text={Settings.ContactINFO.ContactPHONE}
        to={`/tel:${Settings.ContactINFO.ContactPHONE}`}
        css={[styles.footerNavText, styles.link]}
      />
      <Text css={styles.footerNavText} text={'Made with ♥️ in London, UK'} />
      <Text css={styles.footerNavText} text={`©${year} CodeLeap Ltd.`} />
    </View>
  )
}

function SocialMedia() {
  
  return (
    <View css={styles.socialMediaWrapper}>
      <Link
        // gaLabel={'Footer'}
        css={styles.socialMediaIconWrapper}
        to={Settings.Social.FaceURL}
      >
        <FaFacebookSquare size={28} color={'white'} />
      </Link>
      <Link
        // gaLabel={'Footer'}
        css={styles.socialMediaIconWrapper}
        to={Settings.Social.LinkedinURL}
      >
        <FaLinkedin size={28} color={'white'} />
      </Link>
    </View>
  )
}

export const Footer: React.FC<FooterProps> = () => {
  
  return (
    <View css={styles.wrapper}>
      <CenterWrapper>
        <View css={styles.innerWrapper}>
          <Image
            source='codeleap_logo_white.png'
            alt='CodeLeap'
            css={styles.logoImage}
          />
          <View up={'mid'} variants={['column', 'flex']}>
            <View css={styles.innerWrapperRow}>
              <Menu />
              <Contact />
            </View>
            <View css={styles.separator} />
            <View css={styles.bottomRow}>
              <Disclaimers />
              <SocialMedia />
            </View>
          </View>
          <View down={'mid'} css={styles.innerWrapperColumn}>
            <Menu />
            <View css={styles.separator}></View>
            <Contact />
            <SocialMedia />
            <Disclaimers />
          </View>
        </View>
      </CenterWrapper>
    </View>
  )
}

const styles = variantProvider.createComponentStyle({
  wrapper: {
    zIndex: Theme.values.zIndex.footer,
    display: 'flex',
    color: '#bd1738',
    backgroundColor: Theme.colors.light.primary,
    width: '100%',
    minHeight: 480,
    [Theme.media.down('small')]: {
      paddingTop: Theme.spacing.value(4),
      paddingBottom: Theme.spacing.value(4),
    },
  },
  footerLinkWrapper: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    [Theme.media.down('mid')]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  linkCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginRight: Theme.spacing.value(4),
    [Theme.media.down('mid')]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Theme.spacing.value(2),
      marginLeft: Theme.spacing.value(2),
    },
  },
  link: {
    fontWeight: 'inherit',
    textDecorationLine: 'none',
    textDecorationColor: Theme.colors.light.white,
    color: 'white',
    '&:hover': {
      textDecorationStyle: 'solid',
      textDecorationLine: 'underline',
      opacity: 1,
    },
  },
  innerWrapper: {
    paddingVertical: Theme.spacing.value(4),
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    [Theme.media.down('mid')]: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    },
  },
  innerWrapperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    display: 'flex',
    flex: 1,
  },
  innerWrapperColumn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  text: {
    fontSize: 16,
  },
  regDetailsText: {

    color: 'white',
    opacity: 0.7,
    fontSize: 14,
    marginTop: Theme.spacing.value(2),
    [Theme.media.down('mid')]: {
      textAlign: 'center',
    },
  },
  inherit: {
    margin: 'inherit',
  },
  footerNavText: {
    marginTop: Theme.spacing.value(1),
    marginBottom: Theme.spacing.value(1),
    color: Theme.colors.light.white,
  },
  logoImage: {
    width: 150,
    marginBottom: Theme.spacing.value(3),
  },
  mobileDisclaimers: {
    flex: 1,
    marginBottom: Theme.spacing.value(2),
  },
  contactWrapper: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    flexDirection: 'column',
    [Theme.media.down('mid')]: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  disclaimersWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flex: 3,
    [Theme.media.down('mid')]: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  separator: {
    backgroundColor: 'white',
    height: 1,
    marginTop: Theme.spacing.value(3),
    marginBottom: Theme.spacing.value(1),
    width: '100%',
  },
  bottomRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialMediaWrapper: {
    marginTop: Theme.spacing.value(2),
  },
  socialMediaIconWrapper: {
    marginLeft: Theme.spacing.value(2),
    [Theme.media.down('mid')]: {
      marginLeft: Theme.spacing.value(1),
      marginRight: Theme.spacing.value(1),
    },
  },

}, true)
