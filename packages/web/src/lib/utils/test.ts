import { TypeGuards } from '@codeleap/types'

export const getTestId = (props: Record<string, any>) => {
  let id = props?.testId || props?.['data-testid'] || props?.id || props?.debugName

  if (TypeGuards.isString(id)) {
    id = id?.replace(/\s/g, '_').toLowerCase()
  }

  return id
}
