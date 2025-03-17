import { Permission } from './Permission'
import { PermissionOptions } from './types'
import { PermissionStatus, PermissionConfig } from './globals'

export class PermissionsManager<P extends string> {
  private requester: (permission: Permission) => Promise<PermissionStatus>

  permissions: Record<P, Permission> = {} as Record<P, Permission>

  private get keys() {
    return Object.keys(this.permissions) as P[]
  }

  /**
   * Retrieves the current status values of all permissions.
   * @returns An object mapping permission names to their statuses.
   */
  get values() {
    const values = {}

    this.forEach(permission => {
      values[permission.name] = permission.value
    })

    return values
  }

  private async forEach(callbackFn: (permission: Permission) => void) {
    for (const permissionName in this.permissions) {
      const permission = this.permissions[permissionName]
      callbackFn(permission)
    }
  }

  constructor(
    requester: (permission: Permission) => Promise<PermissionStatus>,
    permissions: Record<P, Omit<PermissionOptions<PermissionConfig>, 'name'>>
  ) {
    for (const permission in permissions) {
      const permissionConfig = permissions[permission]

      const permissionClass = new Permission({
        ...permissionConfig,
        name: permission,
      })

      this.permissions[permission as unknown as P] = permissionClass
    }

    this.requester = requester

    this.checkAll()
  }

  private log(msg: string, obj?: any) {
    if (!Permission.logsEnabled) return
    console.log(`[Permissions] -> ${msg}`, obj)
  }

  /**
   * Requests a specific permission.
   * @param {P} permissionName - The name of the permission to request.
   * @returns The updated permission status.
   */
  async request(permissionName: P) {
    const permission = this.permissions[permissionName]
    const status = await this.requester(permission)
    return Permission.is(status)
  }

  /**
   * Checks the status of a specific permission.
   * @param {P} permissionName - The name of the permission to check.
   * @returns The current permission status.
   */
  async check(permissionName: P) {
    const permission = this.permissions[permissionName]
    const status = await permission.check()
    return Permission.is(status)
  }

  /**
   * Requests multiple permissions at once.
   * @param {P[]} permissionsNames - An array of permission names to request.
   * @returns A record of updated permission statuses.
   */
  async requestMany<K extends P>(permissionsNames: K[]): Promise<Record<K, ReturnType<typeof Permission.is>>> {
    const status = {} as Record<K, ReturnType<typeof Permission.is>>

    for (const permissionName of permissionsNames) {
      status[permissionName] = await this.request(permissionName)
    }

    return status
  }

  /**
   * Checks the status of multiple permissions at once.
   * @param {P[]} permissionsNames - An array of permission names to check.
   * @returns A record of current permission statuses.
   */
  async checkMany<K extends P>(permissionsNames: K[]): Promise<Record<K, ReturnType<typeof Permission.is>>> {
    const status = {} as Record<K, ReturnType<typeof Permission.is>>

    for (const permissionName of permissionsNames) {
      status[permissionName] = await this.check(permissionName)
    }

    return status
  }

  /**
   * Checks the status of all managed permissions.
   * @returns A record of all current permission statuses.
   */
  async checkAll() {
    this.log('checkAll')
    return await this.checkMany(this.keys)
  }
}