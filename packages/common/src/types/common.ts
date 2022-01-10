export type CancellablePromise<T> = Promise<T> & {abort?:() => void}
