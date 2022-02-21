import { createSlice } from '@codeleap/common'
import { NetInfoState } from '@react-native-community/netinfo'
import { AppStateStatus } from 'react-native'
import { logger, Settings } from '@/app'

const modals = {
  test: false,
  network: false,
  debug: false,
}

export type TAppStatus = {
  status: 'loading' | 'done' | 'idle' | 'splash' | 'blank';
  ready: boolean;
  modals:  Record<keyof typeof modals, any>
  currentState: AppStateStatus
  network: null | (NetInfoState & { isValid: boolean })
};

const initialState: TAppStatus = {
  status: 'blank',
  ready: false,
  currentState: 'unknown',
  modals,
  network: null,
}

type ModalName = keyof TAppStatus['modals']

export const appStatusSlice = createSlice({
  name: 'AppStatus',
  initialState,
  reducers: {
    setModal(state, modal: [ModalName, boolean] | ModalName) {
      const [name, value] = Array.isArray(modal) ? modal  : [modal, !state.modals[modal]]
      return {
        modals: {
          [name]: value,
        },
      }
    },
    setState(state, to:TAppStatus['currentState']) {
      return {
        currentState: to,
      }
    },
    setReady(state, to:boolean) {
      return {
        ready: to,
      }
    },
    setNetwork(state, to:Partial<TAppStatus['network']>) {

      return {
        network: {
          ...to,
          isValid: to?.isConnected && to?.isInternetReachable,
        },
      }
    },
  },
  asyncReducers: {
    async set(state, setState, status: TAppStatus['status']) {
      logger.log('set()', { state, status }, 'redux/AppStatus')
      // HACK this attempts to fix getting stuck on the splash screen when fast refreshing
      if (state.currentState == 'unknown' && Settings.Environment.IsDev) {
        setState({ status: 'idle', currentState: 'active' })
        logger.log(`Skipping AppStatus.set('${status}') to avoid development bugs...`, '', 'redux/AppStatus')
        return
      }
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
