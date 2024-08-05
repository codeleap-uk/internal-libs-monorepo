import React from 'react'
import { GlobalContextProvider } from '@codeleap/common'
import { Settings } from '@/app'
import { GlobalStyle } from '@/components'

export const Root = ({ children }) => {
  return (
    <GlobalContextProvider
      settings={Settings}
      logger={logger}
      isBrowser
    >
      <GlobalStyle />
      {children}
    </GlobalContextProvider>
  )
}
