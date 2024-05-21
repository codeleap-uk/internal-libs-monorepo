import { onUpdate, range, useCodeleapContext, useMemo, useState, useUncontrolled } from '@codeleap/common'
import { useMediaQuery } from './useMediaQuery'

const DOTS = '...'

export type PaginationParams = {
  initialPage?: number
  page?: number
  total: number
  boundaries?: number
  onChangePage?: (page: number) => void
  shouldAbreviate?: boolean
  abreviationMinimumAmount?: number
  displayLeftArrow?: boolean
  displayRightArrow?: boolean
}

export function usePagination(props: PaginationParams) {

  const { Theme } = useCodeleapContext()

  const query = Theme.media.down('tabletSmall')
  const isMobile = useMediaQuery(query, { getInitialValueInEffect: false })

  const {
    total,
    boundaries = 2,
    initialPage = 1,
    page,
    onChangePage,
    shouldAbreviate = true,
    abreviationMinimumAmount = isMobile ? 5 : 10,
    displayLeftArrow = true,
    displayRightArrow = true,
  } = props

  const [activePage, setActivePage] = useUncontrolled({
    value: page,
    onChange: onChangePage,
    defaultValue: initialPage,
    finalValue: initialPage,
    rule: (_page) => typeof _page === 'number' && _page <= total,
  })

  const [status, setStatus] = useState('initial')

  const _boundaries = isMobile ? 2 : boundaries

  const leftArrowDisplay = displayLeftArrow ? 'arrow' : null
  const rightArrowDisplay = displayRightArrow ? 'arrow' : null
  const arrowsAmount = !leftArrowDisplay || !rightArrowDisplay ? 1 : 2

  const canAbreviateItems = (shouldAbreviate || isMobile) && total > abreviationMinimumAmount
  const displayLastNumbers = activePage + _boundaries + arrowsAmount + (isMobile ? 0 : 2) > total
  const isCenterSelected = canAbreviateItems && activePage > _boundaries && !displayLastNumbers

  const dotsDisplay = isCenterSelected ? DOTS : null

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

  onUpdate(() => {

    if (isCenterSelected) {
      return setStatus('abreviated')
    }

    if (displayLastNumbers) {
      return setStatus('end')
    }

    if (status !== 'initial') {
      setStatus('initial')
    }

  }, [activePage, isCenterSelected, displayLastNumbers])

  const paginationRange = useMemo((): (number | string | '...')[] => {

    if (!canAbreviateItems) {
      return [
        leftArrowDisplay,
        ...range(1, total),
        rightArrowDisplay,
      ].filter(Boolean)
    }

    if (displayLastNumbers) {

      const extraItems = [
        leftArrowDisplay,
        1,
        DOTS,
      ]

      return [
        ...extraItems,
        ...range(total - (_boundaries + extraItems?.length - 2), total + (displayRightArrow ? 1 : 0)),
      ].filter(Boolean)
    }

    return [
      leftArrowDisplay,
      ...range(1, isCenterSelected ? _boundaries - 1 : _boundaries),
      dotsDisplay,
      isCenterSelected ? activePage : DOTS,
      dotsDisplay,
      ...range(total - _boundaries + (isCenterSelected ? 2 : 1), total),
      rightArrowDisplay,
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
