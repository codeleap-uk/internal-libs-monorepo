import { Global } from '@emotion/react'

export const GlobalStyle = () => <Global
  styles={{
    '*': {
      boxSizing: 'border-box',
      padding: 0,
      margin: 0,
      textDecoration: 'none',
    },

    'html': {
      overflowX: 'hidden',
      padding: 0,
      margin: 0,
    },

    'body': {
      overflowX: 'hidden',
      padding: 0,
      margin: 0,
    },
  }}
/>
