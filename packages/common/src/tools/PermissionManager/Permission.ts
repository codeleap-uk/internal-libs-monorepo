import { AnyFunction } from '../../types/utility'
import * as PermissionTypes from './types'

const SCOPE  = 'Permissions'

export class Permission implements PermissionTypes.IPermission {
    status: PermissionTypes.PermissionStatus;

    shouldAsk: boolean;

    constructor(private actions:PermissionTypes.PermissionActions & {log?: AnyFunction}, public name = '') {
      this.actions  = actions
      this.shouldAsk = true
      this.status = 'pending'

    }

    async ask(): Promise<void> {
      const newState = await this.actions.onAsk()
      this.actions.log(`Request for permission ${this.name} returned`, newState, SCOPE)
      this.status = newState

      if (newState === 'never_ask_again') {
        this.shouldAsk = false
      }
    }

    async check(options?:PermissionTypes.CheckOptions): Promise<void> {
      const _options:PermissionTypes.CheckOptions = {
        askOnPending: true,
        askOnDenied: false,
        ask: true,
        ...options,
      }

      this.status = await this.actions.onCheck()
      this.actions.log(`Check for permission ${this.name} returned`, this.status, SCOPE)
      if (!_options.ask) return

      switch (this.status) {
        case 'denied':
          if (_options.askOnDenied) {
            await this.ask()
          }
          break
        case 'pending':
          if (_options.askOnPending) {
            await this.ask()
          }
          break
      }
    }

    get isGranted() {
      return this.status === 'granted'
    }

    get isDenied() {
      return this.status === 'denied'
    }

    get isPending() {
      return this.status === 'pending'
    }

    get isNever_ask_again() {
      return this.status === 'never_ask_again'
    }
}
