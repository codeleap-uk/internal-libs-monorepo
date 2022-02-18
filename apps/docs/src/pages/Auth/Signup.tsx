import { Button, logger, React, Scroll, Text, TextInput, View, Settings } from '@/app'
import { Avatar } from '@/components'
import { Profile, Session, AppStatus } from '@/redux'
import * as yup from 'yup'
import { createForm, useForm } from '@codeleap/common'
import { SceneNavigationProps } from '../Scenes'
import { Providers, tryLogin } from '@/services'
import { useState } from 'react'
import faker from '@faker-js/faker'

const signUpForm = createForm('signUp', {
  email: {
    type: 'text',
    validate: yup.string().email('Invalid email'),
    autoCapitalize: false,
    keyboardType: 'email-address',
    textContentType: 'emailAddress',
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

const devEnv = Settings.Environment.IsDev
const fakeEmail = `tester+${faker.animal.type()}_${faker.datatype.number({ min: 0, max: 100 })}@codeleap.co.uk`
const fakeFirst = `${faker.name.firstName()}`
const fakeLast = `${faker.name.lastName()}`

const initialState = {
  email: devEnv? fakeEmail : '',
  password: devEnv ? 'pppppp' : '',
  repeatPassword: devEnv ? 'pppppp' : '',
  avatar: devEnv ? [null] : [null],
  first_name: devEnv ? fakeFirst : '',
  last_name: devEnv ? fakeLast : '',
}

export const Signup: React.FC<SceneNavigationProps> = ({ navigation, route }) => {
  const form = useForm(signUpForm, {
    output: 'multipart',
    initialState: route?.params?.user || initialState,
    validateOn: 'blur',
  })


  const [usingProvider, setProvider] = useState<Providers|'email'>(route?.params?.provider || 'email')
  async function onSubmit(){
    logger.log('Sign up', form.values, 'Sign up')
    AppStatus.set('loading')
    try {
      const status = await Session.signup({
        data: {
          ...form.values,
          avatar: form.values?.avatar?.[0]?.preview,
        },
        provider: usingProvider,
      }) 
      if (status === 'success'){

        AppStatus.set('splash')
        setTimeout(() => {
          AppStatus.set('idle')
          navigation.navigate('Onboarding')
        }, 2000)
      } else {
        OSAlert.info({
          title: 'Error signing up',
          body: 'An error has ocurred',
        })
      }
    } catch (e){ 
      logger.log('Signup faield', e, 'Authentication')
      AppStatus.set('idle')
      OSAlert.error({
        title: 'Error signing up',
        body: e.code ?  e.message : '', 
      })
    }
  }

  async function setFormValues({avatar, ...profile}: Profile){
    const result = await Session.autoLogin()
    if (result === 'error'){
      setProvider('facebook')
      form.setFormValues({
        ...profile,
      })
    }
  }

  const inputVariants = ['marginTop:1']
  
  return (
    <Scroll variants={['paddingHorizontal:2', 'paddingVertical:4']}>
      <Avatar
        variants={['alignSelfCenter', 'large']}
        profile={{
          avatar: form.values?.avatar?.[0]?.preview,
          email: form.values.email,
          first_name: form.values.first_name,
          last_name: form.values.last_name,
          id: null,
        }}
        onChange={(images) => form.setFieldValue('avatar', images)}
      />
      <TextInput variants={inputVariants} {...form.register('email')} leftIcon={{ name: 'mail' }} />
      <TextInput variants={inputVariants} {...form.register('first_name')} />
      <TextInput variants={inputVariants} {...form.register('last_name')} />
      <TextInput
        {...form.register('password')}
        variants={inputVariants}
        leftIcon={{ name: 'key' }}
        visibilityToggle
      />
      <TextInput
        {...form.register('repeatPassword')}
        variants={inputVariants}
        leftIcon={{ name: 'key' }}
        visibilityToggle
      />
      <Button
        onPress={onSubmit}
        text='Submit'
        variants={['marginVertical:1']}
        disabled={!form.isValid}
      />
      <Text text='Or Signup With' variants={['alignSelfCenter', 'marginHorizontal:auto', 'marginVertical:2']}/> 
      <View variants={['row',  'justifyCenter']}> 
        <Button icon='facebook' variants={['icon:primary']} onPress={() => tryLogin({withProvider: 'facebook'}).then(setFormValues)}/>
        <Button icon='google' variants={['icon:primary']} onPress={() => tryLogin({withProvider: 'google'}).then(setFormValues)}/>
      </View>
      <Button
        text={'Already a user?'}
        variants={['text']}
        onPress={() => navigation.navigate('Login')}
      />
    </Scroll>
  )
}

export default Signup
