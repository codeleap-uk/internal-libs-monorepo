import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query'

type PaginationResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

type CreateOptions = {
  appendTo: 'start' | 'end';
  optimistic?: boolean;
}

type QueryManagerOptions<T, ExtraArgs = any> = {
  name: string;
  queryClient: ReturnType<typeof useQueryClient>;
  keyExtractor?: (data: Partial<T>) => string;
  listItems?: (limit: number, offset: number, args?: ExtraArgs) => Promise<PaginationResponse<T>>;
  createItem?: (data: Partial<T>, args?: ExtraArgs) => Promise<T>;
  updateItem?: (data: Partial<T>, args?: ExtraArgs) => Promise<T>;
  deleteItem?: (data: Partial<T>, args?: ExtraArgs) => Promise<T>;
  retrieveItem?: (id: string) => Promise<T>;
  limit?: number;
  createOptions?: CreateOptions;
}

export class QueryManager<T, ExtraArgs = any> {
  options: QueryManagerOptions<T>;
  itemMap: Record<string, T> = {};
  itemList: T[] = [];

  constructor(options: QueryManagerOptions<T>) {
    this.options = options;
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

  private async _updateItems(...entries: Partial<T>[]){
    for(const entry of entries){
      // @ts-ignore
      const defaultId = entry?.id

      const key = this.options.keyExtractor?.(entry) ?? defaultId;

      this.itemMap[key] = entry as T;
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
  
  queryKeyFor(itemId: string){
    return [this.name, this.keySuffixes.retrieve, itemId];
  }

  useList(args?: ExtraArgs) {

    const query = useInfiniteQuery({
      queryKey: [this.name, this.keySuffixes.list],
      queryFn: async () => {
        return this.options.listItems(this.standardLimit, 0, args);
      },
      onSuccess: (data) => {
        data.pages.forEach((page) => {
          this._updateItems(...page.results)
        })
      }
    });

    const itemList = query.data?.pages.flatMap((page) => page.results) ?? [];

    this.itemList = itemList;

    return [itemList, query.refetch, query];
  }

  useRetrieve(itemId: string) {
    const query = useQuery({
      queryKey: this.queryKeyFor(itemId),
      queryFn: () => { 
        return this.options.retrieveItem(itemId);
      }
    });

    return [query.data, query.refetch, query];
  }

  useCreate() {
    const query = useMutation({
      mutationKey: [this.name, this.keySuffixes.create],
      mutationFn: (data: Partial<T>) => {
        return this.options.createItem(data);
      },
      onMutate: (data) => {
        if(this.options?.createOptions?.optimistic){
          this._updateItems(data);
        }
      },
      onSuccess: (data) => {
        this._updateItems(data);
      }
    });

    const createItem = (data: Partial<T>, options: CreateOptions) =>  {
      return query.mutateAsync(data);
    };

    return [query.data, createItem, query];
  }

  useUpdate() {
    const query = useMutation({
      mutationKey: [this.name, this.keySuffixes.update],
      mutationFn: (data: Partial<T>) => {
        return this.options.updateItem(data);
      },
      onSuccess: (data) => {
        this._updateItems(data);
      }
    });

    return [query, query.mutateAsync, query];
  }

  useDelete() {
    const query = useMutation({
      mutationKey: [this.name, this.keySuffixes.delete],
      mutationFn: (data: Partial<T>) => {
        return this.options.deleteItem(data);      
      }
    });

    return  [query.mutateAsync, query];
  }

  getItem(itemId: string) {
    return this.itemMap[itemId];
  }

  refreshItem(itemId: string) {
    this.queryClient.invalidateQueries(this.queryKeyFor(itemId));
  }

  setItem(item: T) {
    this._updateItems(item);

    // @ts-ignore
    const key = this.options.keyExtractor?.(item) ?? item.id;

    this.queryClient.setQueryData(this.queryKeyFor(key), item);
  }


}

