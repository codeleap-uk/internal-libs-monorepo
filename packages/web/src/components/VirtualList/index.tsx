import { VirtualListContainer, VirtualListItems } from './list'
import { VirtualListProvider } from './context'
import { memo } from 'react'

export function createVirtualList<T>() {
  return {
    Provider: VirtualListProvider<T>,
    Container: memo(VirtualListContainer),
    Items: memo(VirtualListItems<T>),
  }
}
