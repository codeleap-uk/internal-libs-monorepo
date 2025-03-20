import { AnyFunction } from '@codeleap/types'
import { Modal } from './modal'

export type AlertType = 'info' | 'error' | 'warn' | 'ask' | 'custom'

export type AlertOption = {
  text: string
  onPress?: AnyFunction
  style?: 'destructive' | 'outline' | 'cancel' | 'default' | 'minimal'
}

export type AlertOptions = {
  title?: string
  body?: string
  options?: AlertOption[]
  onDismiss?: AnyFunction
  type?: AlertType
}

export class Alert {
  static modal: Modal<AlertOptions>

  static openAlert(): Modal<AlertOptions> {
    return Alert.modal
  }

  private trigger(args: AlertOptions) {
    Alert.openAlert().open(args)
  }

  ask(args: AlertOptions) {
    const { title = 'Quick question', ...rest } = args

    this.trigger({
      ...rest,
      title,
      type: 'ask',
    })
  }

  error(args: AlertOptions) {
    const { title = 'Whoops!', body = 'Something went wrong', ...rest } = args

    this.trigger({
      ...rest,
      title,
      body,
      type: 'error'
    })
  }

  warn(args: AlertOptions) {
    const { title = 'Hang on', body = 'Are you sure?', ...rest } = args

    this.trigger({
      ...rest,
      title,
      body,
      type: 'warn'
    })
  }

  info(args: AlertOptions) {
    const { title = 'Hang on', body = 'Are you sure?', ...rest } = args

    this.trigger({
      ...rest,
      title,
      body,
      type: 'info'
    })
  }

  custom<T>(options: Partial<AlertOptions> & T) {
    this.trigger({
      ...(options as any),
      type: 'custom'
    })
  }
}

export const alert = new Alert()