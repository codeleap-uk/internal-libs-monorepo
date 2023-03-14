import { getNewBundleName } from '../utils'
import { getIosAppName, getIosBundleId } from './utils'
import path from 'path'
import fs from 'fs'
import { walkDir } from '../walk'
import _firebase from 'firebase-admin'


type RenameiosOptions = {
    changeBundle?: boolean
    firebase?: _firebase.app.App
}

export async function renameIos(
  iosFolder: string,
  newName: string,
  options?: RenameiosOptions,
) {
  const { firebase } = options  || {}
  const newBundleName = getNewBundleName(newName)

  const pbxProjPath = path.join(
    iosFolder,
    fs.readdirSync(iosFolder).find(x => x.endsWith('.xcodeproj')),
    'project.pbxproj',
  )

  const pbxProj = fs.readFileSync(
    pbxProjPath,
  ).toString()

  const bundleId = getIosBundleId(pbxProj)
  const currentName = getIosAppName(pbxProj)
  const renameQueue = []
  newName = newName.trim()

  await walkDir({
    action: (info) => {

      // console.log({ a: info.name })
      if (info.name.includes(currentName)) {

        const renameRegex = new RegExp(currentName, 'g')
        const lastMatch = info.path.lastIndexOf(currentName)

        let idx = 0

        renameQueue.push({
          from: info.path.replace(
            renameRegex,
            (str, i) => {

              if (i == lastMatch) {
                return str
              }
              idx++
              return newName
            },
          ),
          to: info.path.replace(
            renameRegex,
            newName,
          ),
        })
      }
      if (!info.isDir) {
        let content = info.file.content
        if (options?.changeBundle) {
          content = content.replace(new RegExp(`${bundleId}`, 'g'), newBundleName)
        }
        const nameExp = new RegExp(`(?<!\\.)${currentName}`, 'g')
        return content.replace(nameExp, newName)

      }
    },
    path: iosFolder,
    options: {
      scanFileContent: true,
      ignore: [
        {
          name: 'GoogleService-Info',
          ext: ['plist'],
          file: true,
        },
        {
          ext: ['png', 'jpg', 'jpeg'],
          file: true,
        },
      ],
    },
  })

  renameQueue.sort((a, b) => a.to.length - b.to.length)
  renameQueue.forEach((i) => {
    fs.renameSync(i.from, i.to)

  })
  if (!firebase) return
  const pm = firebase.projectManagement()

  const iosAppReqs = (await pm.listIosApps()).map(async a => {
    return {
      ...a,
      meta: (await a.getMetadata()),
    }
  })
  const iosApps = await Promise.all(iosAppReqs)
  const googleServiceFile = path.join(iosFolder, newName, 'GoogleService-Info.plist')
  if (!iosApps.some(a => a.meta.bundleId === newBundleName)) {
    console.log(`Creating new ios app on firebase and updating GoogleService-Info.plist...`)
    const newApp = await pm.createIosApp(newBundleName, newName.trim())
    const newPlistFile = await newApp.getConfig()
    fs.writeFileSync(googleServiceFile, newPlistFile, {
      encoding: 'utf-8',
    })

  }

}
