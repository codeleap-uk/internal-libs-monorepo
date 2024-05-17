import {
  AnyFunction,
  ComponentVariants,
  PropsOf,
  StylesOf,
  TypeGuards,
  getNestedStylesByKey,
  useCallback,
  useCodeleapContext,
  useConditionalState,
  useDefaultComponentStyle,
} from '@codeleap/common'
import { List } from '../List'
import { View } from '../View'
import { PaginationButtonPresets, PaginationButtonsComposition } from './styles'
import { Button } from '../Button'

export type PaginationButtonsProps = {
    pageKey?: number | string
    pages: number
    value?: number
    onValueChange?: AnyFunction
    onFetchNextPage?: AnyFunction
    onFetchPreviousPage?: AnyFunction
    onFetchPage?: AnyFunction
    shouldAbreviate?: boolean
    disabled?: boolean
    showArrows?: boolean
    styles?: StylesOf<PaginationButtonsComposition>
    listProps?: PropsOf<typeof List>
    itemProps?: PropsOf<typeof Button>
} & ComponentVariants<typeof PaginationButtonPresets>

export * from './styles'

export const PaginationButtons = (props: PaginationButtonsProps) => {

  const { Theme } = useCodeleapContext()

  const {
    pages,
    shouldAbreviate = true,
    disabled = false,
    showArrows = true,
    variants,
    responsiveVariants,
    styles,
    itemProps = {},
  } = props

  const { range, currentPage, next, previous, setPage } = usePagination({
    total: 20,
  })

  const variantStyles = useDefaultComponentStyle('u:PaginationButtons', {
    responsiveVariants,
    variants,
    styles,
  })

  const isMobile = Theme.hooks.down('tabletSmall')

  const itemStyles = getNestedStylesByKey('button', variantStyles)

  const arrowItemsAmount = showArrows ? 2 : 0
  const itemsListLength = isMobile ? 7 : 9
  const maxListLength = isMobile ? 5 : 10
  const firstAbreviatedIndex = isMobile ? 3 : 4

  // const shouldAbreviateNumbers = (pages > maxListLength && shouldAbreviate) || isMobile
  const shouldAbreviateNumbers = (pages > maxListLength && shouldAbreviate)

  const itemsAmount = shouldAbreviateNumbers ? itemsListLength : (pages + arrowItemsAmount)

  const [currentIndex, setCurrentIndex] = useConditionalState(props?.value, props?.onValueChange, { initialValue: 1 })

  const displayLastPageNumbers = isMobile ? currentIndex >= pages - 2 : pages - arrowItemsAmount <= currentIndex + 2

  const areItemsAbreviated = shouldAbreviateNumbers && (currentIndex >= firstAbreviatedIndex)

  const lastInitialOrderItem = pages - (itemsListLength - 2)

  const thirdPageNumber = 3
  const abreviator = '...'

  const fetchPreviousPage = () => {
    props?.onFetchPreviousPage?.()
    previous?.()
  }

  const fetchNextPage = () => {
    props?.onFetchNextPage?.()
    next?.()
  }

  const fetchPage = (page: number) => {
    props?.onFetchPage?.(page)
    setPage?.(page)
  }

  const onPressItem = ({ index, isArrowItem, isPrevArrow, shouldAllowPress }) => {

    if (!shouldAllowPress) {
      return null
    }

    const firstNumericItemIndex = 1

    const preventArrowItemSelection = isArrowItem && currentIndex === (isPrevArrow ? firstNumericItemIndex : pages)

    const nextIndex = null

    if (isArrowItem) {
      if (preventArrowItemSelection) return setCurrentIndex(state => state)
      setCurrentIndex((state) => state - (isPrevArrow ? 1 : -1))
      return isPrevArrow ? fetchPreviousPage?.() : fetchNextPage?.()
    }

    const _index = TypeGuards.isNumber(nextIndex) ? nextIndex : index + 1

    const shouldFetchNextPage = currentIndex - _index === - 1
    const shouldFetchPreviousPage = currentIndex - _index === 1

    if (shouldFetchNextPage) {
      fetchNextPage?.()
    } else if (shouldFetchPreviousPage) {
      fetchPreviousPage?.()
    } else {
      fetchPage?.(_index)
    }

    setCurrentIndex(_index)
  }

  const renderItem = useCallback(({ index }) => {

    let isItemSelected = null

    const isPrevArrow = index === 0
    const isNextArrow = index === itemsAmount - 1

    const fourthIndex = 4

    const item = page

    const shouldAllowPress = item !== abreviator

    if (isMobile) {
      if (!areItemsAbreviated || (areItemsAbreviated && currentIndex < firstAbreviatedIndex)) {
        isItemSelected = index === currentIndex
      } else {
        if (!displayLastPageNumbers) {
          isItemSelected = index === thirdPageNumber
        } else {
          isItemSelected = lastInitialOrderItem + index === currentIndex
        }
      }
    } else {
      if (!displayLastPageNumbers || !shouldAbreviateNumbers) {
        isItemSelected = index === (areItemsAbreviated ? fourthIndex : currentIndex)
      } else {
        isItemSelected = item === currentIndex
      }
    }

    const isArrowItem = isPrevArrow || isNextArrow
    const arrowIconName = `chevron-${isPrevArrow ? 'left' : 'right'}`

    if (isArrowItem && !showArrows) {
      return null
    }

    return (
      <Button
        variant={`default`}
        text={isArrowItem ? '' : String(item)}
        selected={isItemSelected}
        icon={isArrowItem ? arrowIconName : null}
        onPress={() => onPressItem({ index, isArrowItem, isPrevArrow, shouldAllowPress }) }
        styles={itemStyles}
        disabled={disabled}
        {...itemProps}
      />
    )
  }, [currentIndex, itemsAmount, itemStyles])

  // const data = Array(itemsAmount).fill({})

  return (
    <View style={[variantStyles.wrapper, { minWidth: itemsAmount * (Theme.values.itemHeight.small + Theme.spacing.value(4)) }]}>
      {range?.map?.((_, index) => renderItem({ index }))}
    </View>
  )
}

