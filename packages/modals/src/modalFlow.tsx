import { Modal, ModalParams } from './modal'
import { ModalFlowDefs } from './flowDefs'
import { ExcludeFromParam } from './types'

type ModalFlowOptions = {
  startsOpen?: boolean
  cycleForward?: boolean
  cycleBackward?: boolean
}

type ModalArray<P> = ReadonlyArray<Modal<P>>
type ModalFlowModalParams<T extends ModalArray<any>> = T[number] extends Modal<infer P> ? P : any
type ModalFlowResults<T extends ModalArray<any>> = T[number] extends Modal<any, infer R> ? R : any

export type ModalFlowProps<FlowID extends keyof ModalFlowDefs, P extends Record<string, any> = {}, Result = {}, F extends ModalFlow = ModalFlowDefs[FlowID]> = {
  flow?: F
  nextOrToggle?: ExcludeFromParam<F['next'], P>
  previousOrToggle?:ExcludeFromParam<F['previous'], P>
} & ModalParams<P, Result>

export class ModalFlow<T extends ModalArray<any> = [], ModalParams = ModalFlowModalParams<T>, ModalResults = ModalFlowResults<T>> {
  modals: T

  current?: Modal['id']

  options?: ModalFlowOptions = {}

  __paramsType: ModalParams

  _flowBound = false

  visibilityTracker: Record<string, boolean> = {}

  resolve: (result: ModalResults) => void

  reject: (reason: any) => void

  constructor(modals: T, options?: ModalFlowOptions) {

    this.modals = modals
    this.options = options

    this.next = this.next.bind(this)
    this.previous = this.previous.bind(this)
    this.start = this.start.bind(this)
    this.end = this.end.bind(this)
    this.close = this.close.bind(this)
    this.bindFlow = this.bindFlow.bind(this)
    this.unbindFlow = this.unbindFlow.bind(this)
    this.request = this.request.bind(this)

    this.clearRequest = this.clearRequest.bind(this)

    this.registerListeners = this.registerListeners.bind(this)
  }

  get allClosed() {
    return this.modals.every(modal => !modal.isVisible)
  }

  get hasPendingRequest() {
    console.log(this.resolve, this.reject)
    return !!this.resolve && !!this.reject
  }

  registerListeners() {

    const subscriptions = this.modals.map(modal => {
      return modal.visible.subscribe((visible, wasVisible) => {
        if (wasVisible && !visible) {
          modal.awaitTransition(2).then(() => {
            if (this.allClosed) {
              this.unbindFlow()
              subscriptions.forEach(unsub => unsub())
            }
          })
        }
      })
    })
  }

  bindFlow() {
    this._flowBound = true

    this.registerListeners()
    this.modals.forEach(modal => {
      modal.flow = this
      if (this.resolve && this.reject) {
        modal.resolve = this.resolve
        modal.reject = this.reject
      }
    })
  }

  unbindFlow() {
    this._flowBound = false

    try {
      this.modals.forEach(modal => {
        modal.flow = undefined
        modal.resetParams()
        modal.resolve = null
        modal.reject = null

      })
    } catch (error) {
      console.error(error)
    }

    this.clearRequest()
  }

  start(params?: ModalParams) {

    this.bindFlow()
    this.current = this.modals[0].id

    return this.modals[0].open(params)
  }

  request(params?: ModalParams, force = false) {
    console.log(this.resolve, this.reject)
    if (this.hasPendingRequest && !force) {
      return Promise.reject(new Error('This flow already has a pending request'))
    }
    if (this._flowBound) {
      return Promise.reject(new Error('Cannot request while flow is bound'))
    }

    return new Promise<ModalResults>((resolve, reject) => {

      const onResolve = (result: ModalResults) => {
        resolve(result)

        this.close()
        this.clearRequest()
      }

      const onReject = (reason: any) => {
        reject(reason)
        this.close()
        this.clearRequest()
      }

      this.resolve = onResolve
      this.reject = onReject

      this.start(params)
    })
  }

  clearRequest() {

    this.resolve = undefined
    this.reject = undefined
  }

  end() {
    this.unbindFlow()
    return this.close()
  }

  close() {
    const promises = this.modals.map(modal => modal.close())
    return Promise.all(promises)
  }

  next(params?: ModalParams) {
    const promises: Promise<void>[] = []

    const currentIndex = this.modals.findIndex(modal => modal.id === this.current)
    const nextIndex = currentIndex + 1

    const currentModal = this.modals[currentIndex]

    if (currentModal?.isVisible) {
      promises.push(currentModal.close())
    }

    if (nextIndex < this.modals.length) {
      promises.push(this.modals[nextIndex].open(params))
      this.current = this.modals[nextIndex].id
    } else if (this.options?.cycleForward) {
      promises.push(this.modals[0].open(params))
      this.current = this.modals[0].id
    } else {
      this.unbindFlow()
    }

    return Promise.all(promises)
  }

  previous(params?: ModalParams) {
    const promises: Promise<void>[] = []

    const currentIndex = this.modals.findIndex(modal => modal.id === this.current)
    const previousIndex = currentIndex - 1

    const currentModal = this.modals[currentIndex]

    if (currentModal?.isVisible) {
      promises.push(currentModal.close())
    }

    if (previousIndex >= 0) {
      promises.push(this.modals[previousIndex].open(params))
      this.current = this.modals[previousIndex].id
    } else if (this.options?.cycleBackward) {
      promises.push(this.modals[this.modals.length - 1].open(params))
      this.current = this.modals[this.modals.length - 1].id
    } else {
      this.unbindFlow()
    }

    return Promise.all(promises)
  }

}

export function modalFlow<T extends ModalArray<any>>(modals: T, options?: ModalFlowOptions) {
  return new ModalFlow(modals, options)
}
