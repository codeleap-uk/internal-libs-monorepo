// @ts-ignore
import { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { FunctionType } from '@codeleap/common'

export type Message = FirebaseMessagingTypes.RemoteMessage

export type NotificationType = 'foreground' | 'background' | 'press' | 'initial'

export type NotificationHandler<N extends object = Message> = FunctionType<[notification: N, type: NotificationType], void>

export type TNotification<N extends object = Message> = {
  data: N
  type: NotificationType
}

export type NotificationInitializeCallback = (
  deviceToken: string, 
) => void

export type NotificationManagerOptions<N extends object = Message> = {
  debug?: boolean
  slackDebug?: boolean
  handleInitialNotification?: boolean,
  parser?: (message: Message) => N
}
