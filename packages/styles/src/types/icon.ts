/* eslint-disable @typescript-eslint/no-empty-interface */

export interface AppIcons {

}
export type AppIcon = keyof AppIcons

export type IconProp = AppIcon | `url:${string}`
