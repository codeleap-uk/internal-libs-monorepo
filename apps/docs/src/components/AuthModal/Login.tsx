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
  test: {
    type: 'list',
    defaultValue: ['stuff'],
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

  function addToList() {
    form.setFieldValue('test', [...form.values.test, ''])
  }

  function onListEdit(value, idx) {
    const newValues = [...form.values.test]

    newValues[idx] = value

    form.setFieldValue('test', newValues)
  }

  function onListDelete(idx) {
    const newList = form.values.test.filter((_, listIdx) => listIdx !== idx)
    form.setFieldValue('test', newList)
  }

  return (
    <>
      <Logo/>
      <TextInput {...form.register('email')} />
      <TextInput {...form.register('password')} visibilityToggle />
      {
        form.values.test.map((v, idx) => <TextInput value={v} onChangeText={(value) => onListEdit(value, idx)} rightIcon={{
          name: 'close',
          action: () => onListDelete(idx),
        }}/>)
      }
      <Button
        text={'Add'}
        variants={['marginVertical:1', 'marginHorizontal:auto', 'fullWidth']}
        onPress={addToList}
      />
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
