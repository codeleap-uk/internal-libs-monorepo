import { memoBy } from '@codeleap/utils'
import { PageProps } from './types' 
import { TypeGuards } from '@codeleap/types'

type PagerItemComponentProps = PageProps<any> & {
  renderItem: (props: any) => React.ReactElement
}

function PagerItemComponent(props: PagerItemComponentProps) {
  const { item, renderItem: RenderItem, ...info } = props

  if (TypeGuards.isFunction(item)) {
    const ItemComponent = item
    return <ItemComponent {...info} />
  }

  return <RenderItem {...info} item={item} />
}

export const PagerItem = memoBy(PagerItemComponent, ['renderItem', 'item'])