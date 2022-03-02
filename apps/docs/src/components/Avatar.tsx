/* eslint no-restricted-imports: 'off' */

import { useRef } from 'react'
import { React, View, Text, Touchable, Image, Button, FileInput, Icon } from '@/app'
import { FileInputRef } from '@codeleap/web'
import { AvatarStyles } from '../app/stylesheets/Avatar'
import {
  AvatarComposition,
  ComponentVariants,
  matchInitialToColor,
  StylesOf,
  useDefaultComponentStyle,
  WebInputFile,
} from '@codeleap/common'
import { TSession } from '@/redux'

type AvatarProps = {
  styles?: StylesOf<AvatarComposition>
  profile: TSession['profile']
  onChange?: (files: WebInputFile) => void
  debugName: string
  onPress?: () => any
} & ComponentVariants<typeof AvatarStyles>

export const Avatar: React.FC<AvatarProps> = (props) => {
  const {
    variants,
    responsiveVariants,
    styles,
    profile,
    onChange,
    onPress,
  } = props

  const input = useRef<FileInputRef>(null)

  const variantStyles = useDefaultComponentStyle('Avatar', {
    variants,
    responsiveVariants,
    styles,
  })

  function handleFileChange(files:WebInputFile[]) {
    onChange(files?.[0])
  }

  const AvatarImage = () => {
    if (!profile) return <Icon name='user' />

    const hasAvatar = !!profile?.avatar

    if (hasAvatar) {
      return <Image source={profile.avatar} type='dynamic' css={variantStyles.image}/>
    } else {

      const backgroundColor = matchInitialToColor(profile.first_name[0])

      return <View css={[variantStyles.general, { backgroundColor }]}>
        <Text css={variantStyles.text} text={`${profile.first_name?.[0]} ${profile?.last_name?.[0] || ''}`}/>
      </View>
    }

  }

  if (onChange) {
    return <>
      <FileInput onFileSelect={handleFileChange} ref={input}/>
      <Touchable onPress={() => input.current.openFilePicker()}
        css={[variantStyles.wrapper,
          variantStyles.general,
          { cursor: 'pointer' }]}
      >
        <View css={[variantStyles.editing]}>
          <Icon name='edit' />
        </View>
        <AvatarImage />
      </Touchable>
    </>
  } else {

    if (!!profile) {
      return <Touchable onPress={() => onPress?.()} css={{ cursor: 'pointer' }}>
        <AvatarImage />

      </Touchable>
    } else {
      return <Button onPress={() => onPress?.()} variants={['icon']} css={variantStyles.general}>
        <AvatarImage />
      </Button>

    }
  }
}
