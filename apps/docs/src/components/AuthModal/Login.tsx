import { React, Button, Text, TextInput } from '@/app'
import { Session } from '@/redux'
import { createForm, useForm } from '@codeleap/common'
import { Toast } from '@codeleap/web'
import * as yup from 'yup'
import { Logo } from '../Logo'

export const loginForm = createForm('login', {
  email: {
    type: 'text',
    label: 'Email',
    validate: yup.string().required('This cannot be empty').email('Invalid email'),
  },
  password: {
    type: 'text',
    password: true,
    label: 'Password',
    validate: yup.string().required('Password is required'),
  },
})

export const LoginForm = ({ onFormSwitch, onAuthSuccess = null }) => {
  const form = useForm(loginForm, {
    output: 'json',
    initialState: {
      email: 'tester@codeleap.co.uk',
      password: 'pppppp',
    },
    validateOn: 'change',
  })

  const handleSubmit = async () => {
    const isValid = form.validateAll(true)
    if (isValid) {
      const result = await Session.login({
        withProvider: 'email',
        data: form.values,
      })

      if (result === 'success') {
        onAuthSuccess?.()
      } else {
        Toast.error({
          title: 'Error logging in',
        })
      }
    }

  }

  return (
    <>
      <Logo/>
      <TextInput {...form.register('email')} />
      <TextInput {...form.register('password')} visibilityToggle />
      <Button
        text={'Submit'}
        variants={['marginVertical:1', 'marginHorizontal:auto', 'fullWidth']}
        disabled={!form.isValid}
        onPress={handleSubmit}
      />

      <Text variants={['alignSelfCenter', 'textCenter']}>
        First timer? <Button text={'Create an account'} variants={['text', 'link', 'inline']} onPress={onFormSwitch}/>
      </Text>
    </>
  )
}
