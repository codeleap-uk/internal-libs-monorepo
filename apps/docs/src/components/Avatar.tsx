/* eslint no-restricted-imports: 'off' */

import { useState, useRef } from 'react'
import { React, View, Text, Touchable, Image, FileInput, Theme, logger } from '@/app'
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
  onChange?: (files: WebInputFile[]) => void
  debugName: string
} & ComponentVariants<typeof AvatarStyles>

export const Avatar: React.FC<AvatarProps> = (props) => {
  const { variants, responsiveVariants, styles, debugName } = props

  const input = useRef<FileInputRef>(null)
  const [editImage, setEditImage] = useState(false)

  const variantStyles = variantProvider.getStyles(AvatarStyles, {
    variants,
    responsiveVariants,
    styles,
  })
  const profile = props.profile

  const getLetterFromName = (pos) => {
    const name = profile?.first_name || ''
    const start = pos
    const end = start + 1
    if (name) {
      return name.substring(start, end)
    } else {
      return null
    }
  }

  const renderImage = () => {
    if (!profile?.avatar) {
      const initial = getLetterFromName(0)

      if (!initial) {
        return (
          <Image
            style={[
              variantStyles.image as any,
              { tintColor: Theme.colors.gray },
            ]}
            source={require('../app/assets/icons/user.png')}
          />
        )
      }

      return (
        <View
          style={[
            variantStyles.image,
            { backgroundColor: matchInitialToColor(initial) },
          ]}
        >
          <Text text={initial?.toUpperCase()} style={[variantStyles.text]} />
        </View>
      )
    } else {
      const image = profile?.avatar

      return (
        <Image style={[variantStyles.image as any]} source={image} />
      )
    }
  }

  const image = renderImage()
  const canEdit = props.hasOwnProperty('onChange')
  const disabled = !canEdit

  const onPress = () => {
    input.current.openFilePicker()
  }

  const onFileChange = (data) => {
    props.onChange(data)
  }

  const onHoverImage = () => {
    setEditImage(!editImage)
  }
  return (
    <Touchable
      disabled={disabled}
      onPress={onPress}
      onHover={canEdit && onHoverImage}
      debugName={debugName}
    >
      <View style={[variantStyles.wrapper]}>
        <View style={[
          variantStyles.general,
          disabled && AvatarStyles.disabled.editImageBubble,
        ]}>
          {image}
          {canEdit && (
            <>
              <View style={variantStyles.editing}>
                <Text text={'EDIT'} style={variantStyles.textEdit} />
              </View>
            </>
          )}
          <View style={variantStyles.fileInput}>
            <FileInput
              styles={{ wrapper: variantStyles.fileInput }}
              onFileSelect={onFileChange}
              ref={input}
              mode='hidden'
            />
          </View>
        </View>
      </View>
    </Touchable>
  )
}
