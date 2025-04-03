import { createContext, useContext, useState } from 'react'
import { TabsContextProps, TabsStyles } from './types'

function useTabHandle(props: TabsContextProps & { styles: TabsStyles }) {
  const {
    defaultValue,
    value,
    onValueChange,
    keepMounted,
    styles
  } = props

  const [tabValue, setTabValue] = !onValueChange && !value
    ? useState<string>(defaultValue)
    : [value ?? defaultValue, onValueChange]

  return {
    value: tabValue,
    setValue: setTabValue,
    styles,
    keepMounted,
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