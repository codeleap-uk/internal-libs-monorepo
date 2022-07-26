import { FunctionType, silentLogger } from '@codeleap/common'
// @ts-ignore
import { firebase, FirebaseMessagingTypes } from '@react-native-firebase/messaging'

const messaging = firebase.messaging

const MODULE = 'Notifications'

export type Message = FirebaseMessagingTypes.RemoteMessage
export type MessageType = 'foreground' | 'background' | 'press' | 'initial'

export type NotificationHandler = FunctionType<[message: Message, type: MessageType], any>

type HandleNotificationParam = {
    data: Message
    type: MessageType
}

type NotificationStateChangeListener = FunctionType<[isInitialized: boolean], any>
export class NotificationManager {

    stateChangeListeners:NotificationStateChangeListener[] = []

    messageListeners:NotificationHandler[] = []

    _initialized = false

    unsubscribeFromMessage = null

    unsubscribeFromBackgroundMessage = null

    unsubscribeFromPress = null

    currentToken = null

    constructor(private logger = silentLogger) {
    }

    async init() {
      // return
      if (this.initialized) return

      try {

        await messaging().registerDeviceForRemoteMessages()
        // logger.log('firebase registeted', '', MODULE)

        const token = await messaging().getToken()
        // logger.log('init token', { token }, MODULE)

        if (token) {
          this.currentToken = token

          this.initialized = true
        } else {
          this.currentToken = null
          this.initialized = false
        }

        messaging().onTokenRefresh(newToken => {
          // logger.log('onTokenRefresh', { newToken }, MODULE)
          if (token) {
            this.currentToken = newToken

            this.initialized = true
          } else {
            this.currentToken = null
            this.initialized = false
          }
        })
        // logger.log('init success', {}, MODULE)
      } catch (e) {
        this.logger.error('Failed to initialize notification services', e, MODULE)
        // OSAlert.error({ title: 'Failed to initialize notification services' })
      }
    }

    async deinit() {
      [
        this.unsubscribeFromMessage,
        this.unsubscribeFromBackgroundMessage,
        this.unsubscribeFromPress,
      ].forEach(unsubscribe => {
        if (unsubscribe) {
          unsubscribe()
        }
      })

      this.initialized = false
    }

    private async handleNotification(args:HandleNotificationParam) {
      for (const listener of this.messageListeners) {
        await listener(args.data, args.type)
      }
    }

    get initialized() {
      return this._initialized
    }

    set initialized(to:boolean) {

      if (to) {
        this.logger.log('Initialized', '', MODULE)
        this.unsubscribeFromMessage = messaging().onMessage((msg) => {
          this.handleNotification({
            data: msg,
            type: 'foreground',
          })
        })

        this.unsubscribeFromBackgroundMessage = messaging().setBackgroundMessageHandler(async (msg) => {
          this.handleNotification({
            data: msg,
            type: 'background',
          })
        })

        this.unsubscribeFromPress = messaging().onNotificationOpenedApp(msg => {
          this.logger.log('Notification press', msg, MODULE)
          this.handleNotification({
            data: msg,
            type: 'press',
          })
        })

      } else {
        this.unsubscribeFromMessage = null

        this.unsubscribeFromBackgroundMessage = null

        this.unsubscribeFromPress = null

        this.logger.log('Deinitialized', '', MODULE)
      }

      this.stateChangeListeners.forEach(l => l(to))
    }

    onNotification(handler:NotificationHandler) {
      const newLen = this.messageListeners.push(handler)

      return () => {
        this.messageListeners.splice(newLen - 1)
      }
    }

    onStateChange(handler:NotificationStateChangeListener) {
      const newLen = this.stateChangeListeners.push(handler)

      return () => {
        this.stateChangeListeners.splice(newLen - 1)
      }

    }

    async getInitialNotification() {
      try {

        const msg = await messaging().getInitialNotification()
        this.logger.log('Initial notification', msg, MODULE)
        return {
          data: msg as Message,
          type: 'initial',
        }

      } catch (e) {
        return {
          data: null,
          type: 'initial',
        }
      }
    }
}

