import { Permission } from './Permission'
import { PermissionOptions } from './types'
import { PermissionStatus, PermissionConfig } from './globals'

export class PermissionsManager<P extends string> {
  private requester: (permission: Permission<PermissionConfig>) => Promise<PermissionStatus>

  permissions: Record<P, Permission<PermissionConfig>> = {} as Record<P, Permission<PermissionConfig>>

  get values() {
    const values = {}

    for (const permissionName in this.permissions) {
      const permission = this.permissions[permissionName]
      values[permission.name] = permission.value
    }

    return values
  }

  constructor(
    requester: (permission: Permission<PermissionConfig>) => Promise<PermissionStatus>,
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
  }

  async request(permissionName: P) {
    const permission = this.permissions[permissionName]

    return this.requester(permission)
  }

  async check(permissionName: P) {
    return this.permissions[permissionName].check()
  }

  async requestMany(permissionsNames: P[]) {
    const status = {} as Record<P, PermissionStatus>

    for (const permissionName of permissionsNames) {
      status[permissionName] = await this.request(permissionName)
    }

    return status
  }

  async checkMany(permissionsNames: P[]) {
    const status = {} as Record<P, PermissionStatus>

    for (const permissionName of permissionsNames) {
      status[permissionName] = await this.check(permissionName)
    }

    return status
  }
}