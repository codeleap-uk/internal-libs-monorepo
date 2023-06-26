import { PermissionTypes } from '@codeleap/common'
import { ImageProps } from '../../components/Image'
type NonGrantedPermissionTypes = Exclude<PermissionTypes.PermissionStatus, 'granted'>

export type BasePermissionConfig = {
    fullscreenModal?: boolean
    dismissable?: boolean
    title: string
    onAllow: 'openSettings' | 'ask'
    description: string[]
    icon?: string
    image?: any
    imageProps?: Omit<ImageProps, 'source'>
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
