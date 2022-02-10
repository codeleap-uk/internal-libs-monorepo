import { Logger } from '../Logger'
import { Permission } from './Permission'
import * as PermissionTypes from './types'

export class PermissionManager<
    T extends PermissionTypes.PermissionActionRecord,
    I extends PermissionTypes.IPermissionManager<T> = PermissionTypes.IPermissionManager<T>
> implements PermissionTypes.IPermissionManager<T> {
    private _permissions:Record<keyof T, Permission>

    private subscribers: PermissionTypes.PermissionSubscriber<T>[]

    private params: T

    public permissions: {
      [Property in keyof T as Uppercase<string & Property>]  : Property
    }

    logger: Logger

    constructor(perms: T, options?: PermissionTypes.PermissionManagerOptions){
      this.params = perms
      // @ts-ignore
      this._permissions = {}
      // @ts-ignore
      this.permissions = {}

      this.logger = options.logger

      for (const [permName, actions] of Object.entries(this.params)){
        const name = permName as keyof T
        this._permissions[name] = new Permission({...actions, log: this.logger.log || (() => null) }, permName)

        // @ts-ignore
        this.permissions[(name as string).toUpperCase()] = name 
      }

      this.subscribers = []
    } 

    get values(){
      return this._permissions as unknown as Record<keyof T, PermissionTypes.PermissionState>
    }

    private async check(name: keyof T, options?: PermissionTypes.CheckOptions): Promise<PermissionState>{
      const previousStatus = this._permissions[name].status

      await this._permissions[name].check(options)

      if (this._permissions[name].status !== previousStatus){
        this.subscribers.forEach(sub => sub(name, this._permissions[name]))
      }
      return this._permissions[name] as unknown as PermissionState
    }
    
    getMany:I['getMany'] =  async (perms, options) => {
      
      
      const results = []
        
      for (const p of perms){
        const name = Array.isArray(p) ? p[0] : p
        const opts = Array.isArray(p) ? p[1] : options
  
        results.push(await this.check(name, opts))
      }
        
      return results
    }
    
    // @ts-ignore
    get:I['get'] = async (name, options) => {
      return await this.check(name, options)
    } 

    onChange(callback:PermissionTypes.PermissionSubscriber<T>){
      const subIdx = this.subscribers.push(callback) - 1

      return () => {
        this.subscribers.splice(subIdx, 1)
      }
    }

    getState(){
      const state = {}

      for (const [p, {ask: _ig2, check: _ig1, ...values}] of Object.entries(this._permissions)){
        state[p] = {...values}
      }

      return state as Record<keyof T, PermissionState>
    }
}
