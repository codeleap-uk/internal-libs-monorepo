#### Usage in applications

> This example puts everything in the same file, but you can divide the variables as you will

---

```jsx
import {
    createTheme,
    VariantProvider,
    ButtonComposition // This type defines the parts that compose button
} from 'codeleap-common'
import { StyleSheet } from 'react-native'

const theme = createTheme({
    // your app theme here
})

const variantProvider = new VariantProvider(
    theme,
    StyleSheet.create
)

const defaultButtonStyles = variantProvider.getDefaultVariants('Button') // pass no arguments to get all styles for all components

const createButtonStyle = variantProvider.createVariantFactory<ButtonComposition | 'somePartOfTheButton'>()
// somePartOfTheButton extends the ButtonComposition

const ButtonStyles = {
    ...defaultButtonStyles,
    myVariant: createButtonStyle({
        somePartOfTheButton : {
            // your css here
        },
        inner: {
            // more css
        }
    })
}

const ButtonComponent:ComponentWithVariants<typeof ButtonStyles,typeof theme> = ({variants, responsiveVariants}) => {

    const styles = variantProvider.getStyles(ButtonStyles, variants, responsiveVariants)

    return (
        <button style={styles.wrapper}>
            <div style={styles.somePartOfTheComponent}>  </div>
            <span style={styles.inner}>
                {children}
            </span>
        </button>
    )
}
```

#### Usage when creating default variants (On this repository or web/mobile libraries)

---

```jsx
import { createDefaultVariantFactory } from 'codeleap-common'

export type ButtonComposition = 'text' | 'inner';

const createButtonStyle = createDefaultVariantFactory<ButtonComposition>()

export const ButtonStyles = {
  outline: createButtonStyle(() => ({
    inner: {
      color: 'red',
    },
  })),
  someVariant: createButtonStyle(() => ({
    text: {
      backgroundColor: 'green',
    },
  })),
}
```

Simply export the ButtonStyles and ButtonComposition variables for later use when defining app specific styles.
