import { Button, React, Text, TextInput, Theme, View } from '@/app'

import * as yup from 'yup'
import {
  createForm,
  onUpdate,
  useForm,
  useInterval,
  usePartialState,
} from '@codeleap/common'
import { SceneNavigationProps } from '../Scenes'
import { sendPasswordReset } from '@/services'

const signInForm = createForm('forgotPassword', {
  email: {
    type: 'text',
    placeholder: 'johndoe@email.com',
    validate: yup
      .string()
      .required('This is a required field')
      .email('Invalid email'),
  },
})

export const ForgotPassword: React.FC<SceneNavigationProps> = () => {
  const form = useForm(signInForm, {
    output: 'json',
    validateOn: 'change',
  })

  const [{ linkWasSent, canResendEmail, resendCountdown }, setState] =
    usePartialState({
      linkWasSent: false,
      canResendEmail: false,
      resendCountdown: null,
    })

  const interval = useInterval(() => {
    setState((current) => ({
      resendCountdown: current.resendCountdown - 1,
    }))
  }, 1000)

  async function onSubmit() {
    await sendPasswordReset(form.values.email)

    setState({
      linkWasSent: true,
      resendCountdown: 60,
    })
    interval.start()
  }

  onUpdate(() => {
    if (resendCountdown === 0) {
      interval.clear()
      setState({
        canResendEmail: true,
        resendCountdown: null,
      })
    }
  }, [resendCountdown])

  if (!linkWasSent) {
    return (
      <View variants={['justifyCenter', 'padding:3', 'fullHeight']}>
        <Text
          text={`Forgot password`}
          variants={['h3', 'marginBottom:6', 'textCenter']}
        />
        <TextInput {...form.register('email')} leftIcon={{ name: 'mail' }} debugName={'ForgotPassword Email input'} />
        <Button
          variants={['marginTop:2']}
          onPress={() => onSubmit()}
          text='Send reset link'
          disabled={!form.isValid}
          debugName={'Send reset password link'}
        />
        <Button
          variants={['marginTop:2', 'neutral']}
          // onPress={() => navigation.navigate('Login')}
          text='Back'
          debugName={'Back'}
        />
      </View>
    )
  }

  return (
    <View variants={['justifyCenter', 'padding:3', 'fullHeight']}>
      <Text
        text={`A link was sent to ${form.values.email}`}
        variants={['textCenter']}
      />
      {typeof resendCountdown === 'number' ? (
        <>
          <Text
            text={`You may get a new link in`}
            variants={['textCenter', 'marginVertical:3']}
          />
          <Text
            text={`${resendCountdown}s`}
            variants={['h1', 'textCenter', 'marginHorizontal:auto']}
            style={{ color: Theme.colors.primary }}
          />
        </>
      ) : null}
      <Button
        variants={['marginTop:2']}
        onPress={() => onSubmit()}
        text='Resend link'
        disabled={!canResendEmail}
        debugName={'Resend reset password link'}
      />
      <Button
        variants={['marginTop:2', 'neutral']}
        // onPress={() => navigation.navigate('Login')}
        text='Back'
        debugName={'Back'}
      />
    </View>
  )
}

export default ForgotPassword
