export type SelectProperties<T extends Record<string|number|symbol, any>, K extends keyof T> = {
    [P in K] : T[K]
}

export * from './attachMediaListener'
export * from './isMediaQuery'
export * from './useAnimatedVariantStyles'
export * from './useClickOutside'
export * from './useMediaQuery'
export * from './usePageExitBlocker'
export * from './usePagination'
export * from './useScrollEffect'
export * from './useStaticAnimationStyles'
export * from './useWindowFocus'
export * from './useWindowSize'

