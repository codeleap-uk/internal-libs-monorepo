/* eslint no-restricted-imports: 'off' */

import { useState, useRef } from 'react'
import { React, View, Text, Touchable, Image, Button, FileInput, Theme, logger, Icon } from '@/app'
import { FileInputRef } from '@codeleap/web'
import { variantProvider } from '@/app'
import { AvatarStyles } from '../app/stylesheets/Avatar'
import {
  AvatarComposition,
  ComponentVariants,
  matchInitialToColor,
  StylesOf,
  WebInputFile,
} from '@codeleap/common'
import { TSession } from '@/redux'

type AvatarProps = {
  styles?: StylesOf<AvatarComposition>
  profile: TSession['profile']
  onChange?: (files: WebInputFile) => void
  debugName: string
  onPress: () => any
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
  const [editImage, setEditImage] = useState(false)

  const variantStyles = variantProvider.getStyles<any>(AvatarStyles, {
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
      return <Image source={profile.avatar} type='dynamic'/>
    } else {

      const backgroundColor = matchInitialToColor(profile.first_name[0])

      return <View css={{ backgroundColor }}>
        <Text variants={['h1']} text={`${profile.first_name?.[0]} ${profile?.last_name?.[0] || ''}`}/>
      </View>
    }

  }

  if (onChange) {
    return <Touchable onPress={() => input.current.openFilePicker()}>
      <FileInput onFileSelect={handleFileChange} ref={input} />
      <AvatarImage />
    </Touchable>
  } else {
    return <Button onPress={() => onPress?.()} variants={['icon']}>
      <AvatarImage />
    </Button>
  }
}
