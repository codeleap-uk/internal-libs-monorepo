export const textStyles = {
  h1: {
    sizeMultiplier: 2.4,
    weight: 700,
  },
  h2: {
    sizeMultiplier: 2,
    weight: 700,
  },
  h3: {
    sizeMultiplier: 1.4,
    weight: 700,
  },
  h4: {
    sizeMultiplier: 1,
    weight: 700,
  },
  h5: {
    sizeMultiplier: 0.8,
    weight: 700,
  },
  p1: {
    // lineHeightMultiplier: 1,
    sizeMultiplier: 1,
    weight: 400,
  },
  p2: {
    sizeMultiplier: 0.8,
    weight: 400,
  },
  p3: {
    sizeMultiplier: 0.65,
    weight: 400,
  },
  p4: {
    sizeMultiplier: 0.44,
    weight: 400,
  },
}

export const themeObj = {
  colors: {
    light: {
      primary: '#7695EC',
      icon: '#fff',
      border: '#7695EC',
      disabled: '#a4aabc',
      text: '#000000',
      background: '#fff',
      backgroundSecondary: '#fff',
      gray: '#333',
      lightGray: '#ccc',
      veryLightGray: '#f7f7f7',
      negative: '#a11',
      positive: '#ada',
      secondary: '#000',
      black: '#000',
      borders: '#ccc',
      placeholder: '#ccc',
      neutral: '#ccc',
      white: '#fff',
      green: 'green',
      textH: '#333',
      textP: '#555',
    },
    dark: {
      primary: '#7695EC',
      icon: '#fff',
      border: '#7695EC',
      disabled: '#a4aabc',
      text: '#fff',
      background: '#222',
      backgroundSecondary: '#303030',
      gray: '#333',
      neutral: '#777777bb',
      lightGray: '#ccc',
      black: '#000',
      veryLightGray: '#f7f7f7',
      negative: '#a11',
      positive: '#ada',
      secondary: '#000',
      borders: '#ccc',
      placeholder: '#ccc',
      white: '#fff',
      green: 'green',
      textH: '#fff',
      textP: '#fff',
    },

  },
  initialTheme: 'light',
  breakpoints: {
    'xs': 600,
    'xxs': 34,
  },
  spacing: 10,
  borderRadius: {
    large: 15,
    medium: 10,
    small: 5,
  },
  typography: {
    baseFontSize: 18,
    hColor: '#333',
    pColor: '#555',
    fontFamily: 'Helvetica',
    styles: textStyles,
  },
  icons: {},

} as const
