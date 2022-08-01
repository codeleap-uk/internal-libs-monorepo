import { FunctionType, silentLogger } from '@codeleap/common'
// @ts-ignore
import { firebase, FirebaseMessagingTypes } from '@react-native-firebase/messaging'

const messaging = firebase.messaging

const MODULE = 'Notifications'

export type Message = FirebaseMessagingTypes.RemoteMessage
export type MessageType = 'foreground' | 'background' | 'press' | 'initial'

export type NotificationHandler = FunctionType<[message: Message, type: MessageType], any>

export type HandleNotificationParam = {
    data: Message
    type: MessageType
}

export type NotificationStateChangeListener = FunctionType<[isInitialized: boolean, token?: string], any>
export class NotificationManager {

    stateChangeListeners:NotificationStateChangeListener[] = []

    messageListeners:NotificationHandler[] = []

    _initialized = false

    unsubscribeFromMessage = null

    unsubscribeFromBackgroundMessage = null

    unsubscribeFromPress = null

    _currentToken = null

    _initialNoficationHandled = false

    constructor(private logger = silentLogger, public autoHandleInitialNotification = true) {
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

    get currentToken() {
      return this._currentToken
    }

    set currentToken(token: string) {
      this._currentToken = token
      this.triggerStateChange()
    }

    get initialized() {
      return this._initialized
    }

    set initialized(to:boolean) {

      if (to) {
        this.logger.info('Initialized', '', MODULE)
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
          this.logger.info('Notification press', msg, MODULE)
          this.handleNotification({
            data: msg,
            type: 'press',
          })
        })

        if (!this._initialNoficationHandled && this.autoHandleInitialNotification) {
          this.getInitialNotification().then(msg => {
            if (!msg.data) return
            this.logger.info('Notification initial', msg, MODULE)
            this.handleNotification(msg).then(() => {
              this._initialNoficationHandled = true
            }).catch(e => {
              this._initialNoficationHandled = true
              this.logger.error('Error handling initial notification', e, MODULE)
            })
          })
        }
      } else {
        this.unsubscribeFromMessage = null

        this.unsubscribeFromBackgroundMessage = null

        this.unsubscribeFromPress = null

        this.logger.info('Deinitialized', '', MODULE)
      }
      this._initialized = to

      this.triggerStateChange()
    }

    onNotification(handler:NotificationHandler) {
      const newLen = this.messageListeners.push(handler)

      return () => {
        this.messageListeners.splice(newLen - 1)
      }
    }

    private triggerStateChange() {
      this.stateChangeListeners.forEach(l => {
        l(this._initialized, this.currentToken)
      })
    }

    onStateChange(handler:NotificationStateChangeListener) {
      const newLen = this.stateChangeListeners.push(handler)

      return () => {
        this.stateChangeListeners.splice(newLen - 1)
      }

    }

    async getInitialNotification():Promise<HandleNotificationParam> {
      try {

        const msg = await messaging().getInitialNotification()
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

