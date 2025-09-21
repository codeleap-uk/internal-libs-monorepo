import { QueryManager } from './lib'
import { QueryItem, QueryManagerOptions } from './types'

export const createQueryManager = <T extends QueryItem, F>(options: QueryManagerOptions<T, F>) => {
  return new QueryManager<T, F>(options)
}
