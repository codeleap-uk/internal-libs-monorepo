import * as React from 'react'

import { onMount, useState, onUpdate, useCodeleapContext, useLayoutEffect } from '@codeleap/common'
import { Provider as ReduxProvider } from 'react-redux'
import { LocalStorageKeys, logger, Theme, variantProvider } from './app'
import { Session, store, useAppSelector } from './redux'
import { Global } from '@emotion/react'
import { globalStyleDark, globalStyleLight } from './app/stylesheets/Global'
import { ToastContainer } from 'react-toastify'
import { withFirebase } from './services/firebase'
import { useWindowSize } from '@codeleap/web'
import { setWindowSize } from './app/theme'
function init() {
  logger.log('Initialising app...', '', 'App lifecycle')

  logger.analytics.event('App Initialized', { confidential: 'Cacetinho' })

}

init()

const Toaster = () => {

  const { currentTheme } = useCodeleapContext()
  const colors = Theme.colors[currentTheme]
  const { isLoggedIn, appMounted } = useAppSelector(store => store.Session)

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

const ChildWrapper = ({ children }) => {
  return children
}

const Root = ({ children }) => {
  const { currentTheme } = useCodeleapContext()

  onMount(() => {
    const savedTheme = localStorage.getItem(LocalStorageKeys.THEME)
    if (savedTheme) {
      variantProvider.setColorScheme(savedTheme)
    }
  })
  onUpdate(() => {
    localStorage.setItem(LocalStorageKeys.THEME, currentTheme)
  }, [currentTheme])

  const winSize = useWindowSize()
  const sizeStr = winSize?.[0]?.toString()
  setWindowSize(winSize)
  return (

    <ReduxProvider store={store}>

      <Toaster />
      <ChildWrapper key={sizeStr}>
        {children}
      </ChildWrapper>

    </ReduxProvider>

  )
}

export default Root
