import { LocalStorageKeys, logger, api, Settings } from '../app'
import * as Auth from '../services/authentication'
import { createSlice, TypeGuards } from '@codeleap/common'
import { AppStatus } from './index'
import { Toast } from '@codeleap/web'

const DEB_CAT = 'Session'

export type Profile = {
  id: string
  avatar: string
  first_name: string
  last_name: string
  email: string
  password?: string
}

export type TSession = {
  isLoggedIn: boolean
  profile: Profile
  appMounted: boolean
  isDevelopment: boolean
}

const initialState: TSession = {
  isLoggedIn: false,
  profile: null,
  appMounted: false,
  isDevelopment: false,
}

export const sessionSlice = createSlice({
  name: 'Session',
  initialState,
  reducers: {
    setMounted(state) {
      logger.log('setMounted', state, DEB_CAT)
      return {
        appMounted: true,
      }
    },
    setUser(state, payload) {
      return {
        isLoggedIn: true,
        profile: payload,
      }
    },
  },
  asyncReducers: {
    async loginSuccess(state, setState) {

      setState({ isLoggedIn: true })
    },
    async login(
      state,
      setState,
      payload?: Partial<Auth.TryLoginArgs & { silent?: boolean }>,
    ) {

      AppStatus.set('loading')
      const firebaseProfile = await Auth.tryLogin(payload, payload?.silent)

      if (!firebaseProfile) {
        logger.log('Failed to login')
        AppStatus.set('idle')
        return 'error'
      }

      const profile = await Auth.loadOwnProfile()

      const newSession: Partial<TSession> = {
        profile,
      }

      logger.log('New session', newSession, 'Session')

      setState(newSession)

      AppStatus.set('idle')
      return !!profile ? 'success' : 'error'
    },
    async resetPassword() {
      try {
        await Auth.sendPasswordReset()
        logger.log('Reset password email sent')
        AppStatus.set('idle')
      } catch (error) {
        AppStatus.set('idle')
        Toast.error({ title: 'Error' })
      }
    },
    async logout(state, setState) {
      await Auth.logout()

      setState({ ...initialState, appMounted: true })
    },
    async setMode(state, setState, to?:boolean) {
      const newValue = TypeGuards.isBoolean(to) ? to : !state.isDevelopment

      localStorage.setItem(LocalStorageKeys.SESSION_IS_DEV, `${newValue}`)

      api.setConfig({
        baseURL: newValue ? Settings.Fetch.DevelopmentURL : Settings.Fetch.ProductionURL,
      })

      setState({
        isDevelopment: newValue,
      })
    },
    async autoLogin(state, setState, silent = true) {

      try {
        !silent && AppStatus.set('loading')
        const profile = await Auth.loadOwnProfile()

        if (profile?.id) {
          setState({
            profile,
            isLoggedIn: !!profile,
          })
          logger.log('autoLogin success', { state, profile }, DEB_CAT)

        } else {
          throw 'User does not have a profile'
        }

        !silent && AppStatus.set('idle')
        return 'success'
      } catch (e) {

        logger.log('autoLogin failed', e, DEB_CAT)

        !silent && AppStatus.set('idle')
        return 'error'
      }
    },
    async signup(state, setState, payload: Auth.TrySignupArgs) {
      const profile = await Auth.trySignup(payload)
      if (!profile) {
        return 'error'
      }

      setState({
        profile,
        isLoggedIn: true,
      })

      return 'success'
    },
    async reauthenticate(state, setState, payload: Auth.EmailCredential) {
      return await Auth.reauthenticateCredentials(payload)
    },
    async editProfile(state, setState, payload: Partial<Profile>) {
      AppStatus.set('loading')
      let updatedProfile = null

      if (state.profile.email !== payload.email) {
        try {
          await Auth.updateEmail(payload.email)
          logger.log('Email set successfully', payload.email, DEB_CAT)

          updatedProfile = await Auth.saveProfile(state.profile, payload)
          AppStatus.set('idle')
        } catch (error) {
          AppStatus.set('idle')
          const retryLoginErr = 'auth/requires-recent-login'

          if (error.code.startsWith(retryLoginErr)) {
            return { needsAuth: true }
          } else {
            logger.error('Error updating profile', error, 'Session')
            Toast.error({ title: 'There was an error' })
            return
          }
        }
      } else {
        updatedProfile = await Auth.saveProfile(state.profile, payload)
        AppStatus.set('idle')
      }

      logger.log('Editing profile', {
        current: state.profile,
        new: payload,
        apiResponse: updatedProfile,
      }, 'Authentication')

      setState({ profile: updatedProfile })
    },
  },

})
