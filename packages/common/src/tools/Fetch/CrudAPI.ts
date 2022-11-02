import { TypeGuards } from '../../utils'
import { RequestClient } from './RequestClient'

export type PaginatorQuery = {
    limit?: number
    offset?: number
}

export type PaginatorResult<T =any> = {
    results: T[]
    count: number
    next: string | null
    previous: string | null
}

type AnyFunction = (...args:any[]) => any

type BaseCrudViews<T> = {
    list: (query?: PaginatorQuery) => Promise<PaginatorResult<T>>
    create: (args?: Partial<T>) => Promise<T>

    update: (args?:Partial<T>) => Promise<T>
    remove: (args?:Partial<T>) => Promise<T>

    retrieve: (id?:string|number) => Promise<T>
}

type BaseCrudViewsLax = {
    list: (...args:any[]) => any
    create: (...args:any[]) => any

    update: (...args:any[]) => any
    remove: (...args:any[]) => any

    retrieve: (...args:any[]) => any
} & Record<string, AnyFunction>

type CrudViews<T, Override> = Omit<BaseCrudViews<T>, keyof Override> & Override

type PartialViews = Readonly<
    Partial<
        BaseCrudViewsLax
    >
>
type CrudAPIReturn<
    Model,
    Options extends CrudAPIOptions<Model>,
    TOverride = Options['override'] extends AnyFunction ? ReturnType<Options['override']> : Options['override']
> = CrudViews<Model, TOverride> & {
    views: CrudViews<Model, TOverride>
    apiOptions: Omit<Options, 'override'>
}

type CrudHTTPConfig = {
    url?: string
    query?: Record<string, any>

}

type CrudAPIOptions<T> = {
    client: RequestClient
    httpConfig?: Record<string, CrudHTTPConfig | ((...args:any[]) => CrudHTTPConfig)>
    keyExtractor?: (item:Partial<T>) => string | number
    override?: PartialViews | ((options: CrudAPIReturn<T, CrudAPIOptions<T>>) => PartialViews)
}

export function CrudApi<
    Model,
    Opts extends CrudAPIOptions<Model> = CrudAPIOptions<Model>,

>(model: Model, options: Opts):CrudAPIReturn<Model, Opts> {
  const {
    override = {},
    client,
    keyExtractor,
    httpConfig,
  } = (options || {})

  const useHTTPConfig = (key:string, ...args: any[]) => {
    const conf = httpConfig?.[key]
    if (!conf) return null

    if (TypeGuards.isFunction(conf)) {
      return conf(...args)
    }

    return conf
  }

  let views = {
    async list(query?: PaginatorQuery): Promise<PaginatorResult<Model>> {

      const res = await client.get<PaginatorResult<Model>>('', {
        params: query,
      })

      return res.data
    },

    async create(args?: Partial<Model>): Promise<Model> {
      const res = await client.post<Model>('', args)

      return res.data
    },

    async update(args?:Partial<Model>): Promise<Model> {
      const { url, query } = useHTTPConfig('update', args) || {
        url: keyExtractor(args) + '/',
        query: {},
      }

      const res = await client.patch<Model>(url, args, {
        params: query,
      })

      return res.data
    },

    async remove(args?:Model): Promise<Model> {
      const { url, query } = useHTTPConfig('remove', args) || {
        url: keyExtractor(args) + '/',
        query: {},
      }
      await client.delete(url, {
        params: query,
      })

      return args
    },

    async retrieve(id: string | number): Promise<Model> {
      const { url, query } = useHTTPConfig('retrieve', id) || {
        url: id + '/',
        query: {},
      }
      const res = await client.get<Model>(url, {
        params: query,
      })

      return res.data
    },

  }

  if (typeof override === 'function') {
    // @ts-ignore
    const overrideViews = override({
      ...views,
      views,
      apiOptions: options,
    }) || {}
    views = {
      ...views,
      ...overrideViews,
    }
  } else if (typeof override === 'object') {
    views = {
      ...views,
      ...override,
    }
  }

  return {
    ...views,
    views,
    apiOptions: options,
  } as CrudAPIReturn<Model, Opts>

}
