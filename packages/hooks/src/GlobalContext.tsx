import React, { createContext, ReactNode, useContext } from 'react'
import { Logger, silentLogger } from '@codeleap/logger'
import { AppSettings } from '@codeleap/types'

type ContextProps = {
  logger: Logger
  Settings: AppSettings
  isBrowser: boolean
}

const GlobalContext = createContext<ContextProps>({} as ContextProps)

type ProviderProps = {
  logger: Logger
  settings: AppSettings
  isBrowser: boolean
  children: ReactNode
}

export const GlobalContextProvider = (props: ProviderProps) => {
  const {
    logger,
    settings,
    isBrowser,
    children
  } = props

  const value: ContextProps = {
    logger: logger || silentLogger,
    Settings: settings,
    isBrowser,
  }

  return (
    <GlobalContext.Provider
      value={value}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export const useGlobalContext = () => {
  const context = useContext(GlobalContext)

  if (!context) {
    throw new Error('GlobalContext not found')
  }

  return context
}
