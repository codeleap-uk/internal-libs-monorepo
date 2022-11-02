import cp from 'child_process'

export const getNewBundleName = (newName:string) => `uk.co.codeleap.${newName.trim()}`

export function subprocess(name:string, ...params: Parameters<typeof cp.spawn>) {
  return new Promise<void|number|null>((resolve, reject) => {
    console.log(`Running ${params[0]} ${params[1].join(' ')}`)
    const child = cp.spawn(...params)

    child.on('error', (err) => {
      console.log(`${name} finished with error: `, err.toString())
      reject(err)
    })

    child.on('close', (code) => {
      console.log(`${name} finished with code: `, code)
      if (code !== 0) {
        reject(`${name} finieshed with non zero exit code`)
      } else {
        resolve(code)
      }
    })

    child.stdout?.on?.('data', (outdata) => {
      console.log(outdata.toString())
    })

    child.stderr?.on?.('data', (errdata) => {
      console.error(errdata.toString())
    })
  })
}

import path from 'path'
import fs from 'fs'

export {
  fs, path,
}
