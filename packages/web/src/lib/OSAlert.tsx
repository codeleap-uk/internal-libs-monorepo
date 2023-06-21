import { AnyFunction, onMount, onUpdate, StyleContextProps, StyleProvider, useBooleanToggle, usePrevious } from '@codeleap/common'
import { Modal, Text, Button } from '../components/components'
import ReactDOM from 'react-dom'
import React from 'react'

type AlertButton = {
    text: string
    onPress: AnyFunction
    variants?: any[]
}

type OSAlertArgs = {
  title: string
  body?: string
  options?: AlertButton[]
}
type AlertEvent = AlertButton['onPress']
// type OSAlertType = 'info' | 'error' | 'warn' | 'ask'
type NamedEvents<E extends string> = Partial<Record<E, AlertEvent>>
type AlertContext = StyleContextProps<any, any>
function RenderModal(props: {args:OSAlertArgs; contextProps:AlertContext ; removeSelf:AnyFunction}) {
  const [visible, toggle] = useBooleanToggle(false)

  const previousVisible = usePrevious(visible)

  const { title, body, options = [] } = props.args

  onMount(() => {
    toggle()
  })

  onUpdate(() => {
    if (!visible && previousVisible) {
      setTimeout(props.removeSelf, 1000)
    }
  }, [visible])

  return <StyleProvider {...props.contextProps}>
    <Modal
      visible={visible}
      toggle={toggle}
      title={title}
      showClose={false}
      closable={false}

      footer={<>
        {
          options.map((o, idx) => <Button key={idx} {...o} onPress={() => {
            o.onPress?.()
            toggle()

          }}/>)
        }
      </>}
    >
      <Text text={body || ''} />

    </Modal>
  </StyleProvider>
}

const MODAL_ID = '__CODELEAP_MODAL__'

function OSAlert(props:OSAlertArgs & {context: AlertContext}) {
  if (!document) return
  let modalDiv = document.getElementById(MODAL_ID)
  const remove = () => {
    ReactDOM.unmountComponentAtNode(modalDiv)
  }

  if (!modalDiv) {
    modalDiv = document.createElement('div')

    modalDiv.setAttribute('id', MODAL_ID)

    document.body.appendChild(modalDiv)
  } else {
    remove()
  }

  ReactDOM.render(
    <RenderModal
      contextProps={props.context}
      removeSelf={remove}
      args={props}
    />, modalDiv,
  )
}

export function CreateOSAlert(context: AlertContext) {
  function ask({ title, body, options }: OSAlertArgs) {
    if (!title) {
      title = 'Quick quetion'
    }
    OSAlert({
      context,
      title,
      body,
      options,
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
      context,
      body,
      options: [
        {
          text: 'OK',
          onPress: () => {

            args?.onDismiss?.()
          },
        },
      ],
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
      context,
      title,
      body,
      options: [
        {
          text: 'Cancel',
          onPress: () => {

            onReject()
          },
        },
        {
          text: 'OK',
          onPress: () => {

            onAccept?.()
          },
        },
      ],
    })
  }

  function info(args: OSAlertArgs & NamedEvents<'onDismiss'>) {

    const {
      title = 'FYI',
      body,
      onDismiss = () => null,
    } = args

    OSAlert({
      context,
      title,
      body,
      options: [
        {
          text: 'OK',
          onPress: () => {

            onDismiss?.()
          },
        },
      ],
    })
  }
  return {
    ask,
    warn,
    info,
    error: OSError,
  }
}
