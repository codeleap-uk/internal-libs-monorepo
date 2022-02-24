/* eslint no-restricted-imports: 'off' */
/* eslint prefer-const: 'off' */
import { Alert, AlertButton } from 'react-native'

/**
 * Alert.{function} receives three parameters, the last one being an object:
 *
 * @param {string} title text to appear in title
 * @param {string} body text to appear in body
 * @param {object} options array of buttons and callbacks
 *
 * options properties
 * @property {string} name object description
 * @property {function} run callback function to run on press
 */

type NativeAlertArgs = Parameters<typeof Alert.alert>;

type OSAlertArgs = {
  title: NativeAlertArgs['0'];
  body?: NativeAlertArgs['1'];
  options?: NativeAlertArgs['2'];
};
type AlertEvent = AlertButton['onPress'];
type OSAlertType = 'info' | 'error' | 'warn' | 'ask'
type NamedEvents<E extends string> = Partial<Record<E, AlertEvent>>;

const currentAlerts = {

}

function generateAlertID(from:OSAlertArgs & {type: OSAlertType}) {
  return [
    from.type,
    from.title,
    from.body,
  ].join('-')
}

function shouldShowAlert(args:OSAlertArgs, type: OSAlertType) {
  const alertId = generateAlertID({ ...args, type })

  if (!Object.keys(currentAlerts).includes(alertId)) {
    currentAlerts[alertId] = true

    return alertId
  }

  return ''
}

function popAlert(id:string) {
  delete currentAlerts[id]
}

function ask({ title, body, options = null }: OSAlertArgs) {
  if (!title) {
    title = 'Quick quetion'
  }
  OSAlert({
    title,
    body,
    options,
  })
}

function warn(args: OSAlertArgs & NamedEvents<'onReject' | 'onAccept'>) {
  const id = shouldShowAlert(args, 'warn')

  if (!id) return
  let {
    title,
    body,
    onAccept,
    onReject,
  } = args

  if (!title) {
    title = 'Hang on'
  }
  if (!body) {
    body = 'Are you sure?'
  }
  if (!onReject) {
    onReject = () => null
  }
  OSAlert({
    title,
    body,
    options: [
      {
        text: 'Cancel',
        onPress: () => {
          popAlert(id)
          onReject()
        },
      },
      {
        text: 'OK',
        style: 'destructive',
        onPress: () => {
          popAlert(id)
          onAccept?.()
        },
      },
    ],
  })
}

function info(args: OSAlertArgs & NamedEvents<'onDismiss'>) {
  const id = shouldShowAlert(args, 'info')

  if (!id) return
  let {
    title,
    body,
    onDismiss = () => null,
  } = args

  if (!title) {
    title = 'FYI'
  }
  OSAlert({
    title,
    body,
    options: [
      {
        text: 'OK',
        onPress: () => {
          popAlert(id)
          onDismiss?.()
        },
      },
    ],
  })
}

function OSError(args: OSAlertArgs & NamedEvents<'onDismiss'>) {
  const id = shouldShowAlert(args, 'error')

  if (!id) return

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
    options: [
      {
        text: 'OK',
        onPress: () => {
          popAlert(id)
          args?.onDismiss?.()
        },
      },
    ],
  })
}

function OSAlert(params: OSAlertArgs) {
  Alert.alert(params.title, params.body, params.options, {
    cancelable: false,
  })
}

export default {
  ask,
  warn,
  info,
  error: OSError,
}
