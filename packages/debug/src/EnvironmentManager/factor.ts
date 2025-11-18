import { StringRecord } from '@codeleap/types'
import { EnvironmentManager } from './class'
import { EnvironmentManagerConfig } from './types'

export function createEnvironmentManager<T extends StringRecord>(config: EnvironmentManagerConfig<T>) {
  return new EnvironmentManager<T>(config)
}
