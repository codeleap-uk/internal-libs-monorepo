import { AnyFunction, silentLogger } from '@codeleap/common' // @ts-ignore
import messaging from '@react-native-firebase/messaging'
import { Subscriber, Subscription } from '../Subscription'
import { Message, NotificationInitializeCallback, NotificationManagerOptions, NotificationType, TNotification } from './types'

export * from './types'

const MODULE = 'NotificationManager'

/**
  * Class responsible for the notification system
*/
export class NotificationManager<N extends object = Message, E extends string = string> {
  public parser: NotificationManagerOptions<N>['parser'] = (message: Message) => message as N

  public currentOptions: NotificationManagerOptions<N> = {
    handleInitialNotification: true,
    debug: false,
    slackDebug: false,
  }

  public currentToken = null

  private registeredUnsubscribers: Record<string, AnyFunction> = {}

  private initialized = false

  public events = new Subscription<TNotification<N>, E>()

  constructor(
    private _logger = silentLogger,
    options: NotificationManagerOptions<N> = {}
  ) {
    if (typeof options?.parser == 'function') {
      this.parser = options?.parser
    }

    this.currentOptions = {
      ...this.currentOptions,
      ...options
    }
  }

  private invoke(args: {
    data: Message,
    type: NotificationType,
  }) {
    this.log('Invoke this events:', this.events.getSubscribersKeys())

    this.events.invoke({
      data: this.parser(args?.data),
      type: args?.type
    })
  }

  public log(description: string, data: any = {}) {
    if (!this._logger) return

    if (this.currentOptions.debug) {
      this._logger.log(description, data, MODULE)
    }

    if (this.currentOptions.slackDebug) {
      this._logger.slack.echo(description, data, MODULE, {
        'include': ['version'],
        'sendIn': ['release', 'debug']
      })
    }
  }

  /**
   * Checks if you are authorized for notifications and returns the result
   * 
   * @return hasAuthorization (boolean)
  */
  public async getHasAuthorization() {
    const authStatus = await messaging().hasPermission()

    const hasAuthorization =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL

    return hasAuthorization
  }

  /**
   * Gets and returns the device token
   * 
   * @return token (string) or null if an error occurs
  */
  public async getToken() {
    try {
      const token = await messaging().getToken()

      this.log('Get token', { token })

      this.currentToken = token

      return token
    } catch (err) {
      this.log('Get token error', err)
      return null
    }
  }

  public onTokenRefresh(cb: (token: string) => void) {
    const unsubscribe = messaging().onTokenRefresh(newToken => {
      this.log('Refreshed token', { newToken })

      this.currentToken = newToken

      cb(newToken)
    })

    return unsubscribe
  }

  public async invokeForInitialNotification() {
    if (this.initialized) return

    const initialNotification = await messaging().getInitialNotification()

    this.log('Initial Notification', initialNotification)

    if (!!initialNotification && this.currentOptions.handleInitialNotification) {
      this.invoke({
        data: initialNotification,
        type: 'initial'
      })
    }
  }

  public onBackgroundMessage() {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      this.log('Notification in background:', remoteMessage)

      this.invoke({
        data: remoteMessage,
        type: 'background'
      })
    })

    return () => messaging().setBackgroundMessageHandler(() => null)
  }

  /**
   * Responsible for initializing all notification services: token refresh, background, foreground, press and initial notification
   *
   * @param {function} callback Callback that is executed when the services are initialized, returning the device token
  */
  public async initialize(callback: NotificationInitializeCallback) {
    this.log('Initialize', this.currentOptions)

    this.unsubscribe()

    const token = await this.getToken()

    callback(token)

    this.invokeForInitialNotification()

    const unsubscribeOnNotificationOpenedApp = messaging().onNotificationOpenedApp(remoteMessage => {
      this.log('Notification pressed:', remoteMessage)

      this.invoke({
        data: remoteMessage,
        type: 'press'
      })
    })

    this.registeredUnsubscribers['openApp'] = unsubscribeOnNotificationOpenedApp

    const unsubscribeOnBackgroundMessage = this.onBackgroundMessage()

    this.registeredUnsubscribers['background'] = unsubscribeOnBackgroundMessage

    const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      this.log('Notification in foreground', remoteMessage)

      this.invoke({
        data: remoteMessage,
        type: 'foreground'
      })
    })

    this.registeredUnsubscribers['foreground'] = unsubscribeOnMessage

    const unsubscribeOnTokenRefresh = this.onTokenRefresh(callback)

    this.registeredUnsubscribers['refreshToken'] = unsubscribeOnTokenRefresh

    this.initialized = true
  }

  public async unsubscribe() {
    this.log('Unsubscribe handlers', this.registeredUnsubscribers)

    for (const unsubscribeKey in this.registeredUnsubscribers) {
      this.registeredUnsubscribers[unsubscribeKey]()
      delete this.registeredUnsubscribers[unsubscribeKey]
    }
  }

  /**
   * Unsubscribe all services that have been started
   *
   * @param {function} callback Callback that is executed when the services are deinitialized
  */
  public async deinitialize(callback: AnyFunction = null) {
    if (!this.initialized) return

    this.log('Deinitialize')

    this.unsubscribe()

    if (typeof callback == 'function') {
      callback()
    }
  }

  /**
   * Registers an event that will be called by all notification services that have been started
   *
   * @param {string} eventName Event name
   * @param {string} handler Function that will be performed
   * @return unsubscribe event (function)
  */
  public registerEvent(eventName: E, handler: Subscriber<TNotification<N>>) {
    return this.events.subscribe(eventName, handler)
  }
}
