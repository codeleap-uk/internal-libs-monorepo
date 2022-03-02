import * as React from 'react'
/** @jsx jsx */
import { jsx } from '@emotion/react'
import { Image } from '@/app'
import { logger } from '../../logger'
import {
  VscLoading,
} from 'react-icons/vsc'
import {
  MdKeyboardArrowDown,
  MdArchive,
  MdHome,
  MdSearch,
  MdImage,
  MdClose,
  MdDarkMode,
  MdLightMode,
  MdEdit,
  MdMenu,
  MdKeyboardArrowLeft,
  MdCheck,
  MdAdd,
  MdContentCopy,
} from 'react-icons/md'
import {
  FaGoogle,
  FaFacebook,
  FaApple,
  FaUser,
} from 'react-icons/fa'
import {
  IoArrowForward,
  IoArrowBack,
} from 'react-icons/io5'
import {
  IoMdEye,
  IoMdEyeOff,
} from 'react-icons/io'

export const iconImages = {
  arrowDownWhite: MdKeyboardArrowDown,
  archive: MdArchive,
  google: FaGoogle,
  facebook: FaFacebook,
  apple: FaApple,
  home: MdHome,
  search: MdSearch,
  checkmark: MdCheck,
  loading: VscLoading,
  arrowForward: IoArrowForward,
  arrowBack: IoArrowBack,
  'input-visiblity:visible': IoMdEye,
  'input-visiblity:hidden': IoMdEyeOff,
  image: MdImage,
  chevronLeft: MdKeyboardArrowLeft,
  close: MdClose,
  add: MdAdd,
  darkMode: MdDarkMode,
  lightMode: MdLightMode,
  edit: MdEdit,
  menu: MdMenu,
  user: FaUser,
  copy: MdContentCopy,
}

export const RenderIcon = ({ path, name = '', style = {}, log }:any) => {

  const { size, width, height, color, ...otherStyles } = style
  const styles = {
    ...otherStyles,
    height: size || height,
    width: size || width,
    color: color,
  }

  if (typeof path === 'function') {
    if (log) {
      logger.log('Icon style for ' + name, otherStyles, 'Component style')
    }
    const Component = path
    return <Component css={ styles} />
  }

  const appliedStyles = {
    height: styles.height,
    width: styles.width,
    fontSize: styles.height || styles.width,
    tintColor: styles.color || null,
    color: styles.color || null,
  }

  if (log) {
    logger.log('Icon style for ' + name, appliedStyles, 'Component style')
  }
  return <Image objectFit={'contain'} source={path} style={appliedStyles} type='dynamic'/>
}

type IconsType = {
  [Property in keyof typeof iconImages]: React.FC;
}

export type AppIcon = keyof IconsType

export const Icons = Object.fromEntries(
  Object.entries(iconImages).map(([iconName, iconPath]) => {
    return [iconName, (props) => <RenderIcon path={iconPath} name={iconName} log={[].includes(iconName)} {...props} />]
  }),
) as IconsType
