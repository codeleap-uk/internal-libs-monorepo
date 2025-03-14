import { AnyRecord } from '@codeleap/types'
import { Permission, PermissionOptions, PermissionStatus } from './Permission'

type AppPermissionsConfig<C extends AnyRecord> = {
  request: (
    config: C,
    req: () => Promise<PermissionStatus>,
    check: () => Promise<PermissionStatus>,
  ) => Promise<PermissionStatus>
}

class AppPermissions<P extends string, C extends AnyRecord> {
  permissions: Record<P, Permission<C>>
  
  constructor(
    private config: AppPermissionsConfig<C>,
    permissions: Record<P, Omit<PermissionOptions<C>, 'name'>>
  ) {
    for (const permission in permissions) {
      const permissionConfig = permissions[permission]

      this.permissions[permission as unknown as P] = new Permission({
        ...permissionConfig,
        name: permission,
      })
    }
  }

  async request(permissionName: P) {
    const permission = this.permissions[permissionName]
    return this.config.request(
      permission.config,
      this.permissions[permissionName].request,
      this.permissions[permissionName].check,
    )
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
    async request(config, req, check) {
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