import 'firebase/auth'
import { onMount, StyleProvider } from '@codeleap/common'
import React, {useState} from 'react'
import { variants, variantProvider, globalStyle } from './src/app'
import { ToastContainer } from 'react-toastify'
import { Global } from '@emotion/react'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '@/redux'
import 'react-toastify/dist/ReactToastify.css'
import Root from '@/Root'
import { Overlays } from '@/pages'


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const wrapRootElement = ({ element }) => {

  return (
    <Root>
      <Overlays/>
      {element}
    </Root>
  )
}
