import { createSlice } from '@codeleap/common'

import { logger, Settings } from '@/app'

const modals = {
  test: false,
  network: false,
  debug: false,
  auth: false,
}

export type TAppStatus = {
  status: 'loading' | 'done' | 'idle'
  ready: boolean
  modals: Record<keyof typeof modals, any>

}

const initialState: TAppStatus = {
  status: 'idle',
  ready: false,

  modals,
}

type ModalName = keyof TAppStatus['modals']

export const appStatusSlice = createSlice({
  name: 'AppStatus',
  initialState,
  reducers: {
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

  },
  asyncReducers: {
    async set(state, setState, status: TAppStatus['status']) {

      setState({ status })

    },
  },

})
