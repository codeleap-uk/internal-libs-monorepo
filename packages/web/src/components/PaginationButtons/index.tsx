import { TypeGuards } from '@codeleap/types'
import { View } from '../View'
import { Button } from '../Button'
import { useMediaQuery, usePagination, useStylesFor, WebStyleRegistry } from '../../lib'
import { PaginationButtonsProps } from './types'
import { AnyRecord, AppIcon, AppTheme, IJSX, StyledComponentProps, Theme, useCompositionStyles, useTheme } from '@codeleap/styles'

export * from './styles'
export * from './types'

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
    style,
    itemProps,
    controlLeftIconName,
    controlRightIconName,
    leftArrowButtonProps,
    rightArrowButtonProps,
    abbreviationSymbol,
    isMobile,
    ...paginationProps
  } = allProps

  const theme = useTheme(store => store?.current) as AppTheme<Theme>

  const { boundaries = 2 } = paginationProps

  const query = theme?.media?.down('tabletSmall' as never)

  const _isMobile = useMediaQuery(query)
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

  const styles = useStylesFor(PaginationButtons.styleRegistryName, style)

  const compositionStyles = useCompositionStyles(['button', 'arrowLeftButton', 'arrowRightButton'], styles)

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
    <View style={styles.wrapper}>
      {displayLeftArrow ? (
        <Button
          icon={controlLeftIconName}
          onPress={() => onPressItem({ item: null, isArrowLeft: true, isArrowRight: false })}
          {...leftArrowButtonProps}
          style={compositionStyles.arrowLeftButton}
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
            onPress={() => onPressItem({ item, isArrowLeft: false, isArrowRight: false })}
            disabled={disabled}
            {...itemProps}
            style={compositionStyles.button}
          />
        )

      })}

      {displayRightArrow ? (
        <Button
          icon={controlRightIconName}
          onPress={() => onPressItem({ item: null, isArrowLeft: false, isArrowRight: true })}
          {...rightArrowButtonProps}
          style={compositionStyles.arrowRightButton}
        />
      ) : null}
    </View>
  )
}

PaginationButtons.styleRegistryName = 'PaginationButtons'
PaginationButtons.elements = ['wrapper', 'button', 'arrowLeftButton', 'arrowRightButton']
PaginationButtons.rootElement = 'wrapper'

PaginationButtons.withVariantTypes = <S extends AnyRecord>(styles: S) => {
  return PaginationButtons as (props: StyledComponentProps<PaginationButtonsProps, typeof styles>) => IJSX
}

PaginationButtons.defaultProps = {
  shouldAbbreviate: true,
  displayLeftArrow: true,
  displayRightArrow: true,
  disabled: false,
  isMobile: null,
  abbreviationSymbol: '...',
  controlLeftIconName: 'chevron-left' as AppIcon,
  controlRightIconName: 'chevron-right' as AppIcon,
} as Partial<PaginationButtonsProps>

WebStyleRegistry.registerComponent(PaginationButtons)
