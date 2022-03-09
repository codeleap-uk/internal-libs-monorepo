import { css } from '@emotion/react'
import { Theme } from '../theme'
import CodeThemes from './Code'

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
  *::-webkit-scrollbar {
    width: 5px;
  }
  
  .code_style {
    align-self: stretch;
    padding: 20px;
    border-radius: 5px;
    position: relative;
    max-width: 62vw;
    ${Theme.media.down('small')} {
      max-width: 96vw;
      overflow-x: auto;
    }
  }

  
  .code_style::-webkit-scrollbar {
    height: 5px;
   
  }
`

export const globalStyleDark = css`
  ${globalStyle}

  *::-webkit-scrollbar-track-piece {
    background-color:  ${Theme.colors.dark.background};
  }

  *::-webkit-scrollbar-thumb {
    background-color: ${Theme.colors.dark.primary};
    border-radius: 18px;
  } 
  
  .code_style::-webkit-scrollbar-track-piece{
    background-color: ${CodeThemes.dark.plain.backgroundColor}
  }
`
export const globalStyleLight = css`
  ${globalStyle}

  *::-webkit-scrollbar-track-piece {
    background-color: ${Theme.colors.light.background};
  }
 
  *::-webkit-scrollbar-thumb {
    background-color: ${Theme.colors.light.primary};
    border-radius: 18px;
  } 
  
  .code_style::-webkit-scrollbar-track-piece{
    background-color: ${CodeThemes.light.plain.backgroundColor}
  }

`
