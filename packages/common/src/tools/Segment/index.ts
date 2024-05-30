type AnyRecord = {
  [x:string]: any
}

type SegmentConfig<C, U extends SegmentUser, M extends string = DefaultMode> = {
  apiKey: string
  enabled?: boolean
  getUserTraits: (user: U) => AnyRecord
  mode: M
  prefix?: Record<M, string | null>
  createClient: (writeKey: string) => C
}

type SegmentMethods = {
  track: (eventName: string, properties?: AnyRecord) => Promise<void>
  screen: (name: string, options?: AnyRecord) => Promise<void>
  group: (groupId: string, groupTraits?: AnyRecord) => Promise<void>
  alias: (newUserId: string) => Promise<void>
  reset: () => Promise<void>
  identify: (userId: string, userTraits?: AnyRecord) => Promise<void>
}

type SegmentUser = {
  id: string
}

type DefaultMode = 'dev' | 'prod'

type SegmentGeneralConfig<C, U extends SegmentUser, M extends string> = Omit<
  SegmentConfig<C, U, M>,
  'apiKey' | 'createClient' | 'enabled'
>

const defaultConfig: SegmentGeneralConfig<any, SegmentUser, DefaultMode> = {
  getUserTraits: (user) => user,
  mode: 'prod',
  prefix: {
    'dev': 'dev',
    'prod': null,
  }
}

export class Segment<C extends SegmentMethods, U extends SegmentUser = SegmentUser, M extends string = DefaultMode> {
  private config: SegmentGeneralConfig<C, U, M> = defaultConfig as unknown as SegmentGeneralConfig<C, U, M>

  private _enabled = true

  private apiKey: string | null = null

  public client: C | null = null

  public identifiedUser = false

  public get enabled() {
    return this.client !== null && this._enabled
  }

  private get eventPrefix() {
    const modePrefix = this.config.prefix?.[this.config.mode] ?? null
    return !modePrefix ? '' : `${modePrefix}_`
  }

  constructor(config: SegmentConfig<C, U, M>) {
    const {
      apiKey,
      enabled = true,
      createClient,
      ...generalConfig
    } = config

    this.config = {
      ...this.config,
      ...generalConfig,
    }

    this.apiKey = apiKey
    this._enabled = enabled

    if (enabled) {
      this.client = createClient(this.apiKey)
    }
  }

  public async track<T extends AnyRecord>(eventName: string, properties: T | undefined = undefined) {
    if (!this.enabled) return

    await this.client?.track?.(`${this.eventPrefix}${eventName}`, properties)
  }

  public async screen(name: string, options: AnyRecord | undefined = undefined) {
    if (!this.enabled) return

    await this.client?.screen?.(`${this.eventPrefix}${name}`, options)
  }

  public async group(groupId: string, groupTraits: AnyRecord | undefined = undefined) {
    if (!this.enabled) return

    await this.client?.group(`${this.eventPrefix}${groupId}`, groupTraits)
  }

  public async alias(newUserId: string) {
    if (!this.enabled) return

    await this.client?.alias(newUserId)
  }

  public async reset() {
    if (!this.enabled) return

    await this.client?.reset()
  }

  public async identifyUser(user: U) {
    if (!this.enabled || this.identifiedUser) return

    const userTraits = this.config.getUserTraits(user)

    await this.client?.identify?.(user?.id, userTraits)

    this.identifiedUser = true
  }

  public setMode(newMode: M) {
    this.config = {
      ...this.config,
      mode: newMode,
    }
  }
}
