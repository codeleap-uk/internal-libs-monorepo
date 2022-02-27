import * as yup from 'yup'
import * as React from 'react'

import { Session, useAppSelector } from '@/redux'
import { Button,
  // Scroll,
  TextInput, View } from '@/app'
import { Avatar } from '@/components'
import {
  createForm,
  useForm,
} from '@codeleap/common'
import { Toast } from '@codeleap/web'

const editProfileForm = createForm('editProfileForm', {
  email: {
    type: 'text',
    validate: yup.string().email('Invalid email'),
  },
  first_name: {
    type: 'text',
    label: 'First Name',
  },
  last_name: {
    type: 'text',
    label: 'Last Name',
  },
  password: {
    type: 'text',
    password: true,
  },
  repeatPassword: {
    type: 'text',
    password: true,
    validate: (repeatPassword, { password }) => {
      const isValid = repeatPassword === password

      return {
        valid: isValid,
        message: isValid ? '' : "Passwords don't match",
      }
    },
  },
  avatar: {
    type: 'file',
  },
})

export default function EditProfile({ navigation }) {
  const { profile } = useAppSelector((store) => store.Session)

  const form = useForm(editProfileForm, {
    output: 'json',
    validateOn: 'submit',
    initialState: {
      ...profile,
      avatar: [{ preview: profile.avatar }],
      repeatPassword: '',
      password: '',
    },
  })

  function onSubmit() {
    form.onSubmit(async (values) => {
      const hasEmailChanged = values.email !== profile.email

      await Session.editProfile({
        ...form.values,
        avatar: form?.values?.avatar?.[0]?.file.uri,
      })

      navigation.navigate('Profile.View')

      if (hasEmailChanged) {
        Toast.info({
          title: 'Please confirm your new email address',
        })

      } else {
        Toast.info({
          title: 'Changes Saved',
        })
      }

    })
  }
  return (
    // <Scroll variants={['padding:2']}>
    <>
      <Avatar
        profile={{
          ...form.values,
          avatar: form.values?.avatar?.[0]?.preview,
          id: null,
        }}
        onChange={(image) => form.setFieldValue('avatar', image)}
        debugName={'Change profile avatar'}
      />
      <View>
        <TextInput {...form.register('email')} debugName={'Profile email input'} leftIcon={{ name: 'mail' }} />

        <TextInput {...form.register('first_name')} debugName={'Profile first name input'} />
        <TextInput {...form.register('last_name')} debugName={'Profile last name input'} />

        <TextInput
          {...form.register('password')}
          leftIcon={{ name: 'key' }}
          debugName={'Profile password input'}
          visibilityToggle
        />

        <TextInput
          {...form.register('repeatPassword')}
          debugName={'Profile repeat password input'}
          leftIcon={{ name: 'key' }}
          visibilityToggle
        />

        <Button
          disabled={!form.isValid}
          text={'Save Changes'}
          onPress={onSubmit}
          debugName={'Save changes'}
        />
      </View>
    </>
    // </Scroll>
  )
}
