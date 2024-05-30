import { MMKV } from 'react-native-mmkv'
import { StateStorage } from 'zustand/middleware'
import { IS_NATIVE } from './constants'

const mmkvStorage = IS_NATIVE ? new MMKV() : {} as MMKV

// @note implement minifier

export const nativeStorage: StateStorage = {
  setItem: (name, value) => {
    return mmkvStorage?.set(name, value)
  },
  getItem: (name) => {
    const value = mmkvStorage?.getString(name)
    return value ?? null
  },
  removeItem: (name) => {
    return mmkvStorage?.delete(name)
  },
}
