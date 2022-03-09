import Root from './src/Root'
import { Overlays } from './src/pages'
import { Settings, variantProvider, variants, logger } from './src/app'
import { StyleProvider } from '@codeleap/common'

export function wrapRootElement({ element }) {

  return (
    <StyleProvider
      variants={variants}
      settings={Settings}
      variantProvider={variantProvider}
      logger={logger}
    >
      <Root>
        <Overlays/>
        {element}
      </Root>
    </StyleProvider>
  )
}
