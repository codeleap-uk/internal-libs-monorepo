import { AnyFunction, TypeGuards } from '@codeleap/common'
import { create } from 'zustand'

type AlertButton = {
  text: string
  onPress: AnyFunction
  variants?: any[]
}

type OSAlertArgs = {
  title: string
  body?: string
  options?: AlertButton[]
  onDismiss?: AnyFunction
  onAction?: AnyFunction
  type?: Exclude<GlobalAlertType, 'custom'> | string
}

type AlertEvent = AlertButton['onPress']

type NamedEvents<E extends string> = Partial<Record<E, AlertEvent>>

export type GlobalAlertType = 'info' | 'error' | 'warn' | 'ask' | 'custom'

export type GlobalAlertComponentProps = {
  args: Partial<OSAlertArgs>
  removeSelf: AnyFunction
  type: GlobalAlertType
  id: string
}

type TOSAlertStore = {
  visible: boolean
  toggle: (props: Partial<OSAlertArgs & { type: GlobalAlertType }>) => void
  props: Partial<OSAlertArgs & { type: GlobalAlertType }>
}

export const OSAlertStore = create<TOSAlertStore>(set => ({
  visible: false,
  toggle: (props) => set(state => ({
    visible: TypeGuards.isBoolean(props) ? props : !state.visible,
    props: TypeGuards.isObject(props) ? props : state?.props,
  })),
  props: {}
}))

function RenderModal(props) {
  return null
}

export function OSAlertGlobal() {
  const props = OSAlertStore(store => store.props)

  return (
    <OSAlertGlobal.Component
      args={props}
      type={props?.type}
    />
  )
}

OSAlertGlobal.Component = RenderModal

export function CreateOSAlert(Component) {
  OSAlertGlobal.Component = Component

  function ask({ title, body, options }: OSAlertArgs) {
    if (!title) {
      title = 'Quick quetion'
    }
  
    OSAlertStore.getState().toggle({
      title,
      body,
      options,
      type: 'ask',
      onAction: null,
      onDismiss: null,
    })
  }
  
  function OSError(args: OSAlertArgs & NamedEvents<'onDismiss'>) {
    let {
      title,
      body,
    } = args
  
    if (!title) {
      title = 'Whoops!'
    }
    if (!body) {
      body = 'Something went wrong'
    }
    
    OSAlertStore.getState().toggle({
      title,
      body,
      type: 'error',
      onAction: args.onDismiss,
      onDismiss: args.onDismiss,
    })
  }
  
  function warn(args: OSAlertArgs & NamedEvents<'onReject' | 'onAccept'>) {
    const {
      title = 'Hang on',
      body = 'Are you sure?',
      onAccept,
      onReject = () => null,
    } = args
  
    OSAlertStore.getState().toggle({
      title,
      body,
      type: 'warn',
      onAction: onAccept,
      onDismiss: onReject,
    })
  }
  
  function info(args: OSAlertArgs & NamedEvents<'onDismiss'>) {
    const {
      title = 'FYI',
      body,
      onDismiss = () => null,
    } = args
  
    OSAlertStore.getState().toggle({
      title,
      body,
      type: 'info',
      onDismiss,
    })
  }
  
  function custom(args: OSAlertArgs & {type: string}) {
    const {
      title = 'Hang on',
      body = 'Are you sure?',
      type,
      ...rest
    } = args
  
    OSAlertStore.getState().toggle({
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
