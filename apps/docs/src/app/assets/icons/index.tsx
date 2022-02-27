import * as React from 'react'
/** @jsx jsx */
import { jsx, CSSObject } from '@emotion/react'
import { Image } from '@/app'
import { logger } from '../../logger'
import * as ReactIcons from 'react-icons/all'

export const iconImages = {
  arrowDownWhite: ReactIcons.MdKeyboardArrowDown,
  archive: ReactIcons.MdArchive,
  google: ReactIcons.FaGoogle,
  facebook: ReactIcons.FaFacebook,
  apple: ReactIcons.FaApple,
  // mail: VectorIcon('mail', FeatherIcons),
  //   user: VectorIcon('user', FeatherIcons),
  home: ReactIcons.MdHome,
  // key: VectorIcon('key', FeatherIcons),
  search: ReactIcons.MdSearch,
  checkmark: ReactIcons.MdCheck,
  loading: ReactIcons.VscLoading,
  arrowForward: ReactIcons.IoArrowForward,
  arrowBack: ReactIcons.IoArrowBack,
  // selectArrow: VectorIcon('select-arrows', EntypoIcons),

  // 'input-visiblity:visible': VectorIcon('eye', FeatherIcons),
  // 'input-visiblity:hidden': VectorIcon('eye-off', FeatherIcons),
  image: ReactIcons.MdImage,
  close: ReactIcons.MdClose,
  // cloud: VectorIcon('cloud', FeatherIcons),
  // bell: VectorIcon('bell', FeatherIcons),
  // hamburger: VectorIcon('menu', FeatherIcons),
  // components: VectorIcon('layers', FeatherIcons),
  // playground: VectorIcon('react', MaterialCommunityIcons),
  // back: VectorIcon('chevron-left', Octicons),
  // 'network-on': VectorIcon('wifi-check', MaterialCommunityIcons),
  // 'network-off': VectorIcon('wifi-off', MaterialCommunityIcons),
  // 'bug': VectorIcon('bug', MaterialCommunityIcons),
  edit: ReactIcons.MdEdit,
  // 'notifications': VectorIcon('notifications', Ionicons),
}

export const RenderIcon = ({ path, name = '', style = {}, log, ...props }:any) => {

  const { size, width, height, color, ...otherStyles } = style
  const styles = {
    // ...otherStyles,
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
    return [iconName, (props) => <RenderIcon path={iconPath} name={iconName} log={['close', 'search'].includes(iconName)} {...props} />]
  }),
) as IconsType
