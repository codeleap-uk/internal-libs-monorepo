import { createSlice, TypeGuards } from '@codeleap/common'
import { api, LocalStorageKeys, Settings } from '@/app'

const modals = {
  test: false,
  network: false,
  debug: false,
  auth: false,
}

export type TAppStatus = {
  status: 'loading' | 'done' | 'idle' | 'splash' | 'blank'
  ready: boolean
  modals: Record<keyof typeof modals, any>
  isDev: boolean
  canGoBlank: boolean
  authFinished: boolean
  hasResolvedInitialAuth: boolean
}

const initialState: TAppStatus = {
  status: 'splash',
  ready: false,
  modals,
  canGoBlank: true,
  authFinished: false,
  isDev: false,
  hasResolvedInitialAuth: false,
}

type ModalName = keyof TAppStatus['modals']

export const appStatusSlice = createSlice({
  name: 'AppStatus',
  initialState,
  reducers: {
    initialAuthResolved() {
      return {
        hasResolvedInitialAuth: true,
      }
    },
    setModal(state, modal: [ModalName, boolean] | ModalName) {
      const [name, value] = Array.isArray(modal) ? modal : [modal, !state.modals[modal]]
      return {
        modals: {
          [name]: value,
        },
      }
    },
    setReady(state, to:boolean) {
      return {
        ready: to,
      }
    },
    toggleDevMode(state, setTo = null) {
      let newState = !state.isDev

      if (TypeGuards.isBoolean(setTo)) {
        newState = setTo
      }

      api.setConfig({
        baseURL: newState ? Settings.Fetch.DevelopmentURL : Settings.Fetch.ProductionURL,
      })

      localStorage.setItem(LocalStorageKeys.SESSION_IS_DEV, newState ? 'true' : 'false')

      return {
        isDev: newState,
      }
    },

  },
  asyncReducers: {
    async authFinished(state, setState, to = true) {
      setState({ status: 'done', modals: initialState.modals })
    },
    async set(state, setState, status: TAppStatus['status']) {

      // HACK this fixes the animation transition blinking between the splash screen and idle
      if (status === 'idle' && state.status === 'splash') {
        setTimeout(() => setState({ status: 'idle' }), 500)
        setState({ status: 'blank' })
      } else {
        setState({ status })
      }

    },
  },
})
