import { AnyFunction } from '../../types'
import { create } from 'zustand'
import { TypeGuards } from '../../utils'

export type AlertButton = {
  text: string
  onPress?: AnyFunction
  variants?: string[]
  style?: 'destructive' | 'outline' | 'cancel' | 'default' | 'minimal'
}

export type OSAlertArgs = {
  title: string
  body?: string
  options?: AlertButton[]
  onDismiss?: AnyFunction
  onAction?: AnyFunction
  type?: Exclude<GlobalAlertType, 'custom'> | string
}

export type AlertEvent = AlertButton['onPress']

export type NamedEvents<E extends string> = Partial<Record<E, AlertEvent>>

export type GlobalAlertType = 'info' | 'error' | 'warn' | 'ask' | 'custom'

export type OSAlertGlobalProps = Partial<OSAlertArgs & { type: GlobalAlertType }>

export type TOSAlertStore = {
  visible: boolean
  toggle: (to?: boolean) => void
  props: OSAlertGlobalProps
  setProps: (props: OSAlertGlobalProps) => void
  open: () => void
  close: () => void
}

export type DefaultOSAlertArgs = Pick<OSAlertArgs, 'title' | 'body' | 'options'>

export const OSAlertStore = create<TOSAlertStore>(set => ({
  visible: false,
  toggle: (to = null) => set(state => ({
    visible: TypeGuards.isBoolean(to) ? to : !state.visible,
  })),
  props: {},
  setProps: (props) => set(() => ({ props })),
  open: () => set({ visible: true }),
  close: () => set({ visible: false }),
}))

type CreateOSAlertOptions = {
  delay?: number
}

export function CreateOSAlert<T extends object = {}>(options: CreateOSAlertOptions = {}) {
  const {
    delay = 450,
  } = options

  const trigger = (props: OSAlertGlobalProps) => {
    const alert = OSAlertStore.getState()

    if (alert.visible) {
      alert.close()

      setTimeout(() => {
        alert.setProps(props)
        alert.open()
      }, delay)
    } else {
      alert.setProps(props)
      alert.open()
    }
  }

  function ask({ title, body, options }: DefaultOSAlertArgs) {
    if (!title) {
      title = 'Quick question'
    }
  
    trigger({
      title,
      body,
      options,
      type: 'ask',
      onAction: null,
      onDismiss: null,
    })
  }
  
  function OSError(args: DefaultOSAlertArgs & NamedEvents<'onDismiss'>) {
    let {
      title,
      body,
      options,
    } = args
  
    if (!title) {
      title = 'Whoops!'
    }
    if (!body) {
      body = 'Something went wrong'
    }
    
    trigger({
      title,
      body,
      type: 'error',
      onAction: args.onDismiss,
      onDismiss: args.onDismiss,
      options,
    })
  }
  
  function warn(args: DefaultOSAlertArgs & NamedEvents<'onReject' | 'onAccept'>) {
    const {
      title = 'Hang on',
      body = 'Are you sure?',
      options,
      onAccept,
      onReject = () => null,
    } = args
  
    trigger({
      title,
      body,
      options,
      type: 'warn',
      onAction: onAccept,
      onDismiss: onReject,
    })
  }
  
  function info(args: DefaultOSAlertArgs & NamedEvents<'onDismiss'>) {
    const {
      title = 'FYI',
      body,
      options,
      onDismiss = () => null,
    } = args
  
    trigger({
      title,
      body,
      options,
      type: 'info',
      onDismiss,
    })
  }

  function custom(args: OSAlertArgs & Partial<T>) {
    const {
      title,
      body,
      type,
      ...rest
    } = args
  
    trigger({
      title,
      body,
      type: type as GlobalAlertType,
      ...rest,
    })
  }

  return {
    ask,
    warn,
    info,
    error: OSError,
    custom,
  }
}
