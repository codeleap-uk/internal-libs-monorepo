import * as ReactQuery from '@tanstack/react-query'
import { TypeGuards } from '../../utils'
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
export class CodeleapQueryClient extends ReactQuery.QueryClient {
  dynamicQueryKey<Data, BuilderArgs extends any[] = any[]>(k: QueryKeyBuilder<BuilderArgs>):DynamicQueryKeyClient<Data, BuilderArgs> {

    return {
      key: k,
      getData: (...params) => {

        return this.getQueryData<Data>(k(...params))
      },
      setData: (params, updater) => {
        const _updater = (prev:Data) => {
          if (TypeGuards.isFunction(updater)) {
            return updater(prev)
          }
          return updater
        }
        return this.setQueryData(k(...params), _updater)
      },
      refresh: (...params) => {
        return this.invalidateQueries({
          exact: true,
          queryKey: k(...params),
          refetchPage: () => true,
        })
      },
    }
  }

  queryKey<Data>(k: ReactQuery.QueryKey):StaticQueryKeyClient<Data> {

    return {
      key: k,
      getData: () => {
        return this.getQueryData<Data>(k)
      },
      setData: (updater) => {
        const _updater = (prev:Data) => {
          if (TypeGuards.isFunction(updater)) {
            return updater(prev)
          }
          return updater
        }
        return this.setQueryData(k, _updater)
      },
      refresh: () => {
        return this.invalidateQueries({
          exact: true,
          queryKey: k,
          refetchPage: () => true,
        })
      },
    }
  }

}
