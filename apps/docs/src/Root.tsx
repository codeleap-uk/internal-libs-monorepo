import * as React from 'react'

import { onMount, onUpdate, StyleProvider, useCodeleapContext } from '@codeleap/common'
import { Provider as ReduxProvider } from 'react-redux'
import { LocalStorageKeys, logger, Settings, Theme, variantProvider, variants } from './app'
import { Session, store, useAppSelector } from './redux'
import { Global } from '@emotion/react'
import { globalStyle, globalStyleDark, globalStyleLight } from './app/stylesheets/Global'
import { ToastContainer } from 'react-toastify'
import { auth } from 'firebase'
import { firebase } from './services'

function init() {
  logger.log('Initialising app...', '', 'App lifecycle')

  logger.analytics.event('App Initialized', { confidential: 'Cacetinho' })

}

init()

const Toaster = () => {
  const { currentTheme } = useCodeleapContext()

  const colors = Theme.colors[currentTheme]
  const { isLoggedIn } = useAppSelector(store => store.Session)
  onUpdate(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user && !isLoggedIn) {
        Session.autoLogin(false).then(() => Session.setMounted())
      }
    })

    return unsubscribe
  }, [isLoggedIn])

  return <>
    <Global styles={currentTheme === 'dark' ? globalStyleDark : globalStyleLight}/>
    <ToastContainer
      toastStyle={{
        background: colors.background,
        color: colors.textH,
      }}
    />
  </>
}

const Root = ({ children }) => {

  onMount(() => {

    const unsubscribe = variantProvider.onColorSchemeChange(t => {
      if (window) {
        localStorage.setItem(LocalStorageKeys.THEME, t.theme)

      }
    })
    return () => {
      unsubscribe()
    }
  })

  return (

    <ReduxProvider store={store}>

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
