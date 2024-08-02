import * as React from 'react'
/** @jsx jsx */
import { jsx } from '@emotion/react'
import { Image } from '../../../components/Image'
import { logger } from '../../logger'

import { FaLinkedin } from 'react-icons/fa'
import { MdCheck, MdClose } from 'react-icons/md'
import { IoMdEye, IoMdEyeOff } from 'react-icons/io'
import PlaceholderSelect from './placeholder_select.png'
import PlaceholderNoItemsSelect from './placeholderNoItems_select.png'

import {
  MdInfo,
  MdWarning,
  MdDangerous,
  MdLightbulbOutline,
  MdNotes,
} from 'react-icons/md'

export const iconImages = {
  'apple': require('./apple.svg'),
  'archive': require('./archive.svg'),
  'bell': require('./bell.svg'),
  'bug': require('./bug.svg'),
  'camera': require('./camera.svg'),
  'check': require('./check.svg'),
  'chevron-down': require('./chevron-down.svg'),
  'chevron-left': require('./chevron-left.svg'),
  'chevron-right': require('./chevron-right.svg'),
  'chevron-up': require('./chevron-up.svg'),
  'clock': require('./clock.svg'),
  'cloud-lightning': require('./cloud-lightning.svg'),
  'cloud': require('./cloud.svg'),
  'contact': require('./contact.svg'),
  'contrast': require('./contrast.svg'),
  'edit-2': require('./edit-2.svg'),
  'edit': require('./edit.svg'),
  'eye-off': require('./eye-off.svg'),
  'eye': require('./eye.svg'),
  'facebook': require('./facebook.svg'),
  'file-text': require('./file-text.svg'),
  'file': require('./file.svg'),
  'fingerprint': require('./fingerprint.svg'),
  'folder': require('./folder.svg'),
  'google': require('./google.svg'),
  'heart': require('./heart.svg'),
  'image': require('./image.svg'),
  'info': require('./info.svg'),
  'key': require('./key.svg'),
  'lamp-floor': require('./lamp-floor.svg'),
  'languages': require('./languages.svg'),
  'layers': require('./layers.svg'),
  'leaf': require('./leaf.svg'),
  'loader-2': require('./loader-2.svg'),
  'loader': require('./loader.svg'),
  'log-out': require('./log-out.svg'),
  'mail': require('./mail.svg'),
  'map-pin': require('./map-pin.svg'),
  'menu': require('./menu.svg'),
  'message-circle': require('./message-circle.svg'),
  'mic': require('./mic.svg'),
  'minus': require('./minus.svg'),
  'more-vertical': require('./more-vertical.svg'),
  'plus': require('./plus.svg'),
  'search': require('./search.svg'),
  'settings': require('./settings.svg'),
  'star': require('./star.svg'),
  'trash': require('./trash.svg'),
  'user': require('./user.svg'),
  'wifi-off': require('./wifi-off.svg'),
  'wifi': require('./wifi.svg'),
  'x': require('./x.svg'),
  'placeholder-select': PlaceholderSelect,
  'placeholderNoItems-select': PlaceholderNoItemsSelect,

  // TODO need to change the components that use these names to the correct names listed above
  'checkbox-checkmark': MdCheck,
  'checkmark': MdCheck,
  'close': MdClose,
  'input-visiblity:visible': IoMdEye,
  'input-visiblity:hidden': IoMdEyeOff,
  'linkedin': FaLinkedin,

  'docsquote-info': MdInfo,
  'docsquote-warning': MdWarning,
  'docsquote-danger': MdDangerous,
  'docsquote-tip': MdLightbulbOutline,
  'docsquote-note': MdNotes,
}

const applyFill = {
  'facebook': true,
  'apple':  true,
}

const ignoreStyles =  {
  'google':  true,
}

export const RenderIcon = ({ path, name = '', style = {}, log, ...otherProps }:any) => {

  const { size: stylesSize, width, height, color: stylesColor, ...otherStyles } = (otherProps?.forceStyle ?? style)
  const { size: propsSize, color: propsColor } = otherProps

  const styles = {
    ...otherStyles,
    height: !propsSize ? stylesSize ?? height : propsSize,
    width: !propsSize ? stylesSize ?? width : propsSize,
    color: propsColor ?? stylesColor,
  }

  if (typeof path === 'function') {
    if (log) {
      logger.log('Icon style for ' + name, otherStyles, 'Component style')
    }

    const isApplyFill = applyFill?.[name]
    const isIgnoreStyle = ignoreStyles?.[name]

    let forceStroke: object = {
      '& > *': { 
        stroke: `${styles.color} !important` 
      }
    }

    if (isIgnoreStyle) {
      forceStroke = null
    } else if (isApplyFill) {
      forceStroke = {
        '& > *': { 
          fill: `${styles.color} !important` 
        }
      }
    }

    const Component = path

    return <Component 
      size={propsSize} 
      color={propsColor}
      {...otherProps}
      css={[styles, forceStroke]}
    />
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
  return <img src={path} css={appliedStyles} />

}

type IconsType = {
  [Property in keyof typeof iconImages]: React.FC;
}

export type AppIcon = keyof IconsType

export const IconNames = Object.keys(iconImages) as AppIcon[]

export const Icons = Object.fromEntries(
  Object.entries(iconImages).map(([iconName, iconPath]) => {
    return [iconName, (props) => <RenderIcon path={iconPath} name={iconName} log={[].includes(iconName)} {...props} />]
  }),
) as IconsType
