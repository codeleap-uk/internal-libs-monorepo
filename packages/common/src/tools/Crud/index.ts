import {
  useQuery,
  useMutation,
  useQueryClient,
  InfiniteData,
  useInfiniteQuery,
} from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import {isArray, isNumber} from '../../utils/typeGuards'

export type PaginationResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

type CreateOptions = {
  appendTo?: 'start' | 'end' |  [number , number];
  optimistic?: boolean;
  
}

type UpdateOptions = {
  
  optimistic?: boolean;
  
}


type AsyncReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => Promise<infer R> ? R : any;

export type QueryManagerOptions<T extends QueryManagerItem, ExtraArgs = any> = {
  name: string;
  queryClient: ReturnType<typeof useQueryClient>;
  
  listItems?: (limit: number, offset: number, args?: ExtraArgs) => Promise<PaginationResponse<T>>;
  createItem?: (data: Partial<T>, args?: ExtraArgs) => Promise<T>;
  updateItem?: (data: Partial<T>, args?: ExtraArgs) => Promise<T>;
  deleteItem?: (data: T, args?: ExtraArgs) => Promise<T>;
  retrieveItem?: (id: T['id']) => Promise<T>;
  limit?: number;
  creation?: CreateOptions;
  update?: UpdateOptions;
  deletion?: UpdateOptions;
  generateId?: () => T['id'];
}

type InfinitePaginationData<T> = InfiniteData<PaginationResponse<T>>
export type QueryManagerItem = {
  id: string | number;
}

export type AppendToPaginationParams<TItem = any> = {
  item: TItem|TItem[], 
  to?: CreateOptions['appendTo'], 
}
export type AppendToPaginationReturn<TItem = any> = InfiniteData<TItem>

export type AppendToPagination<TItem = any> = (params: AppendToPaginationParams<TItem>) => AppendToPaginationReturn<PaginationResponse<TItem>>

type MutationCtx<T extends QueryManagerItem> = {
  previousData?: InfinitePaginationData<T>;
  addedId?: T['id'];
  previousItem?: T;
  prevItemPage?: [number, number];
}

const isInfiniteQueryData = <T>(data: any): data is InfinitePaginationData<T> => {
  return !!data?.pages && !!data?.pageParams
}

type QueryStateValue<T extends QueryManagerItem> = {
  itemMap: Record<T['id'], T>
  itemList: T[];
  pagesById: Record<T['id'], [number,number]>;
  itemIndexes: Record<T['id'], number>
}

type QueryStateSubscriber<T extends QueryManagerItem> = (data: QueryStateValue<T>) => void


class QueryState<T extends QueryManagerItem> {
  itemMap: QueryStateValue<T>['itemMap'];
  itemList: QueryStateValue<T>['itemList'];
  pagesById: QueryStateValue<T>['pagesById'];
  itemIndexes: QueryStateValue<T>['itemIndexes'];

  subscribers: QueryStateSubscriber<T>[] = [];
  
  getItemFallback?: (itemId: T['id']) => Promise<T>;
  setData?: (updater: (old: InfinitePaginationData<T>) => InfinitePaginationData<T>) => InfinitePaginationData<T>;

  constructor(){
    // @ts-ignore
    this.itemMap = {};

    // @ts-ignore
    this.pagesById = {};

    // @ts-ignore
    this.itemIndexes = {};
  }

  get currentState(){
    return {
      itemMap: this.itemMap,
      pagesById: this.pagesById,
      itemList: this.itemList,
      itemIndexes: this.itemIndexes,
    }
  }
  
  async updateItems(data: T|T[]|InfinitePaginationData<T>) {
    const pagesById = {} as Record<T['id'], [number,number]>
    const flatItems = [] as T[]
    const itemIndexes = {} as Record<T['id'], number>
    const itemMap = {} as Record<T['id'], T> 
    
    
    if(isInfiniteQueryData<T>(data)){
      let pageIdx = 0
      
      for (const page of data.pages) {

        page.results.forEach((i, itemIdx) => {
          const flatIdx = flatItems.length
          const itemId = i.id
  
          let include = true
  
          if (include) {
            flatItems.push(i)
          }
          pagesById[itemId] = [pageIdx, itemIdx]
          itemMap[itemId] = i
          itemIndexes[itemId] = flatIdx
        })
        pageIdx += 1
      }

      this.itemList = flatItems;
      this.itemMap = {...this.itemMap,...itemMap};
      this.pagesById = {...this.pagesById, ...pagesById};
      this.itemIndexes = {...this.itemIndexes, ...itemIndexes};
      this.notifySubscribers();
      return this.currentState
    }

    if(isArray(data)){
      data.forEach((i) => {
        const itemId = i.id
        itemMap[itemId] = i

        if(isNumber(this.itemIndexes[itemId])){
          const itemIdx = this.itemIndexes[itemId]
          this.itemList[itemIdx] = i
        }

      })
      this.notifySubscribers();
      return this.currentState
    }

    const itemId = data.id
    itemMap[itemId] = data
    if(isNumber(this.itemIndexes[itemId])){
      const itemIdx = this.itemIndexes[itemId]
      this.itemList[itemIdx] = data
    }
    this.notifySubscribers();
    return this.currentState
  }


  async getItem(itemId: T['id'], attemptFetch = true) {
    const i = this.itemMap[itemId]

    if(!i && !!this.getItemFallback && attemptFetch){
      const item = await this.getItemFallback(itemId);
      this.updateItems(item);
      return item;
    }
    return i;
  }

  addItem: AppendToPagination<T> = (args) => {

    if(!this.setData) return
   
    const newData = this.setData((old) => {
      const itemsToAppend = isArray(args.item) ? args.item : [args.item]
      if (args.to == 'end') {
        const idx = old.pages.length - 1
        old.pages[idx].results.push(...itemsToAppend)

        // @ts-ignore
        old.pageParams[idx].limit += itemsToAppend.length

      } else if(args.to === 'start') {
        old.pages[0].results.unshift(...itemsToAppend)
        // @ts-ignore
        old.pageParams[0].limit += itemsToAppend.length

      }

      if(isArray(args.to)){
        const [pageIdx, itemIdx] = args.to;
        old.pages[pageIdx].results.splice(itemIdx, 0, ...itemsToAppend)
        // @ts-ignore
        old.pageParams[pageIdx].limit += itemsToAppend.length 
      }
      return old
    })
    this.updateItems(newData);

    return newData
  }

  removeItem(itemId: T['id']) {
    if(!this.setData) return
    const newData =  this.setData((old) => {
      const [itemPage, itemIdx] = this.pagesById[itemId]
      old.pages[itemPage].results.splice(itemIdx, 1)
      // @ts-ignore
      old.pageParams[itemPage].limit -= 1
      return old
    })
    this.updateItems(newData);
    return newData
  }

  updateItem(itemId: T['id'], item: T) {
    if(!this.setData) return
    const newData = this.setData((old) => {
      const [itemPage, itemIdx] = this.pagesById[itemId]
      old.pages[itemPage].results[itemIdx] = item
      return old
    })
    this.updateItems(newData);
    return newData
  }

  notifySubscribers() {
    this.subscribers.forEach((cb) => cb(this.currentState))
  }

  setItem(itemId: T['id'], item: T) {

  }

  subscribe(cb: QueryStateSubscriber<T>) {
    this.subscribers.push(cb);

    return () => {
      this.subscribers = this.subscribers.filter((c) => c !== cb);
    }
  }

}

export class QueryManager<T extends QueryManagerItem, ExtraArgs = any> {
  options: QueryManagerOptions<T>;
  state: QueryState<T> = new QueryState<T>();

  constructor(options: QueryManagerOptions<T, ExtraArgs>) {
    this.options = options;

    this.state.getItemFallback = this.options.retrieveItem;

    this.state.setData = (updater) => {
      return this.queryClient.setQueryData(this.queryKeys.list, updater)
    }
  }

  get keySuffixes() {
    return {
      list: 'list',
      infiniteList: 'infinite-list',
      create: 'create',
      update: 'update',
      delete: 'delete',
      retrieve: 'retrieve',
    }
  }

  generateId() {
    return this.options.generateId?.() ?? Date.now().toString();

  }



  get queryKeys(){ 
    return {
      list: [this.name, this.keySuffixes.list],
      // infiniteList: [this.name, this.keySuffixes.infiniteList],
      create: [this.name, this.keySuffixes.create],
      update: [this.name, this.keySuffixes.update],
      delete: [this.name, this.keySuffixes.delete],
      retrieve: [this.name, this.keySuffixes.retrieve],

    }
  }

  
  get name() {
    return this.options.name;
  }
  
  get standardLimit(){
    return this.options.limit ?? 10;
  }

  get queryClient() {
    return this.options.queryClient;
  }
  
  queryKeyFor(itemId: T['id']){
    return [this.name, this.keySuffixes.retrieve, itemId];
  }

  useList(args?: ExtraArgs) {
    const [transformedData, setTransformedData] = useState<AsyncReturnType<typeof this.state.updateItems>>({
      itemList: this.state.itemList,
      itemMap: this.state.itemMap,
      pagesById: this.state.pagesById,
      itemIndexes: this.state.itemIndexes,
    })
   

    const query = useInfiniteQuery({
      queryKey: this.queryKeys.list,
      initialData: {
        pageParams: [
          {
            limit: this.standardLimit,
            offset: 0,
          },
        ],
        pages: [],
      },
      queryFn: async (query) => {
        
        return this.options.listItems(this.standardLimit, query.pageParam?.offset??0, args);
      },
      refetchOnMount: (query) => {
        return query.state.dataUpdateCount === 0 || query.isStaleByTime()
      },
      getNextPageParam: (lastPage,pages) => {
        const currentTotal = pages.reduce((acc, p) => p.results.length + acc, 0)

        if (currentTotal >= (lastPage?.count || Infinity)) {
          return undefined
        }
        return {
          limit: this.standardLimit,
          offset: currentTotal,
        }
      },

      onSuccess: async (data) => {
        const result = await this.state.updateItems(data);
      },
      keepPreviousData: true,
    });

    useEffect(() => {
      return this.state.subscribe((data) => {
        setTransformedData(data);
      })
    })

    return {
      items: transformedData.itemList,
      query,
      getNextPage: query.fetchNextPage,
      getPreviousPage: query.fetchPreviousPage,
      
    }
  }

  useRetrieve(itemId: T['id']) {
    const query = useQuery({
      queryKey: this.queryKeyFor(itemId),
      queryFn: () => { 
        return this.options.retrieveItem(itemId);
      }
    });

    return [query.data, query.refetch, query] as const
  }

  useItem(itemId: T['id']) {
    return this.useRetrieve(itemId);
  }

  useCreate(options?: CreateOptions) {

    const tmpOptions = useRef<CreateOptions>(options ?? this.options.creation ?? {
      appendTo: 'start',
      optimistic: false,
    })

    const query = useMutation({
      mutationKey: [this.name, this.keySuffixes.create],
      mutationFn: (data: Partial<T>) => {
        return this.options.createItem(data);
      },
    
      onMutate: async (data) => {
        if(tmpOptions?.current?.optimistic){
          await this.queryClient.cancelQueries({ queryKey: this.queryKeys.list })
          const addedItem = {
            id: this.generateId(),
            ...data
          } as T

          const addedId = addedItem.id;

          this.state.addItem({
            item: addedItem,
            to: this.options.creation?.appendTo || 'start'
          })

          return {
            // previousData,
            addedId
          }
        }
      },
      onError: (error, data, ctx: MutationCtx<T>) => {
        const isOptimistic = tmpOptions.current?.optimistic
        
        if(isOptimistic){
          this.state.removeItem(ctx.addedId);
        }
      },
      onSuccess: (data) => {
        if(!tmpOptions.current?.optimistic){
          this.state.addItem({
            item: data,
            to: this.options.creation?.appendTo || 'start'
          })
          this.state.updateItems(data);
        }else{
          this.state.updateItem(data.id, data);
        }
      }
    });

    const createItem = (data: Partial<T>, options?: CreateOptions) =>  {
      const prevOptions = tmpOptions.current;
      if(!!options){
  
        tmpOptions.current = options;
      }

      const res = query.mutateAsync(data);
      if(!!options){
        tmpOptions.current = prevOptions;
      }

      return res;
    };

    return {
      item: query.data,
      create: createItem,
      query,
    }
  }

  useUpdate(options?: UpdateOptions) {
    const tmpOptions = useRef<UpdateOptions>(options ?? this.options.update ?? {
      optimistic: false,
    })

    const query = useMutation({
      mutationKey: this.queryKeys.update,
      onMutate: async (data) => {
        if(tmpOptions.current?.optimistic){
          
          const prevItem = await this.state.getItem(data.id, false)

          if(!prevItem) return

          this.state.updateItem(data.id, {
            ...prevItem,
            ...data
          });

          return {
            previousItem: prevItem,
          } as MutationCtx<T>
        }
      },
      onError: (error, data, ctx: MutationCtx<T>) => {
        if(tmpOptions.current?.optimistic && !!ctx?.previousItem?.id){
          this.state.updateItem(ctx.previousItem.id, ctx.previousItem);
        }
      },
      mutationFn: (data: Partial<T>) => {
        return this.options.updateItem(data);
      },
      onSuccess: (data) => {
        
        this.state.updateItems(data);
        
      }
    });

    const update = (data: Partial<T>, options?: UpdateOptions) => {
      const prevOptions = tmpOptions.current;
      if(!!options){
  
        tmpOptions.current = options;
      }

      const res = query.mutateAsync(data);
      if(!!options){
        tmpOptions.current = prevOptions;
      }

      return res;
    }

    return{
      update,
      query,
      item: query.data,
    }
  }

  useDelete(options?: UpdateOptions) {

    const tmpOptions = useRef<UpdateOptions>(options ?? this.options?.deletion ?? {
      optimistic: false,
    }) 
    const query = useMutation({
      mutationKey: this.queryKeys.delete,

      onMutate: async (data) => {
        if(tmpOptions.current?.optimistic) {
          const prevItem = await this.state.getItem(data.id, false)
          const prevItemPage = this.state.pagesById[data.id]
  
          if(!prevItem) return
  
          this.state.removeItem(data.id);
  
          return {
            previousItem: prevItem,
            prevItemPage
          } as MutationCtx<T>
          
        }
      },
      mutationFn: (data: T) => {
        return this.options.deleteItem(data);      
      },
      onError: (error, data, ctx: MutationCtx<T>)  => {
        if(!!ctx?.previousItem?.id && tmpOptions.current?.optimistic){
          this.state.addItem({
            item: ctx.previousItem,
            to: ctx.prevItemPage,

          })
        }
      },
      onSuccess: (data) => {
        if(!tmpOptions.current?.optimistic){
          this.state.removeItem(data.id);
        }
      },

    });

    const _delete = (data: T, options?: UpdateOptions) => {
      const prevOptions = tmpOptions.current;
      if(!!options){

        tmpOptions.current = options;
      }

      const res = query.mutateAsync(data);
      if(!!options){
        tmpOptions.current = prevOptions;
      }

      return res;
    }

    return  {
      delete: _delete,
      query,
    }
  }


  refreshItem(itemId: T['id']) {
    this.queryClient.invalidateQueries(this.queryKeyFor(itemId));
  }

  setItem(item: T) {
    this.state.updateItems(item);

    // @ts-ignore
    const key = this.options.keyExtractor?.(item) ?? item.id;

    this.queryClient.setQueryData(this.queryKeyFor(key), item);
  }

  use(){
    const list = this.useList();
    const create = this.useCreate();
    const update = this.useUpdate();
    const del = this.useDelete();

    return {
      items: list.items,
      list,
      create: create.create,
      update: update.update,
      delete: del.delete,
      getNextPage: list.getNextPage,
      getPreviousPage: list.getPreviousPage,
      refreshItem: this.refreshItem.bind(this),
      setItem: this.setItem.bind(this),
    }
  }



}

