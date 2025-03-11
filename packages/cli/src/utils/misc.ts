import { USER_CONFIG, cliDir } from '../constants'
import { fs, path } from '../lib'

export function logObj(obj: Record<string, any>) {
  return console.log(JSON.stringify(obj, null, 2))
}

export function resolveJSON<T extends Record<string, any>>(p: string | ((p: typeof USER_CONFIG) => string)) {
  try {
    let toResolvePath = typeof p == 'function' ? p(USER_CONFIG) : p
    if (toResolvePath?.startsWith('/')) {
      const [_, ...restPath] = toResolvePath
      toResolvePath = restPath.join('')
    }
    return JSON.parse(fs.readFileSync(
      path.resolve(cliDir, toResolvePath)
    ).toString()) as T
  } catch {
    return null
  }
}