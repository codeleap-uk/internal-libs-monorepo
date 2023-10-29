import { getCliSettings } from './getCliSettings'
import { subprocess } from './utils'
import axios from 'axios'

type ApplicationPlatform = 'ios' | 'android'

async function addDeployment(name: string, application: string) {
  await subprocess('Create deployment', 'appcenter', ['codepush', 'deployment', 'add', name, '-a', application], {})
}

async function getApplication(platform: ApplicationPlatform) {
  const settings = getCliSettings().codepush

  const platformSettings = settings[platform]

  if (!platformSettings) {
    const predictedName = `${settings.ApplicationName}-${platform}`
    return `${settings.OwnerName}/${predictedName}`
  }

  return `${settings.OwnerName}/${platformSettings.ApplicationName}`
}

export async function updateDeployment(name: string, application: string) {

  await subprocess('Create deployment', 'appcenter', [
    'codepush',
    'release-react',
    '-a',
    application,
    '-d',
    name,
    '-t',
    '1.0.0',
  ], {})
}

export async function deploymentExists(name: string, platform: ApplicationPlatform) {
  const application = await getApplication(platform)

  try {

    const response = await axios.get(`https://api.appcenter.ms/v0.1/apps/${application}/deployments/${name}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Token': getCliSettings().codepush[platform].ApiToken,
        'Accept': 'application/json',
      },
      validateStatus: () => true,
    })

    return response.status === 200
  } catch (e) {
    console.error('Error checking deployment', e)
    process.exit(1)

  }
  return false
}

export const createApplication = async (platform: ApplicationPlatform, token: string) => {
  const settings = getCliSettings().codepush
  const name = await getApplication(platform)

  const platformName = {
    ios: 'iOS',
    android: 'Android',
  }[platform]

  const appName = `${settings.ApplicationName}-${platformName}`

  const createAppResponse = await axios.post(`https://api.appcenter.ms/v0.1/orgs/${settings.OwnerName}/apps`, {
    'description': appName,
    'release_type': `Beta`,
    'display_name': appName,
    'name': appName,
    'os': platformName,
    'platform': 'React-Native',
  }, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Token': token,
      'Accept': 'application/json',
    },
  })

  const createTokenResponse = await axios.post(`https://api.appcenter.ms/v0.1/apps/${name}/api_tokens`, {
    description: 'Automation token',
    scope: [
      'all',
    ],
  }, {
    headers: {
      'Content-Type': 'application/json',
      'X-API-Token': token,
      'Accept': 'application/json',
    },
  })

  const appToken = createTokenResponse.data.api_token

  const app = createAppResponse.data

  return {
    app,
    appToken,
  }

}

export const Codepush = {
  getApplication,
  addDeployment,
  updateDeployment,
  createApplication,
  deploymentExists,
}
