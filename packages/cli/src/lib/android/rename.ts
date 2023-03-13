/* eslint-disable handle-callback-err */
import { getNewBundleName, parseFilePathData } from '../utils'
import { getAndroidAppName, getAndroidBundleId, readGradleProperties } from './utils'
import path from 'path'
import fs from 'fs'
import { walkDir } from '../walk'
import firebase from 'firebase-admin'
import Keytool from 'node-keytool'
// import { parseFilePathData } from '@codeleap/common'
import { firebaseApp } from '../firebase'

type RenameAndroidOptions = {
    changeBundle?: boolean
}

export async function renameAndroid(
  androidFolder: string,
  newName: string,
  options?: RenameAndroidOptions,
) {
  const newBundleName = getNewBundleName(newName)

  const androidManifest = fs.readFileSync(
    path.join(androidFolder, 'app', 'src', 'main', 'AndroidManifest.xml'),
  ).toString()
  const stringsXml = fs.readFileSync(
    path.join(androidFolder, 'app', 'src', 'main', 'res', 'values', 'strings.xml'),
  ).toString()
  const bundleId = getAndroidBundleId(androidManifest)
  const currentName = getAndroidAppName(stringsXml)

  await walkDir({
    action: (info) => {
      if (!info.isDir) {
        let content = info.file.content
        if (options?.changeBundle) {
          content = content.replace(new RegExp(`${bundleId}`, 'g'), newBundleName)
        }
        const nameExp = new RegExp(`(?<!\\.)${currentName}`, 'g')

        return content.replace(nameExp, newName.trim())

      }
    },
    path: androidFolder,
    options: {
      scanFileContent: true,
      ignore: [
        {
          name: 'google-services',
          ext: ['json'],
          file: true,
        },
        {
          ext: ['png', 'jpg', 'jpeg'],
          file: true,
        },
        {
          name: 'gradle-wrapper',
          file: true,
        },
        {
          ext: ['keystore'],
          file: true,
        },
        {
          name: 'app/build',
          dir: true,

        },
      ],
    },
  }).then(() => {
    if (options.changeBundle && newBundleName !== bundleId) {
      const javaFolder = path.join(androidFolder, 'app', 'src', 'main', 'java')
      const mainActivityFolder = path.join(javaFolder, ...bundleId.split('.'))

      let scan = javaFolder

      for (const part of newBundleName.split('.')) {
        const folder = path.join(scan, part)
        if (!fs.existsSync(
          folder,
        )) {
          fs.mkdirSync(folder)
        }
        scan = folder
      }

      for (const file of fs.readdirSync(mainActivityFolder)) {
        fs.copyFileSync(
          path.join(mainActivityFolder, file),
          path.join(scan, file),
        )
      }
      fs.rmSync(mainActivityFolder, {
        recursive: true,
        force: true,
      })

    }
  })
  if (!firebaseApp) return
  const pm = firebase.projectManagement()

  const androidAppReqs = (await pm.listAndroidApps()).map(async a => {
    return {
      ...a,
      meta: (await a.getMetadata()),
    }
  })
  const androidApps = await Promise.all(androidAppReqs)
  const googleServiceFile = path.join(androidFolder, 'app', 'google-services.json')
  if (!androidApps.some(a => a.meta.packageName === newBundleName)) {
    console.log(`Creating new android app on firebase and updating google-services.json`)
    const newApp = await pm.createAndroidApp(newBundleName, newName.trim())
    const newGoogleServicesFile = await newApp.getConfig()
    fs.writeFileSync(googleServiceFile, newGoogleServicesFile, {
      encoding: 'utf-8',
    })
    const keystoresFolder = path.join(androidFolder, 'app', 'keystores')
    const keystores = fs.readdirSync(keystoresFolder, {
      withFileTypes: true,
    })

    for (const keystore of keystores) {
      const keyPathData = parseFilePathData(keystore.name)
      const valid = ['jks', 'keystore'].includes(keyPathData.extension) && keystore.isFile()

      if (!valid) {
        continue
      }
      const storeTypeMap = {
        'keystore': 'PKCS12',
        'jks': 'JKS',
      }
      const gradleProperties = readGradleProperties(androidFolder)

      const key = Keytool(
        path.join(keystoresFolder, keystore.name),
        gradleProperties[`${keyPathData.name.toUpperCase()}_KEY_PASSWORD`],
        { debug: false, storeType: storeTypeMap[keyPathData.extension] },
      )

      key.list((err, vals) => {
        vals.certs.forEach(c => {
          newApp.addShaCertificate({
            certType: c.algorithm.toLowerCase().replace('-', ''),
            shaHash: c.fingerprint,

          })
        })
      })
    }

  }

}
