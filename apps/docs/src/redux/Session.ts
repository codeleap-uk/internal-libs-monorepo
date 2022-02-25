import { LocalStorageKeys, logger, api, Settings } from '../app'
import * as Auth from '../services/authentication'
import { createSlice, TypeGuards } from '@codeleap/common'
import { AppStatus } from './index'

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
      AppStatus.set('splash')
      setTimeout(() => {
        setState({ isLoggedIn: true })
        setTimeout(() => {
          AppStatus.set('idle')
        }, 1000)
      }, 1000)
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

      AppStatus.set('blank')

      const profile = await Auth.loadOwnProfile()

      const newSession: Partial<TSession> = {
        profile,
      }

      logger.log('New session', newSession, 'Session')

      setState(newSession)

      return !!profile ? 'success' : 'error'
    },
    async logout(state, setState) {
      await Auth.logout()

      setState(initialState)
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
      // OSAlert.info({
      //   title: 'Now using ' + (newValue ? 'development' : 'production') + ' server',
      // })
    },
    // To be called onAuthStateChange with firebase
    async autoLogin(state, setState) {
      try {
        const profile = await Auth.loadOwnProfile()
        if (profile?.id) {
          setState({
            profile,
            isLoggedIn: !!profile,
          })
          logger.log('autoLogin success', { state, profile }, DEB_CAT)
          setTimeout(() => {
            AppStatus.set('idle')
          }, 1000)
        } else {
          throw 'User does not have a profile'
        }
        return 'success'
      } catch (e) {
        logger.log('autoLogin failed', e, DEB_CAT)
        AppStatus.set('idle')
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
      })

      return 'success'
    },
    async editProfile(state, setState, payload: Partial<Profile>) {
      const updatedProfile = await Auth.updateProfile(state.profile, payload)

      logger.log('Editing profile', {
        current: state.profile,
        new: payload,
        apiResponse: updatedProfile,
      }, 'Authentication')

      setState({
        profile: updatedProfile,
      })

    },
  },

})
