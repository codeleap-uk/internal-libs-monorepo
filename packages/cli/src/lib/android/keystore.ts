import { fs } from '../utils'

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
