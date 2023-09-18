import { createCodeleapWebCache } from '@codeleap/web'
import { CacheProvider } from '@emotion/react'
import { Root } from './src/Root'

export const wrapRootElement = ({ element }) => {
  return (
    <CacheProvider value={createCodeleapWebCache()}>
      <Root>
        {element}
      </Root>
    </CacheProvider>
  )
}
