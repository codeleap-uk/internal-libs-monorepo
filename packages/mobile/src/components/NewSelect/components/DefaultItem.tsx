import { memoBy } from '@codeleap/utils'
import { Button } from '../../Button'
import { SelectRenderItemInfo } from '../types'

export const SelectDefaultItem = <T extends string | number>(props: SelectRenderItemInfo<T>) => {
  const {
    item,
    onSelect,
    selected,
    style,
  } = props

  console.log('[RENDER] item', item, selected)

  return (
    <Button
      debugName='select:defaultItem'
      text={item?.label}
      rightIcon={selected ? 'check' as never : null as never}
      onPress={onSelect}
      style={style}
      selected={selected}
    />
  )
}

export const MemoizedSelectDefaultItem = memoBy(SelectDefaultItem, 'selected')
