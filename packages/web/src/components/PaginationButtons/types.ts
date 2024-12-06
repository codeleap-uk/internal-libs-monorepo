import { AnyFunction } from '@codeleap/types'
import { PaginationButtonsComposition } from './styles'
import { ButtonProps } from '../Button'
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
    itemProps?: Partial<ButtonProps>
    controlLeftIconName?: AppIcon
    controlRightIconName?: AppIcon
    leftArrowButtonProps?: Partial<ButtonProps>
    rightArrowButtonProps?: Partial<ButtonProps>
    style?: StyledProp<PaginationButtonsComposition>
  }
