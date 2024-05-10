import {
  AnyFunction,
  ComponentVariants,
  StylesOf,
  TypeGuards,
  useBooleanToggle,
  useCallback,
  useCodeleapContext,
  useDefaultComponentStyle,
  useMemo,
  useState,
} from '@codeleap/common'
import { Text } from '../Text'
import { Icon } from '../Icon'
import { List } from '../List'
import { View } from '../View'
import { Touchable } from '../Touchable'
import { PaginationButtonPresets, PaginationButtonsComposition } from './styles'
import { useGetStyles } from '../../lib'

export type PaginationButtonsProps = {
    pageKey?: number | string
    pages: number
    value?: number
    onValueChange?: AnyFunction
    onFetchNextPage: AnyFunction
    onFetchPreviousPage: AnyFunction
    onFetchPage: AnyFunction
    styles?: StylesOf<PaginationButtonsComposition>
} & ComponentVariants<typeof PaginationButtonPresets>

export * from './styles'

export const PaginationButtons = (props: PaginationButtonsProps) => {

  const { Theme } = useCodeleapContext()

  const {
    pageKey = Date.now(), // not sure if it is correct but seems to work in most cases
    pages,
    value = null,
    onValueChange = null,
    onFetchPreviousPage,
    onFetchNextPage,
    onFetchPage,
    variants,
    responsiveVariants,
    styles,
  } = props

  const variantStyles = useDefaultComponentStyle('u:PaginationButtons', {
    responsiveVariants,
    variants,
    styles,
  })

  console.log(variantStyles, 'variantStyles')

  const isMobile = Theme.hooks.down('tabletSmall')

  const initialIndex = 0
  const arrowItemsAmount = 2

  const pageAbreviationIndex = isMobile ? 3 : 4

  const itemsListLength = isMobile ? 7 : 9 // number of items in the list (including arrows)
  const abreviationLimit = isMobile ? 5 : 10 // the list will be abreviated if over 10 items

  const shouldAbreviateNumbers = pages > abreviationLimit

  const itemsAmount = shouldAbreviateNumbers ? itemsListLength : (pages + arrowItemsAmount)

  const initialNumericIndex = initialIndex + 1

  const [currentIndex, setCurrentIndex] = !TypeGuards.isNil(value) && !!onValueChange ? [value, onValueChange] : useState(initialNumericIndex)

  const displayLastPageNumbers = isMobile ? currentIndex >= pages - 2 : pages - arrowItemsAmount <= currentIndex + 2

  const areItemsAbreviated = shouldAbreviateNumbers && (currentIndex >= pageAbreviationIndex)

  const lastInitialOrderItem = pages - (itemsListLength - 2)

  const firstPageNumber = 1
  const secondPageNumber = 2
  const thirdPageNumber = 3
  const abreviator = '...'

  const initialPageNumbersOrder = useMemo(() => {

    let thirdItem = null
    let fourthItem = null
    let fifthItem = null

    const order = []

    if (!shouldAbreviateNumbers) {
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
      pages - 1, // only shows up on desktop
      pages, // only shows up on desktop
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

    const [hover, setHover] = useBooleanToggle(false)

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

    const Wrapper = shouldAllowPress ? Touchable : View

    const onHover = useCallback(() => {
      const isAbreviator = item === abreviator
      if (isAbreviator) return null
      setHover()
    }, [item])

    return (
      <Wrapper
        // @ts-ignore
        variants={['center', 'border-radius:tiny']}
        onPress={onPressItem}
        style={[variantStyles.itemWrapper, isItemSelected && variantStyles['itemWrapper:selected']]}
        debugName={`${index} page button on press`}
        onHover={onHover}
      >
        {isArrowItem ? (
          <Icon
            name={arrowIcon}
            size={Theme.values.iconSize[2]}
            debugName='Arrow'
          />
        ) : (
          <Text
            variants={['p2']}
            text={item}
            style={[
              variantStyles.text,
              isItemSelected && variantStyles['text:selected'],
              hover && variantStyles['text:hover'],
            ]}
          />
        ) }
      </Wrapper>
    )
  }, [currentIndex, itemsAmount])

  const data = Array(itemsAmount).fill({})

  const listMaxWidth = (itemsAmount) * (Theme.values.itemHeight.small + Theme.spacing.value(2))

  const { getStyles } = useGetStyles(variantStyles)

  return (
    <View
      style={variantStyles.wrapper}
      responsiveVariants={{
        mid: ['paddingLeft:2'],
      }}
    >
      <List
        data={data}
        debugName={'Table pagination buttons'}
        styles={getStyles('list')}
        renderItem={renderItem}
        masonryProps={{ columnCount: itemsAmount, key: pageKey }}
        style={{ maxWidth: listMaxWidth, minHeight: 'auto' }}
      />
    </View>
  )
}

