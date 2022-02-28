import * as React from 'react'

import { onMount, StyleProvider, useCodeleapContext } from '@codeleap/common'
import { Provider as ReduxProvider } from 'react-redux'
import { logger, Settings, Theme, variantProvider, variants } from './app'
import { store } from './redux'
import { Global } from '@emotion/react'
import { globalStyle } from './app/stylesheets/Global'
import { ToastContainer } from 'react-toastify'

function init() {
  logger.log('Initialising app...', '', 'App lifecycle')

  logger.analytics.event('App Initialized', { confidential: 'Cacetinho' })

}

init()

const Toaster = () => {
  const { currentTheme } = useCodeleapContext()

  const colors = Theme.colors[currentTheme]

  return <ToastContainer
    toastStyle={{
      background: colors.background,
      color: colors.textH,
    }}
  />
}

const Root = ({ children }) => {

  onMount(() => {
    const unsubscribe = variantProvider.onColorSchemeChange(t => {
      if (window) {
        localStorage.setItem('codeleap.theme', t.theme)

      }
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
        <Toaster />

        {children}
      </StyleProvider>
    </ReduxProvider>

  )
}

export default Root
