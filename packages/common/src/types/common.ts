export type CancellablePromise<T> = Promise<T> & {abort?:() => void}

export type WebInputFile = {
    file:File
    preview: string 
  }
