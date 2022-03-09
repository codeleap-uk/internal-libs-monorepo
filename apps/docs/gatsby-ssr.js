import React from 'react'
import 'react-toastify/dist/ReactToastify.css'
import 'firebase/auth'
import { wrapRootElement } from './wrapWithRootElement'
import { LocalStorageKeys } from './src/app/constants'

const injectScript = `
(function () {
    var preference = [
        localStorage.getItem("${LocalStorageKeys.THEME}"),
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
    ]

    window.___savedTheme = preference.find(x => !!x)
})()
`

const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <script
      key='theme-script'
      dangerouslySetInnerHTML={{
        __html: injectScript,
      }}
    />,
  ])
}

export {
  wrapRootElement,
  onRenderBody,
}
