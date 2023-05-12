import { AppSettings } from '../../config/Settings'
import { RequestClient } from '../Fetch'

type EchoSlackConfig = {
  channel?: string
  icon: string
  token: string
  baseURL?: string
}

type EchoSlack = {
  label: string
  data: object
  options?: EchoSlackOptions
}

type OptionInclude = 'version'

type SendIn = 'debug' | 'release'

type EchoSlackOptions = {
  sendIn?: SendIn[]
  include?: OptionInclude[]
}

const DEFAULT_CHANNEL = '#_dev_logs'
const DEFAULT_BASE_URL = 'https://slack.com/api/chat.postMessage'

export class EchoSlackService {
  private config: EchoSlackConfig

  private dev: boolean

  private appName: string

  constructor(settings: AppSettings) {
    this.config = settings?.EchoSlack as EchoSlackConfig
    this.dev = settings?.Environment?.IsDev
    this.appName = settings?.AppName
  }

  async send(
    api: RequestClient,
    label: EchoSlack['label'],
    slackData: EchoSlack['data'],
    messageOptions: EchoSlack['options'] = {},
  ) {
    const options = this.parseOptions(messageOptions)
    const slack = this.parseData(label, slackData, options.info)
  
    if (!options.send) return
  
    try {
      const data = {
        'channel': this?.config?.channel ?? DEFAULT_CHANNEL,
        text: slack,
        'as_user': false,
        'username': `${this.appName} Log`,
        'icon_url': this?.config?.icon,
      }
  
      await api.post('', data, {
        baseURL: this?.config?.baseURL ?? DEFAULT_BASE_URL,
        headers: {
          Authorization: `Bearer ${this?.config?.token}`,
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
  
    if (!isDebug && this.dev || !isRelease && !this.dev) {
      return {
        info: '',
        send: false,
      }
    }
  
    let str = ''
    const separator = ' - '
  
    include.forEach(k => {
      const data = this.serializers[k]?.(this.dev)
      str = `${str}${str.length > 0 ? separator : ''}[${data}]`
    })
  
    return {
      info: str,
      send: true,
    }
  }
  
  private parseData(label: string, data: object, info: string) {
    const obj = !info ? data : {
      ...data,
      info,
    }
  
    const args = [`${label}: `, obj]
  
    const slack = args.map(i => {
      if (typeof i === 'object') {
        try {
          return JSON.stringify(i, null, 2)
        } catch (e) {
          return `${i} (Unserializable value)`
        }
      }
  
      return String(i)
    }).join(' ')
  
    return slack
  }
}
