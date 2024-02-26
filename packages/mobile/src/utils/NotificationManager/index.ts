import { AnyFunction, silentLogger } from '@codeleap/common'
// @ts-ignore
import messaging from '@react-native-firebase/messaging'
// @ts-ignore
import deepmerge from '@fastify/deepmerge'
import { Subscriber, Subscription } from '../Subscription'
import { Message, NotificationInitializeCallback, NotificationManagerOptions, NotificationType, TNotification } from './types'

export * from './types'

const MODULE = 'NotificationManager'

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

    this.currentOptions = deepmerge({ all: true })(
      this.currentOptions,
      options
    ) 
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

  public async getHasAuthorization() {
    const authStatus = await messaging().hasPermission()

    const hasAuthorization =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL

    return hasAuthorization
  }

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

  public async initialize(cb: NotificationInitializeCallback) {
    this.log('Initialize', this.currentOptions)

    this.unsubscribe()

    const token = await this.getToken()

    cb(token)

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

    const unsubscribeOnTokenRefresh = this.onTokenRefresh(cb)

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

  public async deinitialize(cb: AnyFunction = null) {
    if (!this.initialized) return

    this.log('Deinitialize')

    this.unsubscribe()

    if (typeof cb == 'function') {
      cb()
    }
  }

  public registerEvent(eventName: E, handler: Subscriber<TNotification<N>>) {
    return this.events.subscribe(eventName, handler)
  }
}
