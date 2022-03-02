import * as yup from 'yup'
import * as React from 'react'

import { AppStatus, Session, useAppSelector } from '@/redux'
import { Button,
  Modal,
  // Scroll,
  TextInput, View, OSAlert, Text } from '@/app'
import { Avatar, Page, RequiresAuth } from '@/components'
import {
  createForm,
  onUpdate,
  useBooleanToggle,
  useForm,
  useRef,
  useState,
} from '@codeleap/common'
import { ModalProps, Toast } from '@codeleap/web'
import { navigate } from 'gatsby'

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
  avatar: {
    type: 'file',
  },
})

const modalProps:Record<string, Partial<ModalProps >> = {
  auth: {
    title: '',
  },
  confirmResetPassword: {
    title: 'Password Reset',
  },
}

function EditProfile() {
  const { profile } = useAppSelector((store) => store.Session)
  const [isModalVisible, toggleModal] = useBooleanToggle(false)
  const [currentModal, setModal] = useState(null)

  const form = useForm(editProfileForm, {
    output: 'json',
    validateOn: 'submit',
    initialState: {
      ...profile,
      avatar: [{ preview: profile?.avatar }],
      password: '',
    },
  })

  function onSubmit() {
    form.onSubmit(async (values) => {
      const hasEmailChanged = values.email !== profile.email

      const response = await Session.editProfile({
        ...form.values,
        avatar: form.values.avatar[0]?.file || null,
      })

      if (response.needsAuth) {
        toggleModal()
        return
      }

      if (hasEmailChanged) {
        OSAlert.info({
          title: 'Please confirm your new email address',
        })

      } else {
        Toast.info({
          title: 'Changes Saved',
        })
      }

    })
  }

  const reauthenticate = () => {

    const data = {
      email: profile?.email,
      password: form.values.password,
    }

    Session.reauthenticate(data).then(() => {
      onSubmit()
      toggleModal()
    }).catch(() => {
      toggleModal()
      OSAlert.error({ title: 'Error', body: 'Could not authenticate. Please check your credentials.' })
    })
  }

  function onPasswordReset() {
    OSAlert.ask({
      title: 'Password Reset',
      body: 'Do you want to reset your password? You will be emailed instructions to proceed',
      options: [
        {
          onPress: () => Session.resetPassword().then(() => {
            Toast.info({ title: 'Check your email for instructions on how to reset your password' })
          }),
          text: 'Reset',
        },
        {
          onPress: () => null,
          text: 'Cancel',
        },

      ],
    })
  }

  return (

    <View variants={['column', 'flex']}>

      <View variants={['gap:4']} responsiveVariants={{ small: ['column'] }}>

        <Avatar
          profile={{
            ...form.values,
            avatar: form.values?.avatar?.[0]?.preview,
            id: null,
          }}
          onChange={(image) => form.setFieldValue('avatar', [image])}
          debugName={'Change profile avatar'}
          variants={['alignSelfCenter']}

        />
        <View variants={['column', 'gap:2', 'flex']}>

          <TextInput {...form.register('first_name')} debugName={'Profile first name input'} />
          <TextInput {...form.register('last_name')} debugName={'Profile last name input'} />
          <TextInput
            {...form.register('email')}
            debugName={'Profile email input'}
            leftIcon={{ name: 'mail' }}
          />

          <Button variants={['neutral', 'alignSelfCenter']} text={'Reset password'} onPress={onPasswordReset}/>

          <Text text={'Changes are saved automatically'} variants={['textCenter']}/>
          <Button variants={['alignSelfCenter']} text={'Save changes'} onPress={onSubmit}/>
        </View>
      </View>
      <Modal
        visible={isModalVisible}
        toggle={toggleModal}
        title='Authentication required'
      >
        <Text text='Please re-enter your password to update your email address' />
        <TextInput {...form.register('password')} label='Password' />
        <Button text={'Continue'} onPress={reauthenticate} disabled={form.fieldErrors.password}/>
        <Button text={'Cancel'} onPress={toggleModal}/>
      </Modal>
    </View>
  )
}

export default function EditProfilePage() {

  return <Page title={'Edit Profile'} footer={false} styles={{ wrapper: { flex: 1 }}}>
    <RequiresAuth onUnauthorized={() => navigate('/')}>
      <EditProfile />
    </RequiresAuth>

  </Page>
}
