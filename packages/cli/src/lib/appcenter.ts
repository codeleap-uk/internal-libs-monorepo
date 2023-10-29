import { getCliSettings } from './getCliSettings'
import { subprocess, waitFor } from './utils'
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

function getAPI(token?: string, platform?: ApplicationPlatform) {
  if (!token && !!platform) {
    token = getCliSettings().codepush?.[platform]?.ApiToken
  }

  return axios.create({
    baseURL: 'https://api.appcenter.ms/v0.1',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Token': token,
      'Accept': 'application/json',
    },
  })
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
  const api = getAPI(undefined, platform)

  try {

    const response = await api.get(`/apps/${application}/deployments/${name}`, {
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
  const api = getAPI(token, platform)

  const platformName = {
    ios: 'iOS',
    android: 'Android',
  }[platform]

  const appName = `${settings.ApplicationName}-${platformName}`

  const createAppResponse = await api.post(`/orgs/${settings.OwnerName}/apps`, {
    'description': appName,
    'release_type': `Beta`,
    'display_name': appName,
    'name': appName,
    'os': platformName,
    'platform': 'React-Native',
  })

  await waitFor(3000)

  const createTokenResponse = await api.post(`/apps/${settings.OwnerName}/${appName}/api_tokens`, {
    description: 'Automation token',
    scope: [
      'all',
    ],
  })

  const appToken = createTokenResponse.data.api_token

  const app = createAppResponse.data

  return {
    app,
    appToken,
  }
}

const createDeployment = async (name: string, platform: ApplicationPlatform) => {
  const application = await getApplication(platform)
  const api = await getAPI(undefined, platform)
  const response = await api.post(`/apps/${application}/deployments`, {
    name,
  })

  return response.data
}

export const Codepush = {
  getApplication,
  addDeployment,
  updateDeployment,
  createApplication,
  deploymentExists,
  createDeployment,
}
