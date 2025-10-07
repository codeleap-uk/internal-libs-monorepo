import { globalState } from '@codeleap/store'
import { Keyof, StringRecord, TypeGuards } from '@codeleap/types'
import { capitalize, deepEqual } from '@codeleap/utils'
import { useState, useMemo } from 'react'
import { EnvironmentStore, EnvironmentManagerConfig, Editor } from './types'
import { EDITORS } from './const'

export class EnvironmentManager<T extends StringRecord> {
  private store: ReturnType<typeof globalState<EnvironmentStore<T>>>

  private initialStoreValue: EnvironmentStore<T>

  readonly editors = EDITORS

  get environments() {
    return this.config.environments
  }

  get defaultConfig() {
    return {
      environment: this.config.defaultEnvironment,
      customUrl: '',
      enabledBy: null,
    } as EnvironmentStore<T>
  }

  constructor(private config: EnvironmentManagerConfig<T>) {
    this.store = globalState<EnvironmentStore<T>>(
      this.defaultConfig,
      { persistKey: config?.persistKey ?? 'environment-manager' }
    )

    this.initialStoreValue = this.store.get()
  }

  testUrl(url: string) {
    const urlValidator: RegExp = /^https?:\/\/([a-zA-Z0-9.-]+|localhost|(\d{1,3}\.){3}\d{1,3})(?::\d+)?\/$/
    return urlValidator.test(url)
  }

  get env(): EnvironmentStore<T> {
    const value = this.store.get() ?? this.defaultConfig

    if (value.enabledBy) {
      if (value.environment === this.config.customEnvironment && !this.testUrl(value.customUrl)) {
        value.environment = this.defaultConfig.environment
      }

      return value
    }

    return this.defaultConfig
  }

  setEnabled(by: Editor | false = false) {
    const disable = by === false || TypeGuards.isNil(by)
    this.store.set({ enabledBy: disable ? null : by })
    return !disable
  }

  get isEnabled(): boolean {
    return !TypeGuards.isNil(this.isEnabledBy)
  }

  get isEnabledBy(): Editor {
    return this.store.get(s => s?.enabledBy)
  }

  get isEnabledBySystem(): boolean {
    return this.isEnabledBy === EDITORS.SYSTEM
  }

  get isEnabledByUser(): boolean {
    return this.isEnabledBy === EDITORS.USER
  }

  get is(): Record<Capitalize<Keyof<T> extends string ? Keyof<T> : string>, boolean> {
    const environment = this.store.get(s => s?.environment ?? this.defaultConfig.environment)

    return Object.entries(this.environments).reduce((acc, [key, value]) => {
      acc[capitalize(key) as Keyof<T>] = environment === key
      return acc
    }, {} as Record<Keyof<T>, boolean>)
  }

  get serverUrl() {
    const env = this.env

    if (env.environment === this.config.customEnvironment) {
      if (!this.testUrl(env.customUrl)) {
        return this.environments[this.defaultConfig.environment]
      }

      return env.customUrl
    }

    return this.environments[env.environment] ?? this.environments[this.defaultConfig.environment]
  }

  setEnvironment(environment: Keyof<T>) {
    if (!this.isEnabled) return
    this.store.set({ environment })
  }

  isEnvironment(env: Keyof<T>): boolean {
    const current = this.env
    return current.environment === env
  }

  setCustomUrl(url: string) {
    if (!url.endsWith('/')) {
      url += '/'
    }

    if (!this.testUrl(url)) return

    this.store.set({ customUrl: url })
  }

  use() {
    const value = this.store.use()

    const { enabledBy, ...config } = value ?? this.defaultConfig

    const [customUrl, setCustomUrl] = useState(config?.customUrl)

    const changed = useMemo(() => !deepEqual(value, this.initialStoreValue), [value])

    return {
      enabled: !!enabledBy,
      enabledByUser: enabledBy === EDITORS.USER,
      enabledBySystem: enabledBy === EDITORS.SYSTEM,
      config,
      changed,
      customUrl,
      setCustomUrl,
    }
  }
}
