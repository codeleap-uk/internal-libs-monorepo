import { ImageProps } from '../../components/Image'
import { PermissionTypes } from './package'
type NonGrantedPermissionTypes = Exclude<PermissionTypes.PermissionStatus, 'granted'>

export type BasePermissionConfig = {
  fullscreenModal?: boolean
  dismissable?: boolean
  title: string
  onAllow: 'openSettings' | 'ask'

  description: string[]
  icon?: string
  image?: ImageProps['source']
  imageProps?: Omit<ImageProps, 'source'>
}

export type PermissionConfig = BasePermissionConfig &
  Partial<
    Record<
      NonGrantedPermissionTypes,
      Partial<BasePermissionConfig>
    >
  >

export type PermissionModalsConfig<PermissionNames extends string | number | symbol> = Partial<
  Record<PermissionNames, PermissionConfig>
>