import * as React from 'react'

import { onMount, useState, onUpdate, useCodeleapContext, useLayoutEffect } from '@codeleap/common'
import { Provider as ReduxProvider } from 'react-redux'
import { LocalStorageKeys, logger, Theme, variantProvider } from './app'
import { Session, store, useAppSelector } from './redux'
import { Global } from '@emotion/react'
import { globalStyleDark, globalStyleLight } from './app/stylesheets/Global'
import { ToastContainer } from 'react-toastify'
import { withFirebase } from './services/firebase'

function init() {
  logger.log('Initialising app...', '', 'App lifecycle')

  logger.analytics.event('App Initialized', { confidential: 'Cacetinho' })

}

init()

const Toaster = () => {
  const { currentTheme } = useCodeleapContext()

  const colors = Theme.colors[currentTheme]
  const { isLoggedIn, appMounted } = useAppSelector(store => store.Session)

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      variantProvider.setColorScheme(window.___savedTheme)
    }
  }, [])
  onUpdate(() => {
    const unsubscribe = withFirebase((fb) => fb.auth().onAuthStateChanged((user) => {
      if (user && !isLoggedIn && !appMounted) {
        Session.autoLogin(false).then(() => Session.setMounted()).catch(() => Session.setMounted())
      } else {
        Session.setMounted()
      }
    }))

    return () => {
      unsubscribe.then(unsub => unsub())
    }
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

  return (

    <ReduxProvider store={store}>

      <Toaster />

      {children}

    </ReduxProvider>

  )
}

export default Root
