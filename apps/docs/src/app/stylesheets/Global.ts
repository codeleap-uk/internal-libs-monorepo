import { css } from '@emotion/react'
import { Theme } from '../theme'
export const globalStyle = css`
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  /* #___gatsby,
  #gatsby-focus-wrapper {
    height: 100vh;
    min-height: 100vh;
    background-color: ${Theme.colors.b};
    overflow-x: hidden;
  }
  */
  ::-webkit-scrollbar {
    width: 5px;
  }
  
  
`

export const globalStyleDark = css`
  ${globalStyle}

  ::-webkit-scrollbar-track-piece {
    background-color:  ${Theme.colors.dark.background};
  }

  ::-webkit-scrollbar-thumb:vertical {
    background-color: ${Theme.colors.dark.primary};
    border-radius: 18px;
  } 
`
export const globalStyleLight = css`
  ${globalStyle}

  ::-webkit-scrollbar-track-piece {
    background-color: ${Theme.colors.light.background};
  }
  
  ::-webkit-scrollbar-thumb:vertical {
    background-color: ${Theme.colors.light.primary};
    border-radius: 18px;
  } 
`
