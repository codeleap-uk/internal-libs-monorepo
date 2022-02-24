import type { AnyAction, Dispatch, Store } from '@reduxjs/toolkit'
import { DeepPartial, FunctionType } from '../..'

export type Reducers<S> = Record<
  string,
  FunctionType<[S, any], DeepPartial<S>>
>;

export type AsyncReducers<S> = Record<
  string,
  FunctionType<
    [S, FunctionType<[DeepPartial<S>], void>, any],
    Promise<unknown | void>
  >
>;
export type AnyRecord = any;

export type CreateSliceArgs<
  S extends AnyRecord,
  N = '',
  R extends Reducers<S> = Reducers<S>,
  AR extends AsyncReducers<S> = AsyncReducers<S>
> = {
  name: N;
  initialState: S;
  reducers: R;
  asyncReducers: AR;
};

export type BuildActions<
  S extends AnyRecord,
  R extends Reducers<S>,
  AR extends AsyncReducers<S>
> = (store: Store<any>) => {
  [Property in keyof R]: R[Property] extends (state: S, ...args: infer A) => any
    ? (...a: A) => Parameters<R[Property]>[0]
    : () => ReturnType<R[Property]>;
} & {
  [Property in keyof AR]: AR[Property] extends (
    state: S,
    setState: any,
    ...args: infer A
  ) => Promise<any>
    ? (...a: A) => ReturnType<AR[Property]>
    : () => ReturnType<AR[Property]>;
};

export type Slice<
  S extends AnyRecord,
  N extends string,
  R extends Reducers<S>,
  AR extends AsyncReducers<S>
> = {
  buildActions: BuildActions<S, R, AR>;
  name: N;
  initialState: S;
  reducer: (state: S, action: { type: string; payload: DeepPartial<S> }) => S;
};

export interface EnhancedStore<S = any> extends Store {
  getState(): S;
  dispatch: Dispatch<AnyAction>;
}

export type CreateReduxReturn<
  T extends Record<string, Slice<any, any, any, any>>,
  RootState = {
    [Property in keyof T]: T[Property]['initialState'];
  }
> = {
  store: EnhancedStore<RootState>;
  actions: {
    [Property in keyof T]: ReturnType<T[Property]['buildActions']>;
  };
};

type Post = {
  id: number;
  username: string;
  created_datetime: string;
  title: string;
  content: string;
};

type PostState = {
  posts: Post[];
  loading: boolean;
  error: {
    message: string;
  } | null;
};

// const initialState:PostState = {
//     posts: [],
//     loading: false,
//     error: null,
// }

// const s =  createSlice({
//   name: 'posts',
//   initialState,
//   reducers: {
//     pp: (state) => {
//       return state
//     },
//   },
//   asyncReducers: {
//     getData: async ( state, setState, o: string) => {
//       setState({loading: true})
//       // api.get('/')
//       //   .then(({data}) => {

//       //     setState({loading: false, posts: data.results})

//       //   }).catch(() => {

//       //     setState({
//       //       error: {
//       //         message: 'Error fetching data',
//       //       },
//       //     })

//       //   })
//     },
//   },
// })
