
export {}

// @important Implement MMKV Storage after react native is updated
// @note MMKV is not good with large amounts of data, it will be 
// necessary to separate the keys and possibly minify the data value

/*
import { MMKV } from 'react-native-mmkv'
import { StateStorage } from 'zustand/middleware'
import { IS_MOBILE } from './constants'

const mmkvStorage = IS_MOBILE ? new MMKV() : {} as MMKV

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
*/
