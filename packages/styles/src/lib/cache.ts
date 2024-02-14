import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import hashKey from 'object-hash'

export const commonVariantsStore = create(
  persist(
    () => ({
      variants: null,
      key: null,
    }),
    {
      name: '@styles.stores.commonVariants',
    },
  )
)

export {
  hashKey
}
