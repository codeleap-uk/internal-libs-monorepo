import { WritableAtom } from "nanostores";

export function arrayHandler<T extends any[]>(store: WritableAtom<T>) {
  return new Proxy([], {
    get(target, p, receiver){
      const val = store.get()
      

      const property = val[p]

      if(typeof property == 'function') {
        return (...args) => {
          // console.log('Calling ', p , ' with ', args, ' on ', val)
          
          const r =  val[p](...args)

          store.set(val)
          
          return r
        }
      }

      return property
    }
  })
}


export const arrayOps = Object.getOwnPropertyNames(Array.prototype)