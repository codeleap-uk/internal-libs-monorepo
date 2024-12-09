import { inspect } from 'util'
import { TypeGuards, AppSettings } from '@codeleap/types'

type EchoSlackConfig = AppSettings['Slack']['echo']

type EchoSlack = {
  label: string
  data: object
  options?: EchoSlackOptions
  module?: string
}

type OptionInclude = 'version'

type SendIn = 'debug' | 'release'

type EchoSlackOptions = {
  sendIn?: SendIn[]
  include?: OptionInclude[]
}

const DEFAULT_CHANNEL = '#_dev_logs'
const DEFAULT_BASE_URL = 'https://slack.com/api/chat.postMessage'

export class SlackService {
  private echoConfig: EchoSlackConfig

  private isDev: boolean

  private appName: string

  public api

  constructor(settings: AppSettings) {
    this.echoConfig = settings?.Slack?.echo as EchoSlackConfig
    this.isDev = settings?.Environment?.IsDev
    this.appName = settings?.AppName
  }

  async echo(
    label: EchoSlack['label'],
    slackData: EchoSlack['data'],
    moduleName: EchoSlack['module'] = null,
    messageOptions: EchoSlack['options'] = {}
  ) {
    const options = this.parseOptions(messageOptions)
    const slack = this.parseData(label, slackData, options.info, moduleName)

    const enabled = TypeGuards.isBoolean(this.echoConfig.enabled) ? this.echoConfig.enabled : true
  
    if (!options.send || !this.api || !this.echoConfig || !enabled) return

    const settingsData = this?.echoConfig?.options ?? {}
  
    try {
      const data = {
        'channel': this?.echoConfig?.channel ?? DEFAULT_CHANNEL,
        text: slack,
        'username': `${this.appName} Log`,
        'icon_url': this?.echoConfig?.icon,
        ...settingsData,
      }
  
      await this.api.post('', data, {
        baseURL: this?.echoConfig?.baseURL ?? DEFAULT_BASE_URL,
        headers: {
          Authorization: `Bearer ${this?.echoConfig?.token}`,
        },
      })
    } catch (err) {
      console.error('Failed to echo', err, 'logger echoSlack')
    }
  }

  private serializers: Record<OptionInclude, (IsDev: boolean) => string> = {
    version: (IsDev: boolean) => {
      return IsDev ? 'debug' : 'release'
    },
  }

  private parseOptions(options: EchoSlackOptions) {
    const {
      sendIn = [],
      include = [],
    } = options
  
    const hasSendIn = sendIn.length >= 1
    const isDebug = hasSendIn ? sendIn.includes('debug') : true
    const isRelease = hasSendIn ? sendIn.includes('release') : true
  
    if (!isDebug && this.isDev || !isRelease && !this.isDev) {
      return {
        info: '',
        send: false,
      }
    }
  
    let str = ''
    const separator = ' - '
  
    include.forEach(k => {
      const data = this.serializers[k]?.(this.isDev)
      str = `${str}${str.length > 0 ? separator : ''}[${data}]`
    })
  
    return {
      info: str,
      send: true,
    }
  }
  
  private parseData(label: string, data: object, info: string, module?: string) {
    const obj = !info ? data : {
      ...data,
      info,
    }
  
    const args = [`${!module ? '' : `(${module}) `}${label}: `, obj]
  
    const slack = args.map(i => {
      if (typeof i === 'object') {
        try {
          return inspect(i, {
            depth: 5,
            compact: false,
            showHidden: true,
          })
        } catch (e) {
          return `${i} (Unserializable value)`
        }
      }
  
      return String(i)
    }).join(' ')
  
    return slack
  }
}
