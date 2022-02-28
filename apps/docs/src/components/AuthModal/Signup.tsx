import { Button, Settings, Text, TextInput, Touchable, variantProvider, View } from '@/app'
import { Session, sessionSlice } from '@/redux'
import { profileFromUser } from '@/services'
import { createForm, onMount, useForm, useState } from '@codeleap/common'
import firebase from 'firebase'
import * as yup from 'yup'
import { Link } from '../Link'
import { AppStatus } from '../ComponentShowcase/showCases'

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

export const SignupForm = () => {
  const [usingProvider, setUsingProvider] = useState('email')

  onMount(() => {
    const currentUser = firebase.auth().currentUser
    const profile = profileFromUser(currentUser)

    if (profile) {
      form.setFormValues(profile)
      setUsingProvider('social')
    }
    console.log({ profile })
  })

  const form = useForm(signupForm, {
    output: 'json',
    validateOn: 'blur',
  })

  const handleSubmit = () => {
    const isValid = form.validateAll(true)
    if (isValid) {
      Session.signup({ data: form.values, provider: usingProvider })
    }
  }

  const renderTextInput = (register, props) => {
    return (
      <TextInput {...form.register(register)} {...props} />
    )
  }

  return (
    <View variants={['column', 'fullWidth']}>
      <View css={styles.inputs} variants={['gap:1']}>
        {renderTextInput('first_name', false)}
        {renderTextInput('last_name', false)}
        {renderTextInput('email', false)}
        {renderTextInput('password', true)}
        {renderTextInput('repeatPassword', {
          visibilityToggle: true,
        })}
      </View>
      <Button
        text={'Submit'}
        variants={['marginTop:2', 'fullWidth']}
        onPress={handleSubmit}
        disabled={!form.isValid}

      />
      <View variants={['column', 'center', 'marginTop:2']}>
        <Text
          variants={['marginBottom:2']}
        >
          By signing in you agree with the <Link to={Settings.ContactINFO.TermsAndPrivacy} variants={['underlined']} text={'Terms and Conditions'}/>
        </Text>

      </View>
    </View>
  )
}

const styles = variantProvider.createComponentStyle({
  inputs: {
    display: 'grid',
    gridTemplateColumns: 'auto',
    overflow: 'hidden',
  },

  touchableWrapper: {
    cursor: 'pointer',
  },
}, true)
