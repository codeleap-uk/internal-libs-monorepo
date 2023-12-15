import React from 'react'
// import { StyleProvider } from '@codeleap/common'
// import { Settings, variantProvider } from './app'
// import { GlobalStyle, variants } from './components'

export const Root = ({ children }) => {
  const [value, set] = React.useState(0)

  return (
    <React.Fragment>
      <p>{value}</p>
    </React.Fragment>
  )

  // return (
  //   <StyleProvider
  //     settings={Settings}
  //     variantProvider={variantProvider}
  //     variants={variants}
  //     logger={logger}
  //   >
  //     <GlobalStyle />
  //     {children}
  //   </StyleProvider>
  // )
}
