/** @jsx jsx */
import { jsx } from '@emotion/react'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  variants,
  View,
  Icon,
  variantProvider,

  Text,
  Button,

  Tooltip,
  RouterPage,
} from '@/app'
import { allIcons, iconOptions } from './shared'
import { AvatarStyles } from '@/app/stylesheets/Avatar'
import { Session } from '@/redux'
import { useAppSelector } from '@/redux'
import { Toast } from '@codeleap/web'
import { Avatar } from '../../Avatar'
import { Image } from '../../Image'

const ActivityIndicatorShowcase = {
  render: ({ controlValues, ...props }) => {
    return (
      <ActivityIndicator
        animating={controlValues.animating}
        hidesWhenStopped={controlValues.hideOnStop}
        {...props}
      />
    )
  },
  styleSheet: variants.ActivityIndicator,
  controls: {
    animating: true,
    hideOnStop: false,
  },
}
const ButtonShowcase = {
  render: ({ variants, controlValues }) => {
    const props = {
      variants,
      text: controlValues.text,
      loading: false,
      onPress: () => console.log(100),
      icon:
        controlValues.leftIcon !== 'none' ? controlValues.leftIcon : undefined,
      rightIcon:
        controlValues.rightIcon !== 'none'
          ? controlValues.rightIcon
          : undefined,
    }

    return (
      <React.Fragment>
        <Button {...props} />
      </React.Fragment>
    )
  },
  styleSheet: variants.Button,
  controls: {
    leftIcon: iconOptions,
    rightIcon: iconOptions,
    loading: false,
    text: 'Some text',
  },
}

const IconShowcase = {
  render: ({ controlValues }) => {
    return (
      <View css={[{ zIndex: 10, flexWrap: 'wrap' }]}>
        {Object.entries(allIcons).map(([name, value]) => (
          <Tooltip
            position='bottom'
            showOn='hover'
            variants={['highlight']}
            content={
              <Text
                text={`<Icon name='${name.toLowerCase()}' />`}
                variants={['p2', 'textCenter', 'noWrap']}
              />
            }
          >
            <View variants={['column', 'alignCenter', 'margin:1']} key={name}>
              <Icon
                name={value}
                style={{
                  color: controlValues.color,
                  width: controlValues.size,
                  height: controlValues.size,
                }}
              />
              <Text variants={['paddingTop:1']} text={name} />
            </View>
          </Tooltip>
        ))}
      </View>
    )
  },
  controls: {
    color: variantProvider.theme.colors.light.primary,
    size: '24px',
  },
  styleSheet: variants.Icon,
}

const TextShowcase = {
  render: ({ variants, controlValues }) => Text({ variants, text: controlValues.content }),
  styleSheet: variants.Text,
  controls: {
    content: 'Lorem Ipsum',
  },
}
const ImageShowcase = {
  render: ({ variants }) => {
    return <Image source='codeleap_logo_white.png' variants={variants} />
  },
  styleSheet: variants.Image,
}

const AvatarShowcase = {
  render: ({ variants, controlValues }) => {
    const [file, setFile] = useState(null)

    function imageChange(args) {
      setFile(args?.preview || null)
    }

    const [first_name, last_name] = (controlValues?.name?.split(' ') || ['', ''])

    return (
      <Avatar
        profile={controlValues.hasProfile ? { avatar: file, first_name, last_name } : null}
        variants={variants}
        onChange={imageChange}
      />
    )
  },
  styleSheet: AvatarStyles,
  controls: {
    name: 'John Doe',
    hasProfile: true,
  },
}

const ToastShowcase = {
  render: () => {
    return (
      <View>
        <Button
          onPress={() => {
            Toast.info(
              { title: 'This invitation is not valid for the current email address' },
            )
          }}
          text='Information'
          variants={['marginLeft:1', 'padding:1']}
        />
        <Button
          onPress={() => {
            Toast.success(
              { title: 'This invitation has been sent successfully to your email address' },
            )
          }}
          text='Success'
          variants={['marginLeft:1', 'padding:1']}
        />
        <Button
          onPress={() => {
            Toast.error(
              { title: 'There was an error sending the invite. Please try again later' },
            )
          }}
          text='Error'
          variants={['marginLeft:1', 'padding:1']}
        />

      </View>
    )
  },
  styleSheet: {},
}

const SomePage = ({ path, title, ...props }) => {
  return (
    <View {...props}>
      <Text>
        {path} {'->'} {title}
      </Text>
    </View>
  )
}

const RouterPageShowCase = {
  render: () => {
    return (
      <RouterPage
        basePath='/components'
        title='Components'
      >
        {/* <SomePage  menuIcon='refresh' title='Root' path='/'/>  */}
        <SomePage menuIcon='search' title='Search' path='/' />
        <SomePage menuIcon='search' title='Search' path='/search' default />
        <SomePage menuIcon='checkmark' title='Something' path='/something' />
      </RouterPage>
    )
  },
  styleSheet: {},
}

export {
  TextShowcase as Text,
  IconShowcase as Icon,
  ImageShowcase as Image,
  ButtonShowcase as Button,
  ActivityIndicatorShowcase as ActivityIndicator,
  AvatarShowcase as Avatar,
  ToastShowcase as Toast,
  RouterPageShowCase as RouterPage,
}