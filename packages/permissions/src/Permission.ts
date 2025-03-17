import { GlobalState, globalState } from '@codeleap/store'
import { PermissionOptions } from './types'
import { PermissionConfig, PermissionStatus } from './globals'

export class Permission {
  /** The name of the permission. */
  public name: string

  private state: GlobalState<PermissionStatus>

  private checkStatus: () => Promise<PermissionStatus>

  private requestStatus: () => Promise<PermissionStatus>

  static logsEnabled: boolean = false

  /** Configuration object associated with the permission. */
  public config: PermissionConfig

  /**
   * Gets the current permission status.
   * @returns The current permission status.
   */
  get value() {
    return this.state.get()
  }

  get isGranted() {
    return ['granted', 'limited'].includes(this.value)
  }

  get isLimited() {
    return this.value === 'limited'
  }

  get isDenied() {
    return this.value === 'denied'
  }

  get isBlocked() {
    return this.value === 'blocked'
  }

  constructor(options: PermissionOptions<PermissionConfig>) {
    const { name, config, check, request } = options

    this.state = globalState(null as PermissionStatus, { persistKey: 'permissions-' + name })

    this.name = name
    this.config = config
    this.checkStatus = check
    this.requestStatus = request
  }

  private log(msg: string, obj?: any) {
    if (!Permission.logsEnabled) return
    console.log(`[Permissions] ${this.name} -> ${msg}`, obj)
  }

  /**
   * Updates the permission status.
   * @param newStatus - The new permission status.
   */
  set(newStatus: PermissionStatus) {
    this.state.set(newStatus)
  }

  /**
   * React hook for consuming the permission state.
   * @returns The current permission status state.
   */
  use() {
    return this.state.use()
  }

  /**
   * Checks the current permission status and updates the state if it has changed.
   * @returns The checked permission status.
   */
  async check() {
    const status = await this.checkStatus()
    const update = status != this.value

    if (update && status !== null) {
      this.set(status as PermissionStatus)
    }

    this.log('check', { status, update })

    return status
  }

  /**
   * Requests the permission and updates the state if it has changed.
   * @returns The requested permission status.
   */
  async request() {
    const status = await this.requestStatus()
    const update = status != this.value

    if (update && status !== null) {
      this.set(status as PermissionStatus)
    }

    this.log('request', { status, update })

    return status
  }
}