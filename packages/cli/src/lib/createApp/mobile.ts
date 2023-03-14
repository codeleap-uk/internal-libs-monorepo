import { MOBILE_TEMPLATE_URL, cwd, orgName, USER_CONFIG } from '../../constants'
import path from 'path'
import { initRepoFromTemplate } from './common'
import { git, inquirer, listPrompt, octokit, renameAndroid, renameIos } from '..'
import { spinWhileNotCompleted } from '../spinner'
import { crypto_box_seal } from 'libsodium-wrappers'
import { generateReleaseKeystore } from '../android/keystore'
import { loadFirebaseAdmin } from '../firebase'
type CreateMobileAppParams = {
    name: string, location?: string, client?: boolean
}

export async function createMobileApp(params: CreateMobileAppParams) {
  const {
    name,
    client = true,
  } = params

  let {
    location = null,
  } = params

  const repoName = `${client ? 'x-' : ''}${name}-mobile`

  if (!location) {
    location = path.join(cwd, repoName)
  }

  await spinWhileNotCompleted(
    () => initRepoFromTemplate(MOBILE_TEMPLATE_URL, location),
    {
      name: `Creating local repository at ${location}`,
    },
  )

  await git.cwd({
    path: location,
  })

  let repoUrl = ''

  // await spinWhileNotCompleted(
  //   async () => {
  //     try {
  //       const response = await octokit.request('POST /orgs/{org}/repos', {
  //         org: orgName,
  //         name: repoName,
  //         description: `${name} mobile app`,
  //         'private': true,
  //       })
  //       repoUrl = response.data.ssh_url
  //     } catch (e) {
  //       console.log(`Repository ${repoName} already exists, skipping creation...`)
  //     } repoUrl = `git@github.com:${orgName}/${repoName}.git`

  //   },
  //   {
  //     name: `Creating remote repository ${repoName}`,
  //   },
  // )

  // await spinWhileNotCompleted(
  //   () => git.raw('-C', location, 'remote', 'add', 'origin', repoUrl),
  //   {
  //     name: 'Adding repo remote url',
  //   },
  // )

  await inquirer.prompt({
    type: 'confirm',
    name: 'wait',
    message: 'To initialize firebase, do the following:'+ listPrompt([
      'Create a firebase project.',
      'Replace the content of firebase_admin.json with the credentials from your project.'
    ],true) + 'For detailed instructions, see http://docs.codeleap.co.uk/mobile/starting-a-project.\n Make sure to change the file before proceeding.'
  })

  const firebase = await loadFirebaseAdmin(
    path.join(location, 'firebase_admin.json')
  )

  const androidFolder = path.join(location, 'android')
  await spinWhileNotCompleted(
    () => generateReleaseKeystore(androidFolder),
    {
      name: 'Generating release.keystore'
    }
  )

  await spinWhileNotCompleted(
    () => renameAndroid(androidFolder, name, {
      changeBundle: true,
      firebase
    }),
    {
      name: 'Renaming android app',
    },
  )

  
   
 
  // const iosFolder = path.join(location, 'ios')

  // await spinWhileNotCompleted(
  //   () => renameIos(iosFolder, name, {
  //     changeBundle: true,
  //     firebase
  //   }),
  //   {
  //     name: 'Renaming ios app',
  //   },
  // )

  // await spinWhileNotCompleted(
  //   async () => {

  //     await git.raw('-C', location, 'add', '.')
  //     await git.raw('-C', location, 'commit', '-m', 'Initialize project')
  //     await git.raw('-C', location, 'push', 'origin', 'master')

  //   },
  //   {
  //     name: 'Pushing changes to repository',
  //   },
  // )

  // const secrets = {
  //   'GH_PAT': USER_CONFIG.GITHUB_TOKEN,
  //   'REPOSITORY_BRANCH': name,
  // }
  // const pubKey = await octokit.request('GET /repos/{owner}/{repo}/actions/secrets/public-key', {
  //   owner: orgName,
  //   repo: repoName,
  // })

  // const repoPublicKey = Buffer.from(pubKey.data.key, 'base64')

  // for (const [key, value] of Object.entries(secrets)) {
  //   const valBuffer = Buffer.from(value)
  //   const encriptedVal = Buffer.from(
  //     crypto_box_seal(valBuffer, repoPublicKey),
  //   ).toString('base64')

  //   await octokit.rest.actions.createOrUpdateRepoSecret({
  //     owner: orgName,
  //     repo: repoName,
  //     secret_name: key,
  //     encrypted_value: encriptedVal,
  //     key_id: pubKey.data.key_id,

  //   })
  // }

}
