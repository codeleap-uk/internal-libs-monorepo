import { makeFetcher } from '@codeleap/common'
import { Settings } from './Settings'
import { logger } from './logger'
import { getFirebase } from '@/services/firebase'

const client = makeFetcher(Settings, {
  logger,
  requestMiddleware: [
    async (req) => {
      let token = ''
      const user = getFirebase().auth().currentUser

      if (user) {
        token = (await user.getIdTokenResult()).token
      }

      const result = {
        ...req,
        headers: {
          ...req.headers,
          Authorization: token,
        },
      }
      return result
    },
  ],
})

export const api = client
