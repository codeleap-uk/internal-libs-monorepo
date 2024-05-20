import { range, useMemo, useUncontrolled } from '@codeleap/common'

export const DOTS = '...'

export interface PaginationParams {
  initialPage?: number
  page?: number
  total: number
  siblings?: number
  boundaries?: number
  onChange?: (page: number) => void
  shouldAbreviate?: boolean
  abreviationMinimumAmount?: number
}

export function usePagination(props: PaginationParams) {

  const {
    total,
    siblings = 1,
    boundaries = 1,
    page,
    initialPage = 1,
    onChange,
    shouldAbreviate,
    abreviationMinimumAmount = 10,
  } = props

  const [activePage, setActivePage] = useUncontrolled({
    value: page,
    onChange,
    defaultValue: initialPage,
    finalValue: initialPage,
    rule: (_page) => typeof _page === 'number' && _page <= total,
  })

  const setPage = (pageNumber: number) => {
    if (pageNumber <= 0) {
      setActivePage(1)
    } else if (pageNumber > total) {
      setActivePage(total)
    } else {
      setActivePage(pageNumber)
    }
  }

  const next = () => setPage(activePage + 1)
  const previous = () => setPage(activePage - 1)
  const first = () => setPage(1)
  const last = () => setPage(total)

  const shouldAbreviateNumbers = shouldAbreviate && activePage > 2
  const lastNumbersDisplayed = shouldAbreviateNumbers ? activePage + boundaries + 2 >= total : false

  const paginationRange = useMemo((): (number | 'dots')[] => {

    if (total <= abreviationMinimumAmount) {
      return [
        'arrow',
        ...range(1, total),
        'arrow',
      ]
    }

    if (lastNumbersDisplayed) {
      return [
        ...range(total - (boundaries + 3), total + 1), // boundaries + 3 seria 2 arrows mais o 1ali de cima
      ]
    }

    return [
      'arrow',
      ...range(1, boundaries),
      shouldAbreviateNumbers ? activePage : DOTS,
      ...range(total - boundaries + 1, total),
      'arrow',
    ]
  }, [total, siblings, activePage, lastNumbersDisplayed, shouldAbreviateNumbers])

  return {
    range: paginationRange,
    active: activePage,
    lastNumbersDisplayed,
    setPage,
    next,
    previous,
    first,
    last,
  }
}
