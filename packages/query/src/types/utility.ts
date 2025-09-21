import { QueryItem } from './core';
import { QueryKey, useQueryClient } from '@tanstack/react-query'

export type QueryClient = ReturnType<typeof useQueryClient>

export type WithTempId<T extends QueryItem> = T & {
  tempId?: QueryItem['id']
}

export type ItemPosition = {
  pageIndex: number
  itemIndex: number
}

export type RemovedItemMap = [QueryKey, ItemPosition][]
