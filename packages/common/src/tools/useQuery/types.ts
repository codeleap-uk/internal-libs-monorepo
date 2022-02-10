import { CancellablePromise, FunctionType } from '../../types'

export const queryStatuses = ['error', 'success', 'idle', 'loading'] as const

export type QueryStatus = typeof queryStatuses[number];

export type StatusBooleanKeys = `is${Capitalize<QueryStatus>}`;

export type RouteArgs<T, Err> = {
  currentValue: T;
  setState: (to: T) => void;
  throwError: (error: Err) => void;
};

export type RoutesOf<T, Err> = Record<
  string,
  FunctionType<[RouteArgs<T, Err>, any], CancellablePromise<any>>
>;

export type AlwaysPromise<T> = T extends Promise<any>
  ? T
  : CancellablePromise<T>;

export type UseApiArgs<T, R> = {
  initialState: T;
  routes: R;
};

export type CallableQuery<R, T> = R extends (
  routeArgs: RouteArgs<T, any>,
  ...params: infer A
) => ReturnType<RoutesOf<T, any>[string]>
  ? (...params: A) => AlwaysPromise<ReturnType<R>>
  : () => void;

export type QueryState<Err> = {
  status: QueryStatus;
  error?: Err;
} & Record<StatusBooleanKeys, boolean>;

export type QueryControllers<T, R> = {
  send: CallableQuery<R, T>;
  abort(): void;
};

export type Query<
  T,
  Err,
  R extends RoutesOf<T, Err>[string]
> = QueryState<Err> & QueryControllers<T, R>;

export type UseApiState<T> = {
  data: T;
  loading: boolean;
  hasError?: boolean;
};

export type UseApiReturn<
  T,
  Err,
  R extends RoutesOf<T, Err>
> = UseApiState<T> & {
  queries: {
    [Property in keyof R]: Query<T, Err, R[Property]>;
  };
};
