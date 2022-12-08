import * as ReactQuery from '@tanstack/react-query'

type StaticQueryKeyClient<Data = any> = {
    key: ReactQuery.QueryKey
    getData(): Data
    refresh(): void
  }
type QueryKeyBuilder<Args extends any[] = any[]> = (...args:Args) => ReactQuery.QueryKey

type DynamicQueryKeyClient<Data = any, BuilderParams extends any[] = any[]> = {
    key(...args: BuilderParams): ReactQuery.QueryKey
    getData(...args: BuilderParams): Data
    refresh(...args: BuilderParams): void
  }

export class CodeleapQueryClient extends ReactQuery.QueryClient {
  dynamicQueryKey<Data, BuilderArgs extends any[] = any[]>(k: QueryKeyBuilder<BuilderArgs>):DynamicQueryKeyClient<Data, BuilderArgs> {

    return {
      key: k,
      getData: (...params:BuilderArgs) => {

        return this.getQueryData<Data>(k(...params))
      },
      refresh: (...params:BuilderArgs) => {
        this.invalidateQueries({
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
      refresh: () => {
        this.invalidateQueries({
          exact: true,
          queryKey: k,
          refetchPage: () => true,
        })
      },
    }
  }

}
