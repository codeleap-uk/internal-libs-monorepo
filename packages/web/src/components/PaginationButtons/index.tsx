import {
  AnyFunction,
  ComponentVariants,
  PropsOf,
  StylesOf,
  TypeGuards,
  getNestedStylesByKey,
  useCallback,
  useCodeleapContext,
  useDefaultComponentStyle,
  useMemo,
  useState,
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
    pageKey = Date.now(),
    pages,
    value = null,
    onValueChange = null,
    onFetchPreviousPage,
    onFetchNextPage,
    onFetchPage,
    shouldAbreviate = true,
    disabled = false,
    showArrows = true,
    variants,
    responsiveVariants,
    styles,
    listProps = {},
    itemProps = {},
  } = props

  const variantStyles = useDefaultComponentStyle('u:PaginationButtons', {
    responsiveVariants,
    variants,
    styles,
  })

  const isMobile = Theme.hooks.down('tabletSmall')

  const arrowItemsAmount = 2

  const pageAbreviationIndex = isMobile ? 3 : 4

  const itemsListLength = isMobile ? 7 : 9
  const abreviationLimit = isMobile ? 5 : 10

  const shouldAbreviateNumbers = pages > abreviationLimit && shouldAbreviate

  const itemsAmount = shouldAbreviateNumbers ? itemsListLength : (pages + arrowItemsAmount)

  const [currentIndex, setCurrentIndex] = !TypeGuards.isNil(value) && !!onValueChange ? [value, onValueChange] : useState(1)

  const displayLastPageNumbers = isMobile ? currentIndex >= pages - 2 : pages - arrowItemsAmount <= currentIndex + 2

  const areItemsAbreviated = shouldAbreviateNumbers && (currentIndex >= pageAbreviationIndex)

  const lastInitialOrderItem = pages - (itemsListLength - 2)

  const firstPageNumber = 1
  const secondPageNumber = 2
  const thirdPageNumber = 3
  const abreviator = '...'

  const listStyles = getNestedStylesByKey('list', variantStyles)
  const itemStyles = getNestedStylesByKey('button', variantStyles)

  const initialPageNumbersOrder = useMemo(() => {

    let thirdItem = null
    let fourthItem = null
    let fifthItem = null

    const order = []

    if (!shouldAbreviateNumbers || !shouldAbreviate) {
      for (let i = 1; i < pages + 1; i++) {
        order.push(i)
      }
      return order
    }

    if (isMobile) {
      thirdItem = areItemsAbreviated ? currentIndex : abreviator
      fourthItem = areItemsAbreviated ? abreviator : pages - 1
      fifthItem = pages
    } else {
      thirdItem = areItemsAbreviated ? abreviator : thirdPageNumber
      fourthItem = areItemsAbreviated ? currentIndex : abreviator
      fifthItem = areItemsAbreviated ? abreviator : pages - 2
    }

    return [
      firstPageNumber,
      isMobile && areItemsAbreviated ? abreviator : secondPageNumber,
      thirdItem,
      fourthItem,
      fifthItem,
      pages - 1,
      pages,
    ].filter(Boolean)

  }, [currentIndex, areItemsAbreviated, itemsAmount])

  const finalPageNumbersOrder = [
    firstPageNumber,
    abreviator,
    pages - (isMobile ? 2 : 4),
    pages - (isMobile ? 1 : 3),
    pages - (isMobile ? 0 : 2),
    pages - 1,
    pages,
  ]

  const setNextIndex = ({ index, isArrowItem, isPrevArrow }) => {

    const firstNumericItemIndex = 1

    const preventArrowItemSelection = isArrowItem && currentIndex === (isPrevArrow ? firstNumericItemIndex : pages)

    let nextIndex = null
    const isLastItem = index === itemsAmount - arrowItemsAmount

    const isInitialNumberPress = (!displayLastPageNumbers && areItemsAbreviated && index <= pageAbreviationIndex) || !areItemsAbreviated

    if (isArrowItem) {
      if (preventArrowItemSelection) return setCurrentIndex(state => state)
      setCurrentIndex((state) => state - (isPrevArrow ? 1 : -1))
      return isPrevArrow ? onFetchPreviousPage?.() : onFetchNextPage?.()
    }

    if (!nextIndex) {
      if (isLastItem) {
        nextIndex = pages
      } else {
        if (!isMobile || (isMobile && areItemsAbreviated)) {
          nextIndex = (isInitialNumberPress ? initialPageNumbersOrder : finalPageNumbersOrder)[index - 1]
        } else {
          nextIndex = initialPageNumbersOrder[index - 1]
        }
      }
    }

    const _index = TypeGuards.isNumber(nextIndex) ? nextIndex : index + 1

    const shouldFetchNextPage = currentIndex - _index === - 1
    const shouldFetchPreviousPage = currentIndex - _index === 1

    if (shouldFetchNextPage) {
      onFetchNextPage?.()
    } else if (shouldFetchPreviousPage) {
      onFetchPreviousPage?.()
    } else {
      onFetchPage?.(_index)
    }

    setCurrentIndex(_index)
  }

  const renderItem = useCallback(({ index }) => {

    let isItemSelected = null

    const isPrevArrow = index === 0
    const isNextArrow = index === itemsAmount - 1

    const fourthNumericItemIndex = 4

    const item = (displayLastPageNumbers && shouldAbreviateNumbers ? finalPageNumbersOrder : initialPageNumbersOrder)[index - 1]

    const shouldAllowPress = item !== abreviator

    if (isMobile) {
      if (!areItemsAbreviated || (areItemsAbreviated && currentIndex < pageAbreviationIndex)) {
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
        isItemSelected = index === (areItemsAbreviated ? fourthNumericItemIndex : currentIndex)
      } else {
        isItemSelected = finalPageNumbersOrder[index - 1] === currentIndex
      }
    }

    const isArrowItem = isPrevArrow || isNextArrow

    const onPressItem = () => {
      setNextIndex({
        index,
        isArrowItem,
        isPrevArrow,
      })
    }

    const arrowIcon = `chevron-${isPrevArrow ? 'left' : 'right'}`

    if (isArrowItem && !showArrows) {
      return null
    }

    return (
      <Button
        variant={`default`}
        text={isArrowItem ? '' : String(item)}
        selected={isItemSelected}
        icon={isArrowItem ? arrowIcon : null}
        onPress={shouldAllowPress ? onPressItem : () => null}
        styles={itemStyles}
        disabled={disabled}
        {...itemProps}
      />
    )
  }, [currentIndex, itemsAmount, itemStyles])

  const data = Array(itemsAmount).fill({})

  return (
    <View style={variantStyles.wrapper}>
      <List
        data={data}
        debugName={'Table pagination buttons'}
        styles={listStyles}
        renderItem={renderItem}
        masonryProps={{ columnCount: itemsAmount, key: pageKey }}
        {...listProps}
      />
    </View>
  )
}

