import { findExecutable, fs } from '../utils'
import { subprocess, path } from '../../lib'
import generator from 'generate-password'
import { cwd, USER_CONFIG } from '../../constants'

type KeystoreCredentials = {
    'storePassword': string
    'keyAlias': string
    'keyPassword': string
}

export class AndroidConfigFile {
    data = {}

    constructor(public path?:string) {

      if (fs.existsSync(path)) {
        this.data = JSON.parse(fs.readFileSync(path).toString())
      }

    }

    setKey(key:string, value: KeystoreCredentials) {
      const { keyAlias, keyPassword, storePassword } = value
      this.data[key] = {
        keyAlias, keyPassword, storePassword,
      }
      this.save()
    }

    save() {
      fs.writeFileSync(this.path, JSON.stringify(this.data, null, 2))
    }
}


async function genKeystore(type: 'release' | 'debug', _cwd = cwd) {
  const pass = generator.generate({
    length: 26,
    lowercase: true,
    numbers: true,
    strict: true,
    symbols: true,
    uppercase: true,
  })
  console.log(_cwd)
  const alias = type

  const fileName = `${type}.keystore`
  
  await subprocess('Generating keystore', findExecutable('keytool'), [
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
    `"${pass}"`,
    '-keypass',
    `"${pass}"`,
    '-validity',
    '11000',
    '-dname',
    'CN=Victor Rothberg, OU=Development, O=Codeleap, L=London, ST=Greater London, C=GB',
  ], {
    cwd: _cwd
    
  })

  return {
    'storePassword': pass,
    'keyAlias': alias,
    'keyPassword': pass,
    'keyname': fileName,
  }
}

export const generateReleaseKeystore = async (androidFolder?: string) => {
  const keystoresDir = path.join(androidFolder || cwd,  'app', 'keystores')
  
  if(fs.existsSync(path.join(keystoresDir, 'release.keystore'))){
    return
  }

  const releaseCredentials = await genKeystore('release',keystoresDir)

  const configFile = new AndroidConfigFile(
    path.join(keystoresDir, 'config.json')
  )

  configFile.setKey(releaseCredentials.keyname, releaseCredentials)
  const log = [
    `Generated ${releaseCredentials.keyname} at ${keystoresDir}.`,
    `Upload this file as a document to 1Password, and add the following to it's "notes" section`,
    JSON.stringify(configFile.data, null, 1),
  ].join('\n')
    console.log(
      log,
    )
}