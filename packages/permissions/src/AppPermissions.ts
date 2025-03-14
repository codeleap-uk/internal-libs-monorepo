import { AnyRecord } from '@codeleap/types'
import { Permission } from './Permission'
import { PermissionOptions } from './types'
import { PermissionStatus, PermissionConfig } from './globals'

type AppPermissionsConfig<C extends AnyRecord> = {
  request: (permission: Permission<C>) => Promise<PermissionStatus>
}

export class AppPermissions<P extends string> {
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
    private config: AppPermissionsConfig<PermissionConfig>,
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
  }

  async request(permissionName: P) {
    const permission = this.permissions[permissionName]
    
    return this.config.request(permission)
  }

  async check(permissionName: P) {
    return this.permissions[permissionName].check()
  }

  async manyRequest(permissionsNames: P[]) {
    const status = {} as Record<P, PermissionStatus>

    for (const permissionName of permissionsNames) {
      status[permissionName] = await this.request(permissionName)
    }

    return status
  }

  async manyCheck(permissionsNames: P[]) {
    const status = {} as Record<P, PermissionStatus>

    for (const permissionName of permissionsNames) {
      status[permissionName] = await this.check(permissionName)
    }

    return status
  }
}