import { SegmentGeneralConfig, SegmentUser, DefaultMode, SegmentMethods, SegmentConfig, AnyRecord } from './types'

export * from './types'

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
