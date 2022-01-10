# Codeleap libs

This repository includes:

- Web and mobile templates (as submodules), located on the /apps directory
- Common, Config, and Web packages on the /packages directory

## What does each package do?

- Common : Includes utilities for theming, variant creation, data fetching, redux logic, and logging
- Web : Web react components/specific utilities
- Config : Common ESLint and vscode configs

## How do I work on it?

After cloning the repo:

```bash
git submodule update --init --recursive # pull the submodules for templates
yarn # install dependencies
yarn dev # runs gatsby
```
### If you're making components

Add them to packages/web/src/components. The structure of components is as follows:

```jsx
/** @jsx jsx */
import { jsx } from '@emotion/react' // This lets you pass the css prop for styling

import { 
    useComponentStyle, 
    ButtonStyles, 
    ComponentVariants, 
    ButtonComposition, 
    IconPlaceholder,
    useStyle
} from '@codeleap/common'; // Import styling hooks and component typings for variants

import React, { ComponentPropsWithRef } from 'react' // More typings

import { StylesOf } from '../types/utility'; // Even more typings

// You can compose components out of other components
import { Text } from './Text'; 
import { Touchable } from './Touchable';
import { Icon } from './Icon';
import { ActivityIndicator } from './ActivityIndicator';

// These are the props of the native html button
type NativeButtonProps = ComponentPropsWithRef<'button'> 


export type ButtonProps = 
    NativeButtonProps &  // ButtonProps extends the native button props
    ComponentVariants<typeof ButtonStyles>  & // Grabs 'variants' and 'responsiveVariants' prop typings for the button
    {  
        styles?: StylesOf<ButtonComposition> // Style override prop for each part of the button

        text?:string
        rightIcon?: IconPlaceholder // Just regular props
        icon?: IconPlaceholder
        onPress:NativeButtonProps['onClick']
        loading?: boolean    
    } 


export const Button:React.FC<ButtonProps> = (buttonProps) => {
  const { 
    variants = [],
    responsiveVariants = {},
    children,
    icon,
    text,
    loading,
    styles,
    onPress,
    rightIcon,
    ...props 
  } = buttonProps
  
  // This aggregates the variants and style overrides passed to the component
  const variantStyles = useComponentStyle('Button', {
    responsiveVariants,
    variants,
    styles,
  })  


  function handlePress(e:Parameters<ButtonProps['onPress']>[0]){
    props.onClick && props.onClick(e)
    onPress && onPress(e)
  }

 
  return (
    <Touchable
      css={variantStyles.wrapper} // variantStyles separates styles for each part of the component
      component='button'
      onClick={handlePress}
      {...props}
    >
      {loading && <ActivityIndicator css={variantStyles.loader} />}
      {!loading && <Icon name={icon} style={{...variantStyles.icon, ...variantStyles.leftIcon}}/>}
      {children || <Text text={text} styles={{
        text: variantStyles.text,
      }}/>}
      <Icon name={rightIcon} style={{...variantStyles.icon, ...variantStyles.rightIcon}}/>
    </Touchable>
  )
}
```

Export the Button in `components/index.ts`

```jsx
export * from './Button'
```
  
In the web template, make sure the Component is re exported with correct typings and variants in `app/components.tsx`, like so:

```jsx
import * as Components from '@codeleap/web';

import { Image as AppImage } from '@/lib/components/Image'

export const variants = {
  ...defaultStyles,
}

export const components = variantProvider.typeComponents({
  Button: [Components.Button, defaultStyles.Button],
})


export const { 
  Button
} = components

```

If you wish to override the default style:


```jsx
// app/stylesheets/Button.ts
import { ButtonComposition } from '@codeleap/common'
import { Theme, variantProvider } from '../theme'

const defaultStyle = variantProvider.getDefaultVariants('Button')

const createButtonVariant = variantProvider.createVariantFactory<ButtonComposition>()

export const AppButtonStyle = {
  ...defaultStyle,
  default: createButtonVariant({
    ...defaultStyle.default,
    'wrapper': {
      ...defaultStyle.default.wrapper,
      ...defaultStyle.pill.wrapper,
      
      ':active': {
        transform: 'scale(0.9)',
      },
    }, 
    icon: {
      ...Theme.spacing.marginLeft(1),
    },
  }),
  primary: createButtonVariant({
    wrapper: {
      backgroundColor: Theme.colors.primary,
    },
    text: {
      color: Theme.colors.white,
    },
    icon: {
      color: Theme.colors.white,
      width: 24,
      height: 24,
    },
  }),
}

// app/components.tsx
import * as Components from '@codeleap/web';
import { AppButtonStyle } from './stylesheets/Button'
import { Image as AppImage } from '@/lib/components/Image'

export const variants = {
  ...defaultStyles,
  Button: AppButtonStyle // set it here
}

export const components = variantProvider.typeComponents({
  Button: [Components.Button, AppButtonStyle], // and here
})


export const { 
  Button
} = components

```

## To push your code


```
cd apps/codeleap-web-template
git add 
git commit -m "something"
git push origin some-branch
```

This will push the submodule to update it's remote repository

The parent folder follows standard commit procedures, just remember to commit the submodules first