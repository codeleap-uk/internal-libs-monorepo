import {
  AnyFunction,
  ComponentVariants,
  PropsOf,
  StylesOf,
} from '@codeleap/common'
import { PaginationButtonPresets, PaginationButtonsComposition } from './styles'
import { Button } from '../Button'
import { PaginationParams } from '../../lib'
import { IconProps } from '../Icon'

export type PaginationButtonsProps = {
    onFetchNextPage?: AnyFunction
    onFetchPreviousPage?: AnyFunction
    renderItem?: (item: string | number, index: number) => JSX.Element
    onPressItem?: (item: string | number) => void
    shouldAbbreviate?: boolean
    abbreviationSymbol?: string
    disabled?: boolean
    displayLeftArrow?: boolean
    displayRightArrow?: boolean
    isMobile?: boolean
    styles?: StylesOf<PaginationButtonsComposition>
    itemProps?: Partial<PropsOf<typeof Button>>
    controlLeftIconName?: IconProps['name']
    controlRightIconName?: IconProps['name']
    leftArrowButtonProps?: Partial<PropsOf<typeof Button>>
    rightArrowButtonProps?: Partial<PropsOf<typeof Button>>
} & ComponentVariants<typeof PaginationButtonPresets> & PaginationParams
