import { TextInputProps } from 'react-native'

const createInputPresets = <T extends Record<string, (...args:any[]) => Partial<TextInputProps>>>(p:T):T => {
  return p
}

export const mobileInputPresets = createInputPresets({
  email: () => ({
    keyboardType: 'email-address',
    autoCapitalize: 'none',
    autoComplete: 'email',
    textContentType: 'emailAddress',

  }),
  name: () => ({
    autoCapitalize: 'words',
    autoComplete: 'name',
    textContentType: 'name',

  }),
  chat: () => ({
    returnKeyType: 'send',

  }),
  password: (options?: {new?: boolean}) => {
    return {
      autoCapitalize: 'none',
      autoComplete: options?.new ? 'password-new' : 'password',
      textContentType: options?.new ? 'newPassword' : 'password',
    }
  },
  search: () => ({
    returnKeyType: 'search',
  }),
  redeemCode: (action:'join'|'obtain' = 'obtain') => {
    const isJoin = action === 'join'
    if (isJoin) {
      return {
        returnKeyType: 'join',
        textContentType: 'oneTimeCode',
        autoComplete: 'sms-otp',
      }
    }
    return {
      returnKeyType: 'done',
      textContentType: 'oneTimeCode',
      autoComplete: 'sms-otp',
    }

  },
})
