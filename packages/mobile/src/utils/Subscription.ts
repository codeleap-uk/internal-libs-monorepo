import React from 'react'

export type Subscriber<T> =  (e: T) => any

type SubscriptionRecord = Record<string, Subscription<any>>

type MultiSubscriptor<T extends SubscriptionRecord> = <K extends keyof T>(
  e: K,
  key: string,
  cb: Subscriber<T[K] extends Subscription<infer ET> ? ET : never>
) => () => void

class Subscription<T, K extends string = string> {
  public subscribers: Record<K, Subscriber<T>> = {} as Record<K, Subscriber<T>>

  private _history: T[] = []

  get history(){
    return Object.freeze(this._history)
  }

  subscribe(key: K, cb: Subscriber<T>) {
    this.subscribers[key] = cb

    return () => {
      delete this.subscribers[key]
    }
  }

  getSubscriber(key: K) {
    return this.subscribers[key]
  }

  removerSubscriber(key: K) {
    delete this.subscribers[key] 
  }

  getSubscribersKeys() {
    return Object.keys(this.subscribers)
  }

  invoke(e: T) {
    this._history.push(e)

    for (const subscriber in this.subscribers) {
      this.subscribers[subscriber](e)
    }
  }

  removeAllListeners(){
    this.subscribers = {} as Record<K, Subscriber<T>>
  }

  static createSubscriptor<SR extends SubscriptionRecord>(events: SR): MultiSubscriptor<SR> {
    return (e, key, cb) => {
      return events[e]!.subscribe(key, cb)
    }
  }
}

function useSubscriptionHistory<T>(subscription: Subscription<T>){
  const [state, setState] = React.useState(subscription.history)

  React.useEffect(() => {
    return subscription.subscribe('subscription-history', e => {
      setState([...state, e])
    })
  }, [])

  return state
}

export { Subscription, useSubscriptionHistory }
