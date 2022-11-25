import fs from 'fs'
import path from 'path'
import { cwd } from '../../constants'

export const getIosBundleId = (pbxProjectContent: string) => {
  const pkgStr = 'PRODUCT_BUNDLE_IDENTIFIER ='

  const packageIdx = pbxProjectContent.indexOf(pkgStr) + pkgStr.length
  let packageName = pbxProjectContent.substring(packageIdx)
  const packageEndIdx = packageName.indexOf(';')
  packageName = packageName.substring(0, packageEndIdx)
  return packageName.trim()
}

export const getIosAppName = (pbxProjectContent: string) => {
  const pkgStr = 'PRODUCT_NAME ='
  const packageIdx = pbxProjectContent.indexOf(pkgStr) + pkgStr.length
  let packageName = pbxProjectContent.substring(packageIdx)
  const packageEndIdx = packageName.indexOf(';')
  packageName = packageName.substring(0, packageEndIdx)
  return packageName.trim()
  // return JSON.parse(
  //   fs.readFileSync(
  //     path.join(cwd, 'app.json'),
  //   ).toString(),
  // ).name
}

