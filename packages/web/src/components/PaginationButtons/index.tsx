import {
  AnyFunction,
  ComponentVariants,
  PropsOf,
  StylesOf,
  getNestedStylesByKey,
  useCallback,
  useDefaultComponentStyle,
} from '@codeleap/common'
import { View } from '../View'
import { PaginationButtonPresets, PaginationButtonsComposition } from './styles'
import { Button } from '../Button'
import { PaginationParams, usePagination } from '../../lib'

export type PaginationButtonsProps = {
    pageKey?: number | string
    pages: number
    onFetchNextPage?: AnyFunction
    onFetchPreviousPage?: AnyFunction
    onFetchPage?: AnyFunction
    shouldAbreviate?: boolean
    disabled?: boolean
    displayLeftArrow: boolean
    displayRightArrow: boolean
    styles?: StylesOf<PaginationButtonsComposition>
    itemProps?: PropsOf<typeof Button>
    paginationProps?: PaginationParams
} & ComponentVariants<typeof PaginationButtonPresets>

export * from './styles'

export const PaginationButtons = (props: PaginationButtonsProps) => {

  const {
    pages,
    shouldAbreviate = true,
    displayLeftArrow = true,
    displayRightArrow = true,
    disabled = false,
    variants,
    responsiveVariants,
    styles,
    itemProps = {},
  } = props

  const defaultPaginationProps = {
    total: pages,
    boundaries: 2,
    shouldAbreviate,
    displayLeftArrow,
    displayRightArrow,
  }

  const boundaries = defaultPaginationProps?.boundaries
  const centeredElementIndex = boundaries + 1

  const {
    range,
    first,
    next,
    previous,
    setPage,
    active,
    status,
  } = usePagination({
    ...defaultPaginationProps,
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
      if (displayLeftArrow) {
        return fetchPreviousPage()
      } else {
        return first()
      }
    }

    if (displayRightArrow && isArrowRight) {
      return fetchNextPage()
    }

    fetchPage(item)

  }

  const renderItem = useCallback(({ item, index }) => {

    let selected = null

    const isArrowLeft = index === 0
    const isArrowRight = index === range?.length - 1

    const isArrowItem = displayLeftArrow && isArrowLeft || displayRightArrow && isArrowRight
    const arrowIconName = `chevron-${isArrowLeft ? 'left' : 'right'}`

    switch (status) {
      case 'initial':
        selected = active === index + (displayLeftArrow ? 0 : 1)
        break
      case 'abreviated':
        selected = index === centeredElementIndex - (displayLeftArrow ? 0 : 1)
        break
      case 'end':
        selected = active - (Number(item) - index) === index
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
  }, [itemStyles, active, status, range, centeredElementIndex])

  return (
    <View style={variantStyles.wrapper}>
      {range?.map?.((item, index) => renderItem({ item, index }))}
    </View>
  )
}

