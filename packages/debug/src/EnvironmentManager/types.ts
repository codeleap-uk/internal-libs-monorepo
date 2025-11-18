import { Keyof, StringRecord, ValueOf } from '@codeleap/types'
import { EDITORS } from './const'

export type Editor = ValueOf<typeof EDITORS> | null

export type EnvironmentManagerConfig<T extends StringRecord> = {
  environments: T
  defaultEnvironment: Keyof<T>
  customEnvironment: Keyof<T>
  persistKey?: string
}

export type EnvironmentStore<T extends StringRecord> = {
  environment: Keyof<T>
  customUrl?: string
  enabledBy: Editor
}
