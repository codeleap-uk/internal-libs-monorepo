import { AnyValue, Config, History, Navigator, RouteParams, RoutePath, Routes } from './types'

const IS_SSR = typeof window === 'undefined' || typeof history === 'undefined'

const defaultConfig: Partial<Config> = {
  historyEnabled: false,
  getMetadata: () => {}
}

export type {
  Navigator,
  Routes,
}

export class Navigation<O extends object, R extends object = {}> {
  private _history: History = {}

  private config: Config = defaultConfig

  get history() {
    return this._history
  }

  private putHistory(path: RoutePath, info: any = {}) {
    const idx = Object.keys(this._history).length + 1

    const origin = typeof window === 'undefined' ? null : window?.location?.origin

    const value: History = {
      [idx]: {
        origin,
        date: new Date(),
        path,
        metadata: this.config?.getMetadata?.(),
        info,
      }
    }

    this._history = this.merge(this._history, value)
  }

  private merge(obj: object, addObj: AnyValue) {
    return {
      ...obj,
      ...addObj
    }
  }

  private navigator: Navigator<O> = null

  private routes: R = {} as R

  constructor(
    routes: R,
    navigator: Navigator<O>,
    config: Config = {},
  ) {
    this.navigator = navigator
    this.routes = routes
    this.config = this.merge(this.config, config)
  }

  public isOnRoute<T extends keyof Routes<R>>(
    route: T, 
    // @ts-expect-error
    routeParams: Record<Routes<R>[T], string|number> = {} as any
  ) {
    if (!IS_SSR) return false
  
    const path = window?.location?.pathname
    // @ts-ignore
    const routePath = this.getPathWithParams(route, routeParams)
  
    if (path?.includes(routePath)) {
      return true
    }
  
    return false
  }

  public getPath(route: keyof Routes<R>): string {
    let path = this.routes

    // @ts-ignore
    if (route?.includes('.')) {
      // @ts-ignore
      const indexesAccess = route?.split('.')

      for (const index of indexesAccess) {
        path = path?.[index]
      }
    } else {
      // @ts-ignore
      path = path?.[route]
    }

    return String(path)
  }

  public getPathWithParams<T extends keyof Routes<R>>(
    route: T, 
    // @ts-expect-error
    routeParams: Record<Routes<R>[T], string|number> = {} as any
  ) {
    let path = this.getPath(route)

    for (const key in routeParams) {
      const value = String(routeParams?.[key])

      const searchPartial = `{{${key}}}`

      if (path?.includes(searchPartial)) {
        path = path?.replace(searchPartial, encodeURIComponent(value))
      }
    }

    if (!path?.startsWith('/')) {
      path = '/' + path
    }

    if (!path?.endsWith('/')) {
      path = path + '/'
    }

    return path?.trim()
  }

  public goBack() {
    if (IS_SSR) return

    if (!this.config.historyEnabled) {
      history?.back?.()
      return
    }

    const lastIdx = Object.keys(this.history)?.length

    const historyData = this.history[lastIdx - 1]

    if (!historyData) {
      throw new Error('Not find back route')
    }

    const info = this.merge(historyData?.info, {
      'action': 'goBack'
    })

    this.to(historyData?.path, historyData?.info?.options ?? {}, info)
  }

  public navigate<T extends keyof Routes<R>>(
    route: T, 
    // @ts-expect-error
    options: Record<Routes<R>[T], string|number> & O & { params?: RouteParams } = {} as any
  ) {
    // @ts-ignore
    let path = this.getPath(route)

    let _options = {}
    let params = null
    let routeParams = {}

    const queryParamsKey = 'params'

    for (const key in options) {
      const value = options?.[key]

      const searchPartial = `{{${key}}}`

      if (path?.includes(searchPartial)) {
        path = path?.replace(searchPartial, encodeURIComponent(String(value)))

        routeParams = {
          ...routeParams,
          [key]: String(value),
        }
      } else if (key == queryParamsKey) {
        params = value
      } else {
        _options = {
          ..._options,
          [key]: value,
        }
      }
    }

    if (!path?.startsWith('/')) {
      path = '/' + path
    }

    if (typeof params === 'object') {
      let searchParams = null
  
      for (const paramKey in (params ?? {})) {
        const value = params?.[paramKey]
        const param = `${paramKey}=${encodeURIComponent(value)}`
        const separator = searchParams == null ? '' : '&'
  
        searchParams = `${searchParams ?? ''}${separator}${param}`
      }
  
      if (typeof searchParams === 'string') {
        if (path?.endsWith('/')) {
          path = path.slice(0, -1)
        }

        path = `${path}?${searchParams}`
      }
    }

    if (!path?.endsWith('/') && !params) {
      path = path + '/'
    }

    path = path?.trim()

    this.to(path, _options as O, {
      params,
      routeParams,
    })
  }

  public to(path: RoutePath, options: O = null as O, info = {}) {
    if (this.config.historyEnabled) {
      this.putHistory(path, this.merge(options, info))
    }

    // this.navigator(path, options)
  }

  public wipeHistory() {
    this._history = {}
  }
}
