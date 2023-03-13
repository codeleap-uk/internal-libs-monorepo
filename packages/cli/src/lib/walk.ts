// import { parseFilePathData, TypeGuards } from '@codeleap/common'
import fs from 'fs'
import dive from 'dive'
import { parseFilePathData } from './utils'

type WalkDirInfo = {
    parentPath: string
    name: string
    file?: {
        content?: string
        ext: string
    }
    dir?: {
        contents: string[]
    }
    stat: fs.Stats
    err?: any
    path: string
    isDir: boolean
}

type FileMatch = {
  name?: string | RegExp
  dir?: boolean
  file?: boolean
  ext?: string[]
}

type WalkDirConfig = {
    action: (info: WalkDirInfo) => string | void
    path: string
    options?: {
        recursive?: boolean
        all?: boolean
        directories?: boolean
        files?: boolean
        scanFileContent?: boolean
        ignore?: FileMatch[]
    }
}

const matchFile = (path:string, stat:fs.Stats, config:FileMatch) => {
  const isDir = stat.isDirectory()

  if (isDir && !config.dir) {
    return false
  }

  if (!isDir && !config.file) {
    return false
  }
  const pathData = parseFilePathData(path)

  const conditions = []
  if (!!config.name) {
    let nameMatch = false

    if (config.name instanceof RegExp) {
      nameMatch = config.name.test(path)
    } else {
      const matchConfig = parseFilePathData(config.name)

      nameMatch = [
        pathData.name === matchConfig.name,
        pathData.extension === matchConfig.extension,
        pathData.path === matchConfig.path,
      ].some(x => x)
    }
    conditions.push(nameMatch)
  }

  if (!isDir && !!config.ext) {
    let extMatch = false
    extMatch = config.ext.includes(pathData.extension)

    conditions.push(extMatch)
  }

  return conditions.every(a => a)
}

export async function walkDir(config: WalkDirConfig):Promise<void> {
  const options:WalkDirConfig['options'] = {
    directories: true,
    recursive: true,
    ...config.options,
  }

  return new Promise<void>((resolve) => {

    dive(config.path, options, (err, file:string, stat:fs.Stats) => {
      const isDir = stat.isDirectory()
      const pathData = parseFilePathData(file)

      if (options.ignore) {
        const ignore = options.ignore.some((i) => matchFile(file, stat, i))
        if (ignore) return
      }

      const fileInfo:WalkDirInfo['file'] = isDir ? null : {
        ext: pathData.extension,
        content: options?.scanFileContent ? fs.readFileSync(file).toString() : '',
      }
      const dirInfo:WalkDirInfo['dir'] = isDir ? {
        contents: fs.readdirSync(file),
      } : null

      const newContent = config.action({
        path: file,
        stat,
        err,
        isDir,
        dir: dirInfo,
        name: pathData.name,
        parentPath: pathData.path,
        file: fileInfo,
      })

      if (!newContent !== null && newContent !== undefined && !isDir) {
        fs.writeFileSync(file, newContent as string)
      }
    }, () => {
      resolve()
    })

  })
}
