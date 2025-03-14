import { GlobalState, globalState } from '@codeleap/store'
import { AnyRecord } from '@codeleap/types'
import { PermissionOptions } from './types'
import { PermissionStatus } from './globals'

export class Permission<
  Config extends AnyRecord
> {
  name: string

  private state: GlobalState<PermissionStatus>

  private checkStatus: () => Promise<PermissionStatus>

  private requestStatus: () => Promise<PermissionStatus>

  config: Config

  get value() {
    return this.state.get()
  }

  get isGranted() {
    return ['granted', 'limited'].includes(this.value)
  }

  get isDenied() {
    return this.value === 'denied'
  }

  get isBlocked() {
    return this.value === 'blocked'
  }

  constructor(options: PermissionOptions<Config>) {
    const { name, config, check, request } = options

    this.state = globalState(null as PermissionStatus, { persistKey: 'permissions-' + name })

    this.name = name
    this.config = config
    this.checkStatus = check
    this.requestStatus = request
  }

  use() {
    return this.state.use()
  }

  async check() {
    const status = await this.checkStatus()
    const update = status != this.value

    if (update) {
      this.state.set(status as PermissionStatus)
    }

    return status
  }

  async request() {
    const status = await this.requestStatus()
    const update = status != this.value

    if (update) {
      this.state.set(status as PermissionStatus)
    }

    return status
  }
}