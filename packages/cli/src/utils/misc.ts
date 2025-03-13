import { USER_CONFIG, cliDir } from '../constants'
import { fs, path } from '../lib'

export function logObj(obj: Record<string, any>) {
  return console.log(JSON.stringify(obj, null, 2))
}

type PathValue = string | Array<string>

type Path = PathValue | ((p: typeof USER_CONFIG) => PathValue)

function transformPath(p: Path) {
  let toResolvePath = typeof p == 'function' ? p(USER_CONFIG) : p
  
  if (!Array.isArray(toResolvePath)) {
    if (toResolvePath?.startsWith('/')) {
      const [_, ...restPath] = toResolvePath
      toResolvePath = restPath.join('')
    }
    return toResolvePath
  } else {
    return path.join(...toResolvePath)
  }
}

export function resolveJSON<T extends Record<string, any>>(p: Path) {
  try {
    const transformedPath = transformPath(p)
    return JSON.parse(fs.readFileSync(path.resolve(cliDir, transformedPath)).toString()) as T
  } catch {
    return null
  }
}

export function resolveFile(p: Path) {
  try {
    const transformedPath = transformPath(p)
    return fs.readFileSync(path.resolve(cliDir, transformedPath), 'utf-8')
  } catch {
    return null
  }
}

export function resolveDir(p: Path) {
  try {
    const transformedPath = transformPath(p)
    return fs.readdirSync(path.resolve(cliDir, transformedPath))
  } catch {
    return null
  }
}

export function writeFile(p: Path, content: any) {
  try {
    const transformedPath = transformPath(p)
    return fs.writeFileSync(path.resolve(cliDir, transformedPath), content, 'utf-8')
  } catch {
    return null
  }
}