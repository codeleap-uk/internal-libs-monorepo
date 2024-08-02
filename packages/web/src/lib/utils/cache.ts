import createCache from '@emotion/cache'

export const createCodeleapWebCache = () => {
  return createCache({
    key: 'codeleap-web',
  })
}

export const codeleapWebCache = createCodeleapWebCache()
