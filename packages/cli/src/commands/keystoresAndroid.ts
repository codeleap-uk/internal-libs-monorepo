
import { codeleapCommand } from '../lib/Command'

import { generateReleaseKeystore } from '../lib/android/keystore'


export const generateReleaseKey = codeleapCommand(
  {
    name: 'keystores-android',
    parameters: [],
    alias: 'i',
  },
  async ({ _ }) => {
    await generateReleaseKeystore()
    
  },
)
