/* eslint no-restricted-imports: 'off' */

import { useState, useRef } from 'react'
import { React, View, Text, Touchable, Image, FileInput, Theme, logger, Icon } from '@/app'
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
  styles?: StylesOf<AvatarComposition>;
  profile: TSession['profile'];
  onChange?: (files: WebInputFile[]) => void;
} & ComponentVariants<typeof AvatarStyles>;

export const Avatar: React.FC<AvatarProps> = (props) => {
  const { 
    variants,
    responsiveVariants,
    styles,
    profile,
    onChange,
  } = props

  const input = useRef<FileInputRef>(null)
  const [editImage, setEditImage] = useState(false)

  const variantStyles = variantProvider.getStyles<any>(AvatarStyles, {
    variants,
    responsiveVariants,
    styles,
  })
  function handleFileChange(files:WebInputFile[]){
    onChange(files)
  }


  if (!profile){
    return <View>
      <Icon name='user' variants={['large']}/>
    </View>
  }

  const AvatarImage = () => {
    const hasAvatar = !!profile.avatar

    if (hasAvatar){

    } else {
      const backgroundColor = matchInitialToColor(profile.first_name[0])

      return <View css={{backgroundColor}}>
        <Text variants={['h1']} text={`${profile.first_name[0]} ${profile.last_name[0]||''}`}/>
      </View>
    }

  }
  if (onChange){
    return <Touchable>
      <FileInput onFileSelect={handleFileChange} ref={input} />
      <AvatarImage />
    </Touchable>
  } else {
    return <View>
      <AvatarImage />
    </View>
  }
}
