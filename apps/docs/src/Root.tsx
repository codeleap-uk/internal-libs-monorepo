import * as React from 'react'

import { onMount, StyleProvider } from '@codeleap/common'
import { Provider as ReduxProvider } from 'react-redux'
import { logger, Settings, variantProvider, variants } from './app'
import { store } from './redux'
import { Global } from '@emotion/react'
import { globalStyle } from './app/stylesheets/Global'


function init() {
  logger.log('Initialising app...', '', 'App lifecycle')
  

  logger.analytics.event('App Initialized', { confidential: 'Cacetinho' })

}


init()

const Root = ({children}) => {

  onMount(() => {
    const unsubscribe = variantProvider.onColorSchemeChange(t => {
      localStorage.setItem('codeleap.theme', t.theme)
    })

    return unsubscribe
  })

  return (

    <ReduxProvider store={store}>
      <Global styles={globalStyle}/>
      <StyleProvider
        variants={variants}
        settings={Settings}
        variantProvider={variantProvider}
        logger={logger}
      >
        {children}
      </StyleProvider>
    </ReduxProvider>

  )
}

export default Root
