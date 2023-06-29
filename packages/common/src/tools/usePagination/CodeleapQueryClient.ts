import * as ReactQuery from '@tanstack/react-query'
import { TypeGuards } from '../../utils'
import { QueryManager, QueryManagerOptions, QueryManagerItem } from '../Crud'

type Updater<Prev, Next> = Next | ((prev: Prev) => Next)

type StaticQueryKeyClient<Data = any> = {
    key: ReactQuery.QueryKey
    getData(): Data
    refresh(): void
    setData(updater: Updater<Data, Data>): Data
  }
type QueryKeyBuilder<Args extends any[] = any[]> = (...args:Args) => ReactQuery.QueryKey

type DynamicQueryKeyClient<Data = any, BuilderParams extends any[] = any[]> = {
    key(...args: BuilderParams): ReactQuery.QueryKey
    getData(...args: BuilderParams): Data
    setData(keyParams: BuilderParams, updater: Updater<Data, Data>): Data
    refresh(...args: BuilderParams): void
  }

export class CodeleapQueryClient {
  constructor(public client: ReactQuery.QueryClient) {
  }

  queryKey<Data>(k: ReactQuery.QueryKey):StaticQueryKeyClient<Data> {

    return {
      key: k,
      getData: () => {
        return this.client.getQueryData(k) as Data
      },
      setData: (updater) => {
        const _updater = (prev:Data) => {
          if (TypeGuards.isFunction(updater)) {
            return updater(prev)
          }
          return updater
        }
        return this.client.setQueryData(k, _updater)
      },
      refresh: () => {
        return this.client.invalidateQueries({
          exact: true,
          queryKey: k,
          refetchPage: () => true,
        })
      },
    }
  }

  dynamicQueryKey<Data, BuilderArgs extends any[] = any[]>(k: QueryKeyBuilder<BuilderArgs>):DynamicQueryKeyClient<Data, BuilderArgs> {

    return {
      key: k,
      getData: (...params) => {

        return this.client.getQueryData(k(...params)) as Data
      },
      setData: (params, updater) => {
        const _updater = (prev:Data) => {
          if (TypeGuards.isFunction(updater)) {
            return updater(prev)
          }
          return updater
        }
        return this.client.setQueryData(k(...params), _updater)
      },
      refresh: (...params) => {
        return this.client.invalidateQueries({
          exact: true,
          queryKey: k(...params),
          refetchPage: () => true,
        })
      },
    }
  }

  queryManager<T extends QueryManagerItem, Args>(name:string, options: Partial<QueryManagerOptions<T, Args>>) {
    // @ts-expect-error
    const m = new QueryManager<T, Args>({
      name,
      queryClient: this.client,
      ...options,

    })

    return m
  }

}
