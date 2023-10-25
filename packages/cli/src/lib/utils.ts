import cp from 'child_process'

export const getNewBundleName = (newName:string) => `uk.co.codeleap.${newName.trim()}`

export function subprocess(name:string, ...params: Parameters<typeof cp.spawn>) {
  return new Promise<{stdout: string[]; stderr: string[]}>((resolve, reject) => {
    const stdout = []
    const stderr = []

    console.log(`Running ${params[0]} ${params[1].join(' ')}`)
    const child = cp.spawn(
      params[0],
      params[1].map(x => {
        if (typeof x === 'string') return x
        return JSON.stringify(x)
      }),
      params[2],
    )

    child.on('error', (err) => {
      console.log(`${name} finished with error: `, err.toString())
      reject(err)
    })

    child.on('close', (code) => {
      console.log(`${name} finished with code: `, code)
      if (code !== 0) {
        reject(`${name} finieshed with non zero exit code`)
      } else {
        resolve({
          stdout,
          stderr,
        })
      }
    })

    child.stdout?.on?.('data', (outdata) => {
      console.log(outdata.toString())
      stdout.push(outdata.toString())
    })

    child.stderr?.on?.('data', (errdata) => {
      console.error(errdata.toString())
      stderr.push(errdata.toString())
    })
  })
}

export function listPrompt(items:string[], numbered = false) {
  const textArr = items.map((i, idx) => {
    const prefix = numbered ? `${idx + 1}. ` : '- '

    return `${prefix}${i}`
  })

  return `\n${textArr.join('\n')}\n`
}

import path from 'path'
import fs from 'fs'
import os from 'os'
export {
  fs, path,
}

export function findExecutable(exec: string) {
  if (os.platform() === 'win32') return

  return cp.execSync('which ' + exec).toString().replace(/\n/g, '')
}

const separators = /[\\\/]+/

export function parseFilePathData(path: string) {
  const parts = path.split(separators)

  const lastPart = parts[parts.length - 1]

  let fileName = lastPart
  let ext = ''

  if (lastPart.includes('.')) {
    const dotIdx = fileName.lastIndexOf('.')
    fileName = fileName.substring(0, dotIdx)

    ext = lastPart.substring(dotIdx + 1)
  }

  return {
    path: parts.slice(0, -1).join('/'),
    extension: ext,
    name: fileName,
  }
}
