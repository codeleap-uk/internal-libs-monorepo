import {
  TypeGuards,
  getNestedStylesByKey,
  useCodeleapContext,
  useDefaultComponentStyle,
} from '@codeleap/common'
import { View } from '../View'
import { Button } from '../Button'
import { useMediaQuery, usePagination } from '../../lib'
import { PaginationButtonsProps } from './types'
import { IconProps } from '../Icon'

export * from './styles'

const defaultProps: Partial<PaginationButtonsProps> = {
  shouldAbbreviate: true,
  displayLeftArrow: true,
  displayRightArrow: true,
  disabled: false,
  isMobile: null,
  abbreviationSymbol: '...',
  controlLeftIconName: 'chevron-left' as IconProps['name'],
  controlRightIconName: 'chevron-right' as IconProps['name'],
}

export const PaginationButtons = (props: PaginationButtonsProps) => {

  const allProps = {
    ...PaginationButtons.defaultProps,
    ...props,
  }

  const {
    shouldAbbreviate,
    displayLeftArrow,
    displayRightArrow,
    disabled,
    variants = [],
    responsiveVariants = {},
    styles = {},
    itemProps,
    controlLeftIconName,
    controlRightIconName,
    leftArrowButtonProps,
    rightArrowButtonProps,
    abbreviationSymbol,
    isMobile,
    ...paginationProps
  } = allProps

  const { Theme } = useCodeleapContext()

  const { boundaries = 2 } = paginationProps

  const query = Theme.media.down('tabletSmall')

  const _isMobile = useMediaQuery(query, { getInitialValueInEffect: false })
  const isMobileQuery = TypeGuards.isBoolean(isMobile) ? isMobile : _isMobile

  const centeredElementIndex = isMobileQuery ? 3 : boundaries + 1

  const {
    range,
    first,
    next,
    previous,
    setPage,
    page,
    status,
  } = usePagination({
    abbreviationSymbol,
    isMobile: isMobileQuery,
    displayLeftArrow,
    displayRightArrow,
    shouldAbbreviate,
    ...paginationProps,
  })

  const variantStyles = useDefaultComponentStyle('u:PaginationButtons', {
    responsiveVariants,
    variants,
    styles,
  })

  const itemStyles = getNestedStylesByKey('button', variantStyles)

  const arrowLeftStyles = getNestedStylesByKey('arrowLeftButton', variantStyles)
  const arrowRightStyles = getNestedStylesByKey('arrowRightButton', variantStyles)

  const fetchPreviousPage = () => {
    props?.onFetchPreviousPage?.()
    previous?.()
  }

  const fetchNextPage = () => {
    props?.onFetchNextPage?.()
    next?.()
  }

  const fetchPage = (page: number) => {
    setPage?.(page)
  }

  const onPressItem = ({ item, isArrowLeft, isArrowRight }: { item: string | number; isArrowLeft: boolean; isArrowRight: boolean }) => {

    if (item === abbreviationSymbol) {
      return null
    }

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

    props?.onPressItem?.(item)
    fetchPage(Number(item))

  }

  return (
    <View style={variantStyles.wrapper}>

      {displayLeftArrow ? (
        <Button
          icon={controlLeftIconName}
          onPress={() => onPressItem({ item: null, isArrowLeft: true, isArrowRight: false })}
          styles={arrowLeftStyles}
          {...leftArrowButtonProps}
        />
      ) : null}

      {range?.map?.((item, index) => {

        if (props?.renderItem) {
          return props?.renderItem?.(item, index)
        }

        let selected = null

        switch (status) {
          case 'initial':
            selected = page === index + 1
            break
          case 'abreviated':
            selected = index === centeredElementIndex - 1
            break
          case 'end':
            selected = page - (Number(item) - index) === index
        }

        return (
          <Button
            text={String(item)}
            selected={selected}
            onPress={() => onPressItem({ item, isArrowLeft: false, isArrowRight: false }) }
            styles={itemStyles}
            disabled={disabled}
            {...itemProps}
          />
        )

      })}

      {displayRightArrow ? (
        <Button
          icon={controlRightIconName}
          onPress={() => onPressItem({ item: null, isArrowLeft: false, isArrowRight: true })}
          styles={arrowRightStyles}
          {...rightArrowButtonProps}
        />
      ) : null}

    </View>
  )
}

PaginationButtons.defaultProps = defaultProps
