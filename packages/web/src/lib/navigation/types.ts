
export type ExtractParams<T extends string> =
  T extends `${infer _Start}{{${infer Param}}}${infer Rest}` 
    ? Param | ExtractParams<Rest> 
    : never

type Params<T> = {
  [K in keyof T]: T[K] extends string ? ExtractParams<T[K]> : Params<T[K]>;
}

// @ts-ignore
type ExtractRoutes<T, PM, Prefix extends string = ''> = {
  [K in keyof T & string]: 
    T[K] extends string 
      ? {
        // @ts-ignore
        [P in `${Prefix}${Prefix extends '' ? '' : '.'}${K}`]: PM[K]
      } // @ts-ignore
      : ExtractRoutes<T[K], PM[K], `${Prefix}${Prefix extends '' ? '' : '.'}${K}`>
}[keyof T]

type UnionToIntersection<U> = 
  (U extends any ? (x: U)=> void : never) extends ((x: infer I)=>void) ? I : never

export type Routes<T> = UnionToIntersection<ExtractRoutes<T, Params<T>>>

// ######

export type RoutePath = string

export type RouteParams = {
  [x: string]: string
}

export type Navigator<O extends object = {}> = (path: RoutePath, options: O) => void

export type AnyValue = {
  [key: string]: any
}

export type HistoryData = {
  origin: string
  date: Date,
  path: RoutePath,
  metadata: any
  info: any
}

export type History = Record<number, HistoryData>

export type Config = {
  historyEnabled?: boolean
  getMetadata?: () => any
}
