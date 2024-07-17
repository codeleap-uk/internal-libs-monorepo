import { AnyFunction, PropsOf } from '@codeleap/common'
import { PaginationButtonsComposition } from './styles'
import { Button } from '../Button'
import { PaginationParams } from '../../lib'
import { AppIcon, StyledProp } from '@codeleap/styles'

export type PaginationButtonsProps =
  PaginationParams &
  {
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
    itemProps?: Partial<PropsOf<typeof Button>>
    controlLeftIconName?: AppIcon
    controlRightIconName?: AppIcon
    leftArrowButtonProps?: Partial<PropsOf<typeof Button>>
    rightArrowButtonProps?: Partial<PropsOf<typeof Button>>
    style?: StyledProp<PaginationButtonsComposition>
  }
