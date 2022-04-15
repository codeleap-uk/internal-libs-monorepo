import { React, Button, Settings, Text, TextInput, Touchable, variantProvider, View } from '@/app'
import { Session, sessionSlice } from '@/redux'
import { profileFromUser } from '@/services/authentication'
import { createForm, onMount, useForm, useState } from '@codeleap/common'
// import firebase from 'firebase'
import * as yup from 'yup'
import { Link } from '../Link'
import { AppStatus } from '@/redux'
import { Toast } from '@codeleap/web'
import { withFirebase } from '@/services/firebase'

export const signupForm = createForm('signup', {
  first_name: {
    type: 'text',
    label: 'First Name',
    validate: yup
      .string()
      .required('This cannot be empty'),
  },
  last_name: {
    type: 'text',
    label: 'Last Name',
    validate: yup.string().required('This cannot be empty'),
  },

  email: {
    type: 'text',
    label: 'Email Address',
    validate: yup.string().required('This cannot be empty').email('Invalid email'),
  },
  password: {
    type: 'text',
    password: true,
    label: 'Password',
    validate: yup.string().required('Password is required'),
  },
  repeatPassword: {
    type: 'text',
    label: 'Confirm Password',
    password: true,

    validate: (repeatPassword, { password }) => {
      const isValid = repeatPassword === password
      return {
        valid: isValid,
        message: isValid ? '' : "Passwords don't match",
      }
    },
  },
})

export const SignupForm = ({ onFormSwitch, onAuthSuccess = null }) => {
  const [usingProvider, setUsingProvider] = useState('email')

  onMount(() => {
    withFirebase((fb) => {

      const currentUser = fb.auth().currentUser
      const profile = profileFromUser(currentUser)

      if (profile) {
        form.setFormValues(profile)
        setUsingProvider('social')
      }
    })

  })

  const form = useForm(signupForm, {
    output: 'json',
    validateOn: 'blur',
  })

  const handleSubmit = async () => {
    const isValid = form.validateAll(true)
    if (isValid) {
      try {
        const status = await Session.signup({
          data: {
            ...form.values,
            avatar: null,
          },
          provider: usingProvider,
        })
        if (status === 'success') {
          onAuthSuccess?.()
        } else {
          Toast.info({
            title: 'Error signing up',
            body: 'An error has ocurred',
          })
        }
      } catch (e) {
        logger.log('Signup failed', e, 'Authentication')
        AppStatus.set('idle')
        Toast.error({
          title: 'Error signing up',
          body: e.code ? e.message : '',
        })
      }
    }
  }

  const renderTextInput = (register, props = {}) => {
    return (
      <TextInput {...form.register(register)} {...props} />
    )
  }

  return (
    <View variants={['column', 'gap:1']}>

      {renderTextInput('first_name')}
      {renderTextInput('last_name')}
      {renderTextInput('email')}
      {renderTextInput('password', {
        visibilityToggle: true,
      })}
      {renderTextInput('repeatPassword', {
        visibilityToggle: true,
      })}

      <Button
        text={'Submit'}
        variants={['marginTop:2', 'fullWidth']}
        onPress={handleSubmit}
        disabled={!form.isValid}

      />

      <Text variants={['alignSelfCenter', 'textCenter']}>
        Already have an account? <Button text={'Login'} variants={['text', 'link', 'inline']} onPress={onFormSwitch}/>
      </Text>
      <Text
        variants={['marginBottom:2', 'alignSelfCenter', 'textCenter']}
      >
          By signing in you agree with the <Link to={Settings.ContactINFO.TermsAndPrivacy} variants={['underlined']} text={'Terms and Conditions'}/>
      </Text>

    </View>

  )
}

const styles = variantProvider.createComponentStyle({

  touchableWrapper: {
    cursor: 'pointer',
  },
}, true)
