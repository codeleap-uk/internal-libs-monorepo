/* eslint no-restricted-imports: 'off' */
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

type NamedEvents<E extends string> = Partial<Record<E, AlertEvent>>;

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

function warn({
  title,
  body,
  onAccept,
  onReject,
}: OSAlertArgs & NamedEvents<'onReject' | 'onAccept'>) {
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
        onPress: onReject,
      },
      {
        text: 'OK',
        style: 'destructive',
        onPress: onAccept,
      },
    ],
  })
}

function info({
  title,
  body,
  onDismiss = () => null,
}: OSAlertArgs & NamedEvents<'onDismiss'>) {
  if (!title) {
    title = 'FYI'
  }
  OSAlert({
    title,
    body,
    options: [
      {
        text: 'OK',
        onPress: onDismiss,
      },
    ],
  })
}

function OSError({
  title,
  body,
  onDismiss = () => null,
}: OSAlertArgs & NamedEvents<'onDismiss'>) {
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
        onPress: () => onDismiss(),
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
