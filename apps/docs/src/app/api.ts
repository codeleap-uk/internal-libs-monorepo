import { makeFetcher } from '@codeleap/common'
import { Settings } from './Settings'
import { logger } from './logger'
import { withFirebase } from '@/services/firebase'
// import firebase from 'gatsby-plugin-firebase'

const client = makeFetcher(Settings, {
  logger,
  requestMiddleware: [
    async (req) => {
      let token = ''
      const user = await withFirebase(fb => fb.auth().currentUser)
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
