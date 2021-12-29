/* eslint-disable no-restricted-imports */
/* eslint-disable no-unused-vars */
import React from 'react'
import { ButtonStyles, VariantProvider } from '.'
import { createTheme, StyleProvider, useComponentStyle } from '..'
import { ComponentVariants } from '../..'
import { CSSObject } from '@emotion/css'

const appTheme = createTheme({
  breakpoints: {
    xs: 10,
  },
  colors: {
  },
  spacing: 10,
  baseFontSize: 16,
  borderRadius: {
    large: 30,
    medium: 20,
    small: 10,
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    baseFontSize: 16,
    styles: {
      h1: {
        lineHeight: 1,
        size: {
          max: 72,
          min: 38,
          viewport: 2.8,
          multiplier: 1.3,

        },
        weigth: 400,
      },
      h2: {
        lineHeight: 1,
        size: {
          max: 68,
          min: 28,
          viewport: 1.4,
          multiplier: 1.3,

        },
        weigth: 400,
      },
      h3: {
        lineHeight: 1,
        size: {
          max: 26,
          min: 22,
          viewport: 0.45,
          multiplier: 1,

        },
        weigth: 400,
      },
      h4: {
        lineHeight: 1,
        size: {
          max: 18,
          min: 16,
          viewport: 0.4,
          multiplier: 1,

        },
        weigth: 400,
      },
      h5: {
        lineHeight: 1,
        size: {
          max: 16,
          min: 14,
          viewport: 0.4,
          multiplier: 0.63,

        },
        weigth: 400,
      },
      h6: {
        lineHeight: 1,
        size: {
          max: 14,
          min: 12,
          viewport: 0.4,
          multiplier: 0.5,

        },
        weigth: 400,
      },
      p1: {
        lineHeight: 1,
        size: {
          max: 20,
          min: 16,
          viewport: 1,
          multiplier: 1,

        },
        weigth: 400,
      },
      p2: {
        lineHeight: 1,
        size: {
          max: 16,
          min: 14,
          viewport: 0.3,
          multiplier: 0.44,

        },
        weigth: 400,
      },
      p3: {
        lineHeight: 1,
        size: {
          max: 12,
          min: 11,
          viewport: 0.3,
          multiplier: 0.44,

        },
        weigth: 400,
      },
      p4: {
        lineHeight: 1,
        size: {
          max: 11,
          min: 10,
          viewport: 0.3,
          multiplier: 0.44,

        },
        weigth: 400,
      },
    },
  },
})

const variantProvider = new VariantProvider(appTheme, (style:CSSObject) => style) // Or StyleSheet.create for react-native


const defaultStyles = variantProvider.getDefaultVariants()

const createButtonVariant = variantProvider.createVariantFactory<'text' | 'wrapper' | 'innerWrapper'>()

const AppButtonStyles = {
  ...defaultStyles.Button,
  outline: createButtonVariant({
    wrapper: {
      color: 'green',
    },

  }),
  fill: createButtonVariant({
    text: {},
    innerWrapper: {},
  }),
  primary: createButtonVariant({
    text: {},
    innerWrapper: {},
  }),
}


// This stays in the lib
export const ButtonCP:React.FC<ComponentVariants<typeof ButtonStyles> & {name:string}> = ({ responsiveVariants, variants, children }) => {
  const styles = useComponentStyle('Button', { rootElement: 'wrapper', responsiveVariants, variants })

  return (
    <button style={styles.wrapper}>
      {children}
    </button>
  )
}

export const Styles = {
  ...defaultStyles,
  Button: AppButtonStyles,
} as const


const { Button } = variantProvider.typeComponents({
  Button: [ButtonCP, Styles.Button],
})


export const AppRoot:React.FC = () => {
  return (
    <StyleProvider variantProvider={variantProvider} variants={Styles}>
      <Button name='aaa' variants={'primary'} >abc</Button>
    </StyleProvider>
  )
}
