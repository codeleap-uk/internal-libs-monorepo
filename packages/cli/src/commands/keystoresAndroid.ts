// import { waitFor } from '@codeleap/common'
import { codeleapCommand } from '../lib/Command'

import { subprocess, path } from '../lib'
import generator from 'generate-password'
import { AndroidConfigFile } from '../lib/android/keystore'
import { cwd } from '../constants'

async function genKeystore(type: 'release' | 'debug') {
  const pass = generator.generate({
    length: 26,
    lowercase: true,
    numbers: true,
    strict: true,
    symbols: true,
    uppercase: true,
  })

  const alias = type

  const keystoresDir = path.join(cwd, 'android', 'app', 'keystores')

  const fileName = `${type}.keystore`

  await subprocess('Generating keystore', 'keytool', [
    '-genkeypair ',
    '-v',
    '-storetype',
    'PKCS12',
    '-keystore',
    fileName,
    '-alias',
    alias,
    '-keyalg',
    'RSA',
    '-keysize',
    '2048',
    '-storepass',
    pass,
    '-keypass',
    pass,
    '-validity',
    '11000',
    '-dname',
    'CN=Victor Rothberg, OU=Development, O=Codeleap, L=London, ST=Greater London, C=GB',
  ], {
    cwd: keystoresDir,
  })

  return {
    'storePassword': pass,
    'keyAlias': alias,
    'keyPassword': pass,
    'file': path.join(keystoresDir, fileName),
    'keyname': fileName,
    keystoresDir,
  }
}

export const generateReleaseKey = codeleapCommand(
  {
    name: 'keystores-android',
    parameters: [],
    alias: 'i',
  },
  async ({ _ }) => {

    const releaseCredentials = await genKeystore('release')

    const configFile = new AndroidConfigFile(path.join(releaseCredentials.keystoresDir, 'config.json'))

    configFile.setKey(releaseCredentials.keyname, releaseCredentials)
    const log = [
      `Generated ${releaseCredentials.keyname} at ${releaseCredentials.keystoresDir}.`,
      `Upload this file as a document to 1Password, and add the following to it's "notes" section`,
      JSON.stringify(configFile.data, null, 1),
    ].join('\n')
    console.log(
      log,
    )
  },
)
