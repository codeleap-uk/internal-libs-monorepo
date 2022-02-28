import { Button, Text, TextInput, Touchable, View } from '@/app'
import { Session } from '@/redux'
import { createForm, useForm } from '@codeleap/common'
import * as yup from 'yup'

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

export const LoginForm = () => {
  const form = useForm(loginForm, {
    output: 'json',
    validateOn: 'change',
  })

  const handleSubmit = () => {
    const isValid = form.validateAll(true)
    if (isValid) {
      Session.login({
        withProvider: 'email',
        data: form.values,
      })
    }
  }

  return (
    <View variants={['column', 'flex', 'justifyCenter']}>
      <View variants={['column', 'justifyCenter', 'fullHeight']}>
        <TextInput {...form.register('email')} />
        <TextInput {...form.register('password')} visibilityToggle />
        <Button
          text={'Submit'}
          variants={['marginVertical:1', 'marginHorizontal:auto', 'fullWidth']}
          disabled={!form.isValid}
          onPress={handleSubmit}
        />
      </View>
    </View>
  )
}
