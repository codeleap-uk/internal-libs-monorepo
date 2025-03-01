import React, { useEffect } from 'react'
import { atom, onMount, task } from 'nanostores'
import { useStore } from '@nanostores/react'
import { PropsOf, TypeGuards } from '@codeleap/types'
import { ModalFlow } from './modalFlow'
import { awaitTransition, randomId } from './utils'
import { ModalOverrides } from './types'

export type ModalParams<P = {}, Result = {}> = {
  visible: boolean
  toggle: () => void
  request?: {
    resolve: (result: Result) => void
    reject: (reason: any) => void
  }

} & P

type ModalRef = any

type RenderModalContent<Params = {}, Result = {}> = (props: ModalParams<Params, Result>, ref: ModalRef) => JSX.Element

type ModalConfig<P, M = { }> = {
  initialParams?: P | (() => Promise<P>)
  startsOpen?: boolean | (() => Promise<boolean>)
  independent?: boolean
  rendersWhenHidden?: boolean
  metadata?: M
  transitionDuration?: number
}

type IAtom<T> = ReturnType<typeof atom<T>>

type ModalConstructorParam<Params = {}, Metadata = {}> = (Partial<ModalConfig<Params, Metadata>> & { id?: string }) | string

function initAtomWithPromise<T>(atom: IAtom<T>, promise: Promise<T>) {
  onMount(atom, () => {
    task(async () => {
      atom.set(await promise)
    })
  })
}

const DefaultWrapper = () => {
  return null
}

type WrapperComponentProps = Partial<PropsOf<typeof Modal.WrapperComponent>>
const registeredIds = atom([])
export class Modal<Params = {}, Result = {}, Metadata = {}> {

  id: string

  RenderContent: RenderModalContent<Params, Result>

  visible: IAtom<boolean>

  params: IAtom<Params>

  _config: ModalConfig<Params, Metadata>

  _initialParams: Params

  _wrapperProps: IAtom<WrapperComponentProps>

  static registry: Record<string, Modal<any>> = {}

  static stack: string[] = []

  static WrapperComponent:ModalOverrides['WrapperComponent'] = DefaultWrapper

  static DEFAULT_TRANSITION_DURATION = 300

  static generateId = randomId

  resolve: (result: Result) => void

  reject: (reason: any) => void

  flow?: ModalFlow<any>

  content(render: RenderModalContent<Params, Result>) {

    this.RenderContent = render

    return this
  }

  get isVisible() {
    return this.visible.get()
  }

  get currentParams() {
    return this.params.get()
  }

  private onVisibilityChanged(visible: boolean, wasVisible: boolean) {
    if (this._config.independent) return

    if (visible) {
      Modal.stack.push(this.id)
    } else {
      if (wasVisible && !visible) {
        if (this.hasPendingRequest && !this.flow?.hasPendingRequest) {
          this.resolve?.(null)
          this.clearRequest()
        }
      }
      const modalIndex = Modal.stack.indexOf(this.id)

      if (modalIndex > -1) {
        Modal.stack = Modal.stack.slice(0, modalIndex)
      }
    }
  }

  get stackIndex() {
    return Modal.stack.indexOf(this.id)
  }

  constructor(idOrConfig?:ModalConstructorParam<Params, Metadata>) {
    const id = TypeGuards.isString(idOrConfig) ? idOrConfig : idOrConfig?.id
    const config = TypeGuards.isObject(idOrConfig) ? idOrConfig : {}
    this._config = {
      initialParams: {} as Params,
      startsOpen: false,
      independent: false,
      rendersWhenHidden: false,
      metadata: {} as Metadata,
      transitionDuration: Modal.DEFAULT_TRANSITION_DURATION,
      ...config,
    }

    this.id = id ?? Modal.generateId()

    const initialVisible = TypeGuards.isBoolean(this._config.startsOpen) ? this._config.startsOpen : false
    const initialParams = TypeGuards.isFunction(this._config.initialParams) ? {} as Params : (this._config.initialParams ?? {}) as Params

    this._initialParams = initialParams

    this.visible = atom(initialVisible)
    this.params = atom(initialParams)
    this._wrapperProps = atom({})

    if (TypeGuards.isFunction(this._config.startsOpen)) {
      initAtomWithPromise(this.visible, this._config.startsOpen())
    }

    if (TypeGuards.isFunction(this._config.initialParams)) {
      initAtomWithPromise(this.params, this._config.initialParams().then(p => {
        this._initialParams = p
        return p
      }))
    }

    Modal.registry[this.id] = this
    registeredIds.set([ ...registeredIds.get(), this.id])

    this.visible.subscribe((visible, wasVisible) => {
      this.onVisibilityChanged(visible, wasVisible)
    })

    this.Component = this.Component.bind(this)
    this.useState = this.useState.bind(this)
    this.useSync = this.useSync.bind(this)
    this.useProps = this.useProps.bind(this)
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)
    this.toggle = this.toggle.bind(this)
    this.resetParams = this.resetParams.bind(this)
    this.setParams = this.setParams.bind(this)

  }

  awaitTransition(count = 1) {
    return awaitTransition(count, this._config.transitionDuration)
  }

  open(params?: Params) {

    if (params) {
      this.params.set({
        ...this.params.get(),
        ...params,
      })
    }

    this.visible.set(true)

    return awaitTransition()
  }

  close() {
    this.visible.set(false)

    return awaitTransition()
  }

  toggle() {
    this.visible.set(!this.visible.get())

    return awaitTransition()
  }

  resetParams() {
    this.params.set(this?._initialParams ?? {} as Params)
  }

  setParams(params: Params) {
    this.params.set(params)

  }

  useState() {

    const visible = useStore(this.visible)
    const params = useStore(this.params)

    return { visible, params }
  }

  useSync(params?: Params) {
    useEffect(() => {

      this.params.set(params)

    }, [params])
  }

  props(props: Partial<PropsOf<typeof Modal.WrapperComponent>>) {
    this._wrapperProps.set(props)
    return this
  }

  useProps(props: Partial<PropsOf<typeof Modal.WrapperComponent>>, deps = []) {

    useEffect(() => {
      this._wrapperProps.set({
        ...this._wrapperProps.get(),
        ...props,
      })

    }, deps)

  }

  clone() {
    const newModal = new Modal<Params, Result, Metadata>(this._config)
    newModal.props(this._wrapperProps.get())
    newModal.content(this.RenderContent)
    return newModal
  }

  get hasPendingRequest() {
    return !!this.resolve && !!this.reject
  }

  Component(props?: Params & { modalProps?: Partial<PropsOf<typeof Modal.WrapperComponent>>}) {
    const { visible, params } = this.useState()
    const wrapperProps = useStore(this._wrapperProps)
    const { modalProps = {}, ...propParams } = props

    const Content = this.RenderContent

    if (!visible && !this._config.rendersWhenHidden) return null

    const request = {
      resolve: this.resolve,
      reject: this.reject,
    }

    return <Modal.WrapperComponent
      {...this._wrapperProps}
      {...modalProps}
      {...wrapperProps}
      visible={visible}
      toggle={this.toggle}
      zIndex={this.stackIndex}
    >
      <Content
        visible={visible}
        toggle={this.toggle}
        {...params}
        {...(propParams ?? {})}
        request={this.hasPendingRequest ? request : null}
        flow={this.flow}
        nextOrToggle={this.flow?.next ?? this.toggle}
        previousOrToggle={this.flow?.previous ?? this.toggle}
      />
    </Modal.WrapperComponent>

  }

  request(params?: Params, force = false) {
    if (this.hasPendingRequest && !force) {
      return Promise.reject(new Error('This modal already has a pending request'))
    }

    return new Promise<Result>((resolve, reject) => {

      const onResolve = (result: Result) => {
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

      this.open(params)
    })
  }

  clearRequest() {
    this.resolve = undefined
    this.reject = undefined
  }

  static getInstance<T>(id: string) {
    return this.registry?.[id] as Modal<T>
  }

  static GlobalOutlet() {
    const ids = useStore(registeredIds)
    const modals = Object.values(Modal.registry).filter(m => !m._config.independent)

    return <>
      {
        modals.map(modal => {
          return <modal.Component key={modal.id} />
        })
      }
    </>
  }
}

export function modal<Params = {}, Result = {}, Metadata = {}>(idOrConfig?: ModalConstructorParam<Params, Metadata>) {
  return new Modal<Params, Result, Metadata>(idOrConfig)
}

export const ModalOutlet = Modal.GlobalOutlet
