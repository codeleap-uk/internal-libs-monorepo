import { PermissionTypes } from '@codeleap/common'
type NonGrantedPermissionTypes = Exclude<PermissionTypes.PermissionStatus, 'granted'>

export type BasePermissionConfig = {
    fullscreenModal?: boolean
    dismissable?: boolean
    title: string
    onAllow: 'openSettings' | 'ask'

    description: string[]
    icon: string
}

export type PermissionConfig = BasePermissionConfig &
    Partial<
        Record<
            NonGrantedPermissionTypes,
            Partial<BasePermissionConfig>
        >
    >

export type PermissionModalsConfig<PermissionNames extends string|number|symbol> = Partial<
    Record<PermissionNames, PermissionConfig>
>
