import { AnyFunction, onMount, onUpdate, useBooleanToggle, usePrevious } from '@codeleap/common'
import ReactDOM from 'react-dom'
import React from 'react'
import { v4 as uuid } from 'uuid'
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
}
type AlertEvent = AlertButton['onPress']
// type OSAlertType = 'info' | 'error' | 'warn' | 'ask'
type NamedEvents<E extends string> = Partial<Record<E, AlertEvent>>

export type GlobalAlertType = 'info' | 'error' | 'warn' | 'ask'

export type GlobalAlertComponentProps = {
  args: OSAlertArgs
  removeSelf: AnyFunction
  type: GlobalAlertType
}

export function useGlobalAlertComponent(props: GlobalAlertComponentProps) {
  const [visible, toggle] = useBooleanToggle(false)

  const previousVisible = usePrevious(visible)

  onMount(() => {
    toggle()
  })

  onUpdate(() => {
    if (!visible && previousVisible) {
      setTimeout(props.removeSelf, 1000)
    }
  }, [visible])

  return {
    visible,
    toggle,
  }
}

function RenderModal(props: GlobalAlertComponentProps) {

  return null
}

const MODAL_ID = '__CODELEAP_MODAL__'

function OSAlert(props: OSAlertArgs & { type: GlobalAlertType }) {
  if (!document) return

  const modalId = MODAL_ID + '_' + uuid()

  const modalsRootDiv = document.getElementById(MODAL_ID)

  let modalDiv = document.getElementById(modalId)

  const remove = () => {
    ReactDOM.unmountComponentAtNode(modalDiv)
  }

  if (!modalDiv) {
    modalDiv = document.createElement('div')

    modalDiv.setAttribute('id', MODAL_ID)

    modalsRootDiv.appendChild(modalDiv)

  }

  ReactDOM.render(<>

    <OSAlert.Component
      removeSelf={remove}
      args={props}
      type={props.type}
      id={modalId}
    />

  </>, modalDiv)

}
OSAlert.Component = RenderModal

export function CreateOSAlert(Component) {

  OSAlert.Component = Component

  function ask({ title, body, options }: OSAlertArgs) {
    if (!title) {
      title = 'Quick quetion'
    }
    OSAlert({
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
    OSAlert({
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

    OSAlert({

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

    OSAlert({
      title,
      body,
      type: 'info',
      onDismiss,
    })
  }
  return {
    ask,
    warn,
    info,
    error: OSError,
  }
}

export const AlertOutlet = () => {
  return <div id={MODAL_ID} />
}
