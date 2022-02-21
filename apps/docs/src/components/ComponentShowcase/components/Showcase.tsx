/** @jsx jsx */
import { jsx } from '@emotion/react'
import React, { Fragment, ReactElement, useMemo, useState } from 'react'
import {
  AnyFunction,
  CommonVariantObject,
  ComponentVariants,
  FunctionType,
  onUpdate,
  useComponentStyle,
} from '@codeleap/common'
import {
  View,
  Button,
  variantProvider,
  Theme,
  Text,
  ContentView,
} from '@/app/index'
import { beautifyName, filterVariant } from '../utils/variant'

import { PropController } from './PropController'
import { stateFromControls } from '../utils/controls'

type WithCSSObject<C extends string = string> = CommonVariantObject<C, any>;

export type ShowcaseProps<T extends WithCSSObject> = {
  styleSheet: T;
  render: FunctionType<
    [
      ComponentVariants<T, typeof variantProvider.theme, (keyof T)[]> & {
        controlValues: any;
      }
    ],
    ReactElement
  >;
  name: string;
  filter?: boolean;
  controls?: any;
};

type VariantSelectorProps = {
  data: Record<string, boolean>;
  toggle: (variant: string) => void;
  reset: AnyFunction;
};

const VariantSelector: React.FC<VariantSelectorProps> = ({
  data,
  toggle,
  reset,
}) => {
  const hasVariants = Object.keys(data).length > 0
  const styles = useComponentStyle(componentStyles)
  return (
    <Fragment>
      <ContentView
        variants={['scrollY', 'row', 'wrap', 'alignStart', 'padding:1']}
        placeholderMsg='No variants'
        styles={{ wrapper: styles.variantSelector }}
      >
        {hasVariants
          ? Object.entries(data).map(([variant, selected]) => (
            <Button
              text={beautifyName(variant)}
              onPress={() => toggle(variant)}
              variants={[selected ? 'default' : 'outline', 'small']}
              key={variant}
            />
          ))
          : null}
      </ContentView>
      {hasVariants && <Button text='Clear selections' onPress={reset} />}
    </Fragment>
  )
}

export const Showcase = <
  T extends WithCSSObject,
  CP extends ShowcaseProps<T> = ShowcaseProps<T>
>(
    showcaseProps: CP,
  ) => {
  const {
    styleSheet,
    render: Component,
    name,
    filter = true,
    controls,
  } = showcaseProps

  function initialVariants() {
    const newVariants = {}

    Object.keys(styleSheet).forEach((variant) => {
      if (!filter || filterVariant(variant)) {
        newVariants[variant] = false
      }
    })

    return newVariants
  }

  const [selectedVariants, setSelectedVariants] = useState(initialVariants)

  const resetVariants = () => setSelectedVariants(initialVariants)

  onUpdate(() => {
    resetVariants()
  }, [styleSheet])

  function toggleVariant(v: string) {
    setSelectedVariants((previous) => {
      const newSelected = { ...previous }
      newSelected[v] = !previous[v]

      return newSelected
    })
  }

  const variantList = useMemo(
    () => Object.keys(selectedVariants).filter((k) => selectedVariants[k]),
    [selectedVariants],
  )

  const [values, setValues] = useState(() => controls ? stateFromControls(controls) : {},
  )

  function onChange(property, value) {
    setValues((v) => ({
      ...v,
      [property]: value,
    }))
  }

  onUpdate(() => {
    setValues(() => (controls ? stateFromControls(controls) : {}))
  }, [controls])

  const styles = useComponentStyle(componentStyles)

  return (
    <View variants={['full', 'scrollY']}>
      <View css={styles.preview} variants={['padding:2', 'flex', 'scrollY']}>
        <Text text={name} variants={['h3', 'marginBottom:3']} />
        <Component variants={variantList} controlValues={values} />
      </View>
      <View css={styles.sidebar} variants={['column', 'padding:2']}>
        <Text text={`Variants`} />
        <VariantSelector
          toggle={toggleVariant}
          data={selectedVariants}
          reset={resetVariants}
        />
        {controls && (
          <PropController
            values={values}
            onChange={onChange}
            controls={controls}
          />
        )}
      </View>
    </View>
  )
}

const componentStyles = variantProvider.createComponentStyle((theme) => ({
  preview: {
    display: 'block',
    maxHeight: `100vh`,
    maxWidth: `75%`,
    minWidth: '75%',
  },
  variantSelector: {
    gap: Theme.spacing.base,
    maxHeight: '45vh',

    alignContent: 'flex-start',
    flexShrink: 0,
  },

  sidebar: {
    maxWidth: '25%',
    minWidth: '25%',
    overflowY: 'auto',
    background: theme.colors.background,
    color: theme.colors.white,
  },
}))
