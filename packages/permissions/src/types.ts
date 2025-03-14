import { AnyRecord } from '@codeleap/types'
import { PermissionStatus } from './globals'

export type PermissionOptions<Config extends AnyRecord> = {
  name: string
  config: Config
  check: () => Promise<PermissionStatus>
  request: () => Promise<PermissionStatus>
}