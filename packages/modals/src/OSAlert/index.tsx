import { AnyFunction, TypeGuards } from '@codeleap/types'
import { map } from 'nanostores'

// @todo - this should be refactored for the modal system

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
  props: OSAlertGlobalProps
}

export type DefaultOSAlertArgs = Pick<OSAlertArgs, 'title' | 'body' | 'options'>

export const OSAlertStore = map<TOSAlertStore>({
  visible: false,
  props: {},
})

export const OSAlertActions = {
  open: () => OSAlertStore.setKey('visible', true),
  close: () => OSAlertStore.setKey('visible', false),
  toggle: (to?: boolean) => {
    const visible = TypeGuards.isBoolean(to) ? to : !OSAlertStore.value.visible
    OSAlertStore.setKey('visible', visible)
  },
  setProps: (props: OSAlertGlobalProps) => OSAlertStore.setKey('props', props)
}

type CreateOSAlertOptions = {
  delay?: number
}

export function CreateOSAlert<T extends object = {}>(options: CreateOSAlertOptions = {}) {
  const {
    delay = 450,
  } = options

  const trigger = (props: OSAlertGlobalProps) => {
    const alert = OSAlertStore.get()

    if (alert.visible) {
      OSAlertActions.close()

      setTimeout(() => {
        OSAlertActions.setProps(props)
        OSAlertActions.open()
      }, delay)
    } else {
      OSAlertActions.setProps(props)
      OSAlertActions.open()
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
