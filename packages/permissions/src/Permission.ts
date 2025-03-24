import { GlobalState, globalState } from '@codeleap/store'
import { PermissionOptions } from './types'
import { PermissionConfig, PermissionStatus } from './globals'
import { TypeGuards } from '@codeleap/types'
import { logger } from '@codeleap/logger'

export class Permission {
  /** The name of the permission. */
  public name: string

  private state: GlobalState<PermissionStatus>

  private checkStatus: () => Promise<PermissionStatus>

  private requestStatus: () => Promise<PermissionStatus>

  static logsEnabled: boolean = false

  static is(status: PermissionStatus) {
    return {
      value: status,
      isGranted: status === 'granted',
      isLimited: status === 'limited',
      isDenied: status === 'denied',
      isBlocked: status === 'blocked',
    }
  }

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
    return Permission.is(this.value).isGranted
  }

  get isLimited() {
    return Permission.is(this.value).isLimited
  }

  get isDenied() {
    return Permission.is(this.value).isDenied
  }

  get isBlocked() {
    return Permission.is(this.value).isBlocked
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
    logger.log(`(Permission) ${this.name} -> ${msg}`, obj)
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
    let status = await this.checkStatus()

    if (status === 'denied' && this.value === 'blocked') {
      status = this.value
    }

    const update = status != this.value

    if (update && TypeGuards.isString(status)) {
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

    if (update && TypeGuards.isString(status)) {
      this.set(status as PermissionStatus)
    }

    this.log('request', { status, update })

    return status
  }
}