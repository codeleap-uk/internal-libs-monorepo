import fs from 'fs'
import path from 'path'
import { cwd } from '../../constants'
export const getAndroidBundleId = (androidManifestContent: string) => {
  const pkgStr = 'package="'
  const packageIdx = androidManifestContent.indexOf(pkgStr) + pkgStr.length
  let packageName = androidManifestContent.substring(packageIdx)
  const packageEndIdx = packageName.indexOf('"')
  packageName = packageName.substring(0, packageEndIdx)
  return packageName.trim()
}
export const getAndroidAppName = (stringsXmlContent: string) => {
  const pkgStr = 'name="app_name">'
  const packageIdx = stringsXmlContent.indexOf(pkgStr) + pkgStr.length
  let packageName = stringsXmlContent.substring(packageIdx)
  const packageEndIdx = packageName.indexOf('<')
  packageName = packageName.substring(0, packageEndIdx)
  return packageName.trim()

  // return JSON.parse(
  //   fs.readFileSync(
  //     path.join(cwd, 'app.json'),
  //   ).toString(),
  // ).name
}

export const readGradleProperties = (androidFolder: string) => {
  const paths = [
    path.join(androidFolder, 'gradle.properties'),
  ]

  const appProperties = path.join(androidFolder, 'app', 'gradle.properties')
  if (fs.existsSync(appProperties)) {
    paths.push(appProperties)
  }

  let mergedProps = {}
  paths.forEach(path => {
    const data = fs.readFileSync(path).toString()

    const lines = data.split('\n').map(x => x.replace(/\n/g, '').replace(/\r/g, '')).filter(x => !!x.trim())

    const props = {}

    lines.forEach(l => {
      if (l.startsWith('#')) return
      const lineParts = l.split('=')
      if (lineParts.length < 2) return
      const value = lineParts[1].trim().split(' ')[0]
      const property = lineParts[0].trim()
      props[property] = value
    })

    mergedProps = {
      ...mergedProps,
      ...props,
    }
  })
  return mergedProps
}
