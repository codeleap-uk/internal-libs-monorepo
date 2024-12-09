import { useMemo, useUncontrolled } from '@codeleap/hooks'
import { range } from '@codeleap/utils'

export type PaginationParams = {
  initialPage?: number
  page?: number
  total: number
  boundaries?: number
  onChangePage?: (page: number) => void
  shouldAbbreviate?: boolean
  abbreviationMinimumAmount?: number
  displayLeftArrow?: boolean
  displayRightArrow?: boolean
  isMobile?: boolean
  abbreviationSymbol?: any
}

export function usePagination(props: PaginationParams) {

  const { isMobile } = props

  const {
    total,
    boundaries = 2,
    initialPage = 1,
    page,
    onChangePage,
    shouldAbbreviate = true,
    abbreviationMinimumAmount = isMobile ? 5 : 10,
    displayLeftArrow = true,
    displayRightArrow = true,
    abbreviationSymbol,
  } = props

  const [activePage, setActivePage] = useUncontrolled({
    value: page,
    onChange: onChangePage,
    defaultValue: initialPage,
    finalValue: initialPage,
    rule: (_page) => typeof _page === 'number' && _page <= total,
  })

  const _boundaries = isMobile ? 2 : boundaries

  const canAbreviateItems = (shouldAbbreviate || isMobile) && total > abbreviationMinimumAmount
  const displayLastNumbers = activePage + _boundaries + (isMobile ? 0 : 2) >= total
  const isCenterSelected = canAbreviateItems && activePage > _boundaries && !displayLastNumbers

  const dotsDisplay = isCenterSelected ? abbreviationSymbol : null

  const setPage = (pageNumber: number) => {

    const isPreviousArrow = pageNumber === 0
    const isNextArrow = pageNumber === total + 1

    const nonSelectableItems = [
      displayLeftArrow && isPreviousArrow,
      displayRightArrow && isNextArrow,
    ].some(x => x)

    if (nonSelectableItems) return activePage

    setActivePage(pageNumber)
  }

  const next = () => setPage(activePage + 1)
  const previous = () => setPage(activePage - 1)
  const first = () => setPage(1)
  const last = () => setPage(total)

  const status = useMemo(() => {
    if (isCenterSelected) {
      return 'abreviated'
    }

    if (displayLastNumbers) {
      return 'end'
    }

    return 'initial'
  }, [isCenterSelected, displayLastNumbers])

  const paginationRange = useMemo((): (number | string | '...')[] => {

    if (!canAbreviateItems) {
      return [
        ...range(1, total),
      ].filter(Boolean)
    }

    if (displayLastNumbers) {

      const extraItems = [
        1,
        abbreviationSymbol,
      ]

      return [
        ...extraItems,
        ...range(total - (_boundaries + extraItems?.length - (isMobile ? 2 : 0)), total),
      ].filter(Boolean)
    }

    return [
      ...range(1, isCenterSelected ? _boundaries - 1 : _boundaries),
      dotsDisplay,
      isCenterSelected ? activePage : abbreviationSymbol,
      dotsDisplay,
      ...range(total - _boundaries + (isCenterSelected ? 2 : 1), total),
    ].filter(Boolean)

  }, [total, activePage, displayLastNumbers, isCenterSelected, canAbreviateItems])

  return {
    range: paginationRange,
    page: Number(activePage),
    setPage,
    status,
    next,
    previous,
    first,
    last,
  }
}
