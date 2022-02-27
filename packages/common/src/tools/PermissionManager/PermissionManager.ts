import { Logger } from '../Logger'
import { Permission } from './Permission'
import * as PermissionTypes from './types'

export class PermissionManager<
    T extends PermissionTypes.PermissionActionRecord,
    I extends PermissionTypes.IPermissionManager<T> = PermissionTypes.IPermissionManager<T>
> implements PermissionTypes.IPermissionManager<T> {
    private _permissions:Record<keyof T, Permission>

    subscriberArgs:Parameters<PermissionTypes.ChangeListener<T>>

    private subscribers: PermissionTypes.ChangeListener<T>[]

    private permSubscribers: Record<keyof T, PermissionTypes.PermissionSubscriber[]>

    private params: T

    public permissions: {
      [Property in keyof T as Uppercase<string & Property>] : Property
    }

    logger: Logger

    constructor(perms: T, options?: PermissionTypes.PermissionManagerOptions) {
      this.params = perms
      // @ts-ignore
      this._permissions = {}
      // @ts-ignore
      this.permissions = {}

      this.logger = options?.logger
      this.permSubscribers = {} as typeof this.permSubscribers

      for (const [permName, actions] of Object.entries(this.params)) {
        const name = permName as keyof T
        this._permissions[name] = new Permission({ ...actions, log: this.logger?.log || (() => null) }, permName)

        this.permSubscribers[name] = []

        // @ts-ignore
        this.permissions[(name as string).toUpperCase()] = name
      }

      this.subscribers = []
    }

    get values() {
      return this._permissions as unknown as Record<keyof T, PermissionTypes.PermissionState>
    }

    private async check(name: keyof T, options?: PermissionTypes.CheckOptions): Promise<PermissionTypes.PermissionState> {
      const previousStatus = this._permissions[name].status

      await this._permissions[name].check(options)

      if (this._permissions[name].status !== previousStatus) {
        this.permSubscribers[name].forEach(sub => sub(this._permissions[name]))
        this.subscribers.forEach(sub => sub(name, this._permissions[name]))
      }
      return this._permissions[name]
    }

    getMany:I['getMany'] = async (perms, options) => {

      const results = []

      for (const p of perms) {
        const isArray = Array.isArray(p)
        const name = isArray ? p[0] : p
        const opts = isArray ? p[1] : options

        results.push(await this.check(name, opts))
      }

      return results
    }

    // @ts-ignore
    get:I['get'] = async (name, options) => {
      return await this.check(name, options)
    }

    onPermissionChange(name: keyof T, callback:PermissionTypes.PermissionSubscriber) {
      const subIdx = this.permSubscribers[name].push(callback) - 1

      return () => {
        this.permSubscribers[name].splice(subIdx, 1)
      }
    }

    onChange(callback:PermissionTypes.ChangeListener<T>) {
      const subIdx = this.subscribers.push(callback) - 1

      return () => {
        this.subscribers.splice(subIdx, 1)
      }
    }

    getState() {
      const state = {}

      for (const [p, { ask: _ig2, check: _ig1, ...values }] of Object.entries(this._permissions)) {
        state[p] = { ...values }
      }

      return state as Record<keyof T, PermissionTypes.PermissionState>
    }

    async update() {
      for (const p of Object.keys(this._permissions)) {
        await this.check(p, {
          ask: false,
        })
      }
    }
}
