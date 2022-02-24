import {
  Button,
  logger,
  React,
  TextInput,
  View,
  Settings,
} from '@/app'
import { Session } from '@/redux'
import * as yup from 'yup'
import { createForm, useForm } from '@codeleap/common'
import { Scroll } from '@codeleap/web'
import { SceneNavigationProps } from '../Scenes'
import { Logo } from '@/components'
import { profileFromUser,  trySocialLogin } from '@/services'

const devEnv = Settings.Environment.IsDev

const signInForm = createForm('signIn', {
  email: {
    type: 'text',
    placeholder: 'myaddress@email.com',
    validate: yup
      .string()
      .required('This is a required field')
      .email('Invalid email'),
  },
  password: {
    type: 'text',
    password: true,
    validate: yup
      .string()
      .required('This is a required field')
      .min(6, 'Minimum of 6 characters')
      .max(128, 'Maximum of 128 characters'),
  },
})

export const Login: React.FC<SceneNavigationProps> = ({ navigation }) => {
  const form = useForm(signInForm, {
    output: 'json',
    validateOn: 'blur',
    initialState: {
      email: devEnv ? 'tester@codeleap.co.uk' : '',
      password: devEnv ? 'pppppp' : '',
    },
  })

  async function onSubmit() {
    logger.log('Sign in', form.values, 'Sign in')
    try {
      const result = await Session.login({
        withProvider: 'email',
        data: form.values,
      })

      if (result === 'success') {
        Session.loginSuccess()
      }
    } catch (e) {}

  }

  async function socialLogin(provider) {
    let user = null
    try {
      const firebaseUser = await trySocialLogin({ withProvider: provider })

      user = profileFromUser(firebaseUser.user)
    } catch (e) {
    }

    if (user) {
      let shouldGoToSignup = true

      const result = await Session.autoLogin()

      shouldGoToSignup = result === 'error'

      if (shouldGoToSignup) {
        navigation.navigate('Signup', { user, provider })
      }
    }

  }

  return (
    <Scroll variants={['justifyCenter', 'padding:2', 'fullHeight']}>
      <View variants={'marginBottom:4'}>
        <Logo variants={['black']} switchServerOnPress/>
      </View>
      <View>
        <TextInput {...form.register('email')} leftIcon={{ name: 'mail' }} debugName={'Login Email input'} />
        <TextInput
          {...form.register('password')}
          leftIcon={{ name: 'key' }}
          visibilityToggle
        />
        <Button
          variants={['marginVertical:2']}
          onPress={() => onSubmit()}
          text='Sign in'
          debugName={'Sign in'}
          disabled={!form.isValid}
        />
        <View variants={['row', 'justifyCenter', 'marginVertical:1']}>

          <Button
            icon='google'
            onPress={() => socialLogin('google')}
            variants={['icon:primary']}
            debugName={'Social login with Google'}
          />

          <Button
            icon='facebook'
            onPress={() => socialLogin('facebook')}
            variants={['icon:primary']}
            debugName={'Social login with Facebook'}
          />

        </View>
        <Button
          text={"Don't have an account?"}
          variants={['text', 'marginVertical:2', 'small']}
          onPress={() => navigation.navigate('Signup')}
          debugName={'Go to sign up page'}
        />
        <Button
          text={'Forgot Password?'}
          variants={['text', 'small']}
          onPress={() => navigation.navigate('ForgotPassword')}
          debugName={'Go to Forgot Password page'}
        />
      </View>
    </Scroll>
  )
}

export default Login
