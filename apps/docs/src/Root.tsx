import React from 'react'
import { StyleProvider } from '@codeleap/common'
import { Settings, variantProvider } from '@/app'
import { Provider } from 'react-redux'
import { store } from '@/redux'
import { GlobalStyle, variants } from '@/components'

export const Root = ({ children }) => {
  return (
    <Provider store={store}>
      <StyleProvider
        settings={Settings}
        variantProvider={variantProvider}
        variants={variants}
        logger={logger}
      >
        <GlobalStyle />
        {children}
      </StyleProvider>
    </Provider>
  )
}
