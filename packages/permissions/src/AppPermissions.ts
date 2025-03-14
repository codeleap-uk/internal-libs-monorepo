import { AnyRecord } from '@codeleap/types'
import { Permission, PermissionOptions, PermissionStatus } from './Permission'

type AppPermissionsConfig<C extends AnyRecord> = {
  request: (permission: Permission<C>) => Promise<PermissionStatus>
}

export class AppPermissions<P extends string, C extends AnyRecord> {
  permissions: Record<P, Permission<C>> = {} as Record<P, Permission<C>>

  get values() {
    const values = {}

    for (const permissionName in this.permissions) {
      const permission = this.permissions[permissionName]
      values[permission.name] = permission.value
    }

    return values
  }
  
  constructor(
    private config: AppPermissionsConfig<C>,
    permissions: Record<P, Omit<PermissionOptions<C>, 'name'>>
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

const appPermissions = new AppPermissions(
  {
    async request(permission) {
      return 'blocked'
    },
  },
  {
  camera: {
    config: {
      title: 'title'
    },
    check: async () => 'blocked',
    request: async () => 'blocked'
  },
  library: {
    config: {
      title: {}
    },
    check: async () => 'blocked',
    request: async () => 'blocked'
  }
})