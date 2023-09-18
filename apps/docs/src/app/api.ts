import { I18NRef, makeFetcher, TypeGuards } from '@codeleap/common'
import { Settings } from './Settings'
import { logger } from './logger'

const client = makeFetcher(Settings, {
  // logger,
  multipartParser: (body) => {
    const form = new FormData()

    for (const [key, value] of Object.entries(body)) {
      if (value instanceof File) {
        form.append(key, value)
      } else if (TypeGuards.isArray(value) && value.every((v) => v instanceof File)) {
        value.forEach((v) => form.append(key, v))
      } else {
        if (TypeGuards.isNil(value)) continue

        form.append(key, JSON.stringify(value))
      }
    }
    return form
  },
  requestMiddleware: [
    async (req) => {
      let token = ''

      if (token) {
        req.headers.set('Authorization', token)
      }

      const userLocale = I18NRef.current.locale

      req.headers.set('Accept-Language', userLocale)

      return req
    },
  ],
})

export const api = client
