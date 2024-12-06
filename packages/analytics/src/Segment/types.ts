export type AnyRecord = {
  [x:string]: any
}

export type SegmentConfig<C, U extends SegmentUser, M extends string = DefaultMode> = {
  apiKey: string
  enabled?: boolean
  getUserTraits: (user: U) => AnyRecord
  mode: M
  prefix?: Record<M, string | null>
  createClient: (writeKey: string) => C
}

export type SegmentMethods = {
  track: (eventName: string, properties?: AnyRecord) => Promise<void>
  screen: (name: string, options?: AnyRecord) => Promise<void>
  group: (groupId: string, groupTraits?: AnyRecord) => Promise<void>
  alias: (newUserId: string) => Promise<void>
  reset: () => Promise<void>
  identify: (userId: string, userTraits?: AnyRecord) => Promise<void>
}

export type SegmentUser = {
  id: string
}

export type DefaultMode = 'dev' | 'prod'

export type SegmentGeneralConfig<C, U extends SegmentUser, M extends string> = Omit<
  SegmentConfig<C, U, M>,
  'apiKey' | 'createClient' | 'enabled'
>
