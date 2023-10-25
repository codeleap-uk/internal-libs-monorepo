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
    // console.error('error checking deployment', e)
    process.exit(1)

  }
  return false
}

export const Codepush = {
  getApplication,
  addDeployment,
  updateDeployment,
  deploymentExists,
}
