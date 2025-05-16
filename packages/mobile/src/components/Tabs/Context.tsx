import { createContext, useContext, useRef, useState } from 'react'
import { TabsContextProps, TabsStyles } from './types'
import { FlatList } from 'react-native'
import { TypeGuards } from '@codeleap/types'

function useTabHandle(props: TabsContextProps & { styles: TabsStyles }) {
  const {
    defaultValue,
    value,
    onValueChange,
    keepMounted,
    styles
  } = props

  const [tabValue, setInternalTabValue] = !onValueChange && !value
    ? useState<string>(defaultValue)
    : [value ?? defaultValue, onValueChange]

  const flatListRef = useRef<FlatList>(null)

  const setTabValue = (newValue: string, index?: number) => {
    if (TypeGuards.isNumber(index) && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
      })
    }

    setInternalTabValue(newValue)
  }

  return {
    value: tabValue,
    setValue: setTabValue,
    styles,
    keepMounted,
    flatListRef,
  }
}

const Context = createContext({} as ReturnType<typeof useTabHandle>)

export function TabsProvider({ children, ...handleProps }: TabsContextProps & { styles: TabsStyles }) {
  const handle = useTabHandle(handleProps)
  return <Context.Provider value={handle}>{children}</Context.Provider>
}

export function useTabContext() {
  const ctx = useContext(Context)

  if (ctx === null) {
    throw new Error('Tabs component was not found in the tree')
  }

  return ctx
}