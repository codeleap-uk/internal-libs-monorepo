import {
  AnyFunction,
  ComponentVariants,
  PropsOf,
  StylesOf,
  getNestedStylesByKey,
  useCallback,
  useCodeleapContext,
  useDefaultComponentStyle,
} from '@codeleap/common'
import { List } from '../List'
import { View } from '../View'
import { PaginationButtonPresets, PaginationButtonsComposition } from './styles'
import { Button } from '../Button'
import { PaginationParams, usePagination } from '../../lib'

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
    paginationProps?: PaginationParams
} & ComponentVariants<typeof PaginationButtonPresets>

export * from './styles'

export const PaginationButtons = (props: PaginationButtonsProps) => {

  const { Theme } = useCodeleapContext()

  const {
    pages = 12,
    shouldAbreviate = true,
    disabled = false,
    showArrows = true,
    variants,
    responsiveVariants,
    styles,
    itemProps = {},
  } = props

  const {
    range,
    next,
    previous,
    setPage,
    active,
    lastNumbersDisplayed,
  } = usePagination({
    total: pages,
    boundaries: 2,
    ...props?.paginationProps,
  })

  const variantStyles = useDefaultComponentStyle('u:PaginationButtons', {
    responsiveVariants,
    variants,
    styles,
  })

  const itemStyles = getNestedStylesByKey('button', variantStyles)

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

  const onPressItem = ({ item, isArrowLeft, isArrowRight }) => {

    if (isArrowLeft) {
      return fetchPreviousPage()
    }

    if (isArrowRight) {
      return fetchNextPage()
    }

    fetchPage(item)

  }

  const renderItem = useCallback(({ item, index }) => {

    let selected = null

    const isArrowLeft = index === 0
    const isArrowRight = index === range?.length - 1

    const isArrowItem = isArrowLeft || isArrowRight
    const arrowIconName = `chevron-${isArrowLeft ? 'left' : 'right'}`

    if (active <= 2) { //  2== boundaries
      selected = index === active
    } else {
      if (lastNumbersDisplayed) {
        selected = active - (Number(range[1]) - 1) === index
      } else {
        selected = index === 2 + 1//  2== boundaries
      }
    }

    return (
      <Button
        variant={`default`}
        text={isArrowItem ? '' : String(item)}
        selected={selected}
        icon={isArrowItem ? arrowIconName : null}
        onPress={() => onPressItem({ item, isArrowLeft, isArrowRight }) }
        styles={itemStyles}
        disabled={disabled}
        {...itemProps}
      />
    )
  }, [itemStyles, active, lastNumbersDisplayed])

  return (
    <View style={[variantStyles.wrapper]}>
      {range?.map?.((item, index) => renderItem({ item, index }))}
    </View>
  )
}

