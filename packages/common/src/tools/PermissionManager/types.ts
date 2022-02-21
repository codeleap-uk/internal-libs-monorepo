import { Logger } from '../Logger'
import { FunctionType } from '../../types/utility'

export const permissionStatuses = ['granted', 'denied', 'pending', 'never_ask_again'] as const
export type PermissionStatus = typeof permissionStatuses[number]

export type PermissionState = {
    status: PermissionStatus
    shouldAsk: boolean

} & Record<`is${Capitalize<PermissionStatus>}`, boolean>

export type CheckOptions = {
    askOnPending?:boolean
    askOnDenied?:boolean
    ask?: boolean

}

export type IPermission = {
    ask():Promise<void>
    check(options?:CheckOptions):Promise<void>

} & PermissionState

export type PermFunction = FunctionType<[], Promise<PermissionStatus>>

export type PermissionActions = Record<'onAsk'|'onCheck', PermFunction> & { init?: 'check' | PermissionState }

export type PermissionActionRecord = {[x:string] : PermissionActions}

export interface IPermissionManager<T extends PermissionActionRecord> {
    getMany(perms: PermissionArray<T>, options?: CheckOptions): Promise<PermissionState[]>
    get(name: keyof T, options?: CheckOptions): Promise<PermissionState>
}

export type ChangeListener<T> = FunctionType<[keyof T, PermissionState], any>
export type PermissionSubscriber = FunctionType<[PermissionState], any>

export type PermissionArray<T> = ([name: keyof T, options: CheckOptions])[] | (keyof T)[]

export type PermissionManagerOptions = {
    logger?: Logger
}
