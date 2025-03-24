import { USER_CONFIG } from '../../constants'
import { fs, path } from '../../lib'

const iosName = USER_CONFIG.splash.iosAppName
const splashImagePath = USER_CONFIG.splash.splashImagePath
const baseDir = USER_CONFIG.splash.assetsDir

const androidSourceDir = path.join(baseDir, 'android')
const androidDestDir = './android/app/src/main/res'

const iosSourceDir = path.join(baseDir, 'ios')
const iosDestDir = `./ios/${iosName}`

const iosSplashDir = `./ios/${iosName}/Images.xcassets/splash.imageset`
const androidSplashFileName = 'launch_screen.png'

function copyFiles(src: string, dest: string) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }

  fs.readdirSync(src).forEach(file => {
    const srcFile = path.join(src, file)
    const destFile = path.join(dest, file)

    if (fs.statSync(srcFile).isDirectory()) {
      copyFiles(srcFile, path.join(dest, file))
    } else {
      fs.copyFileSync(srcFile, destFile)
      console.log(`File: ${srcFile} -> ${destFile}.`)
    }
  })
}

export async function syncSplash() {
  console.log('Splash -> Syncing Android')

  if (!fs.existsSync(androidSourceDir)) {
    console.log('Android folder not found.')
    return false
  }

  fs.readdirSync(androidSourceDir).forEach(folder => {
    const sourcePath = path.join(androidSourceDir, folder)
    const destPath = path.join(androidDestDir, folder)

    if (fs.statSync(sourcePath).isDirectory() && folder.startsWith('drawable')) {
      copyFiles(sourcePath, destPath)
    }
  })

  console.log('Splash -> Syncing ios')

  if (!fs.existsSync(iosSourceDir)) {
    console.log('Ios folder not found!')
    return
  }

  copyFiles(iosSourceDir, iosDestDir)

  console.log('Sync concluded!')

  return true
}

export async function syncLaunchScreen() {
  if (!fs.existsSync(splashImagePath)) {
    console.log(`LaunchScreen -> Splash file ${splashImagePath} not found!`)
    return false
  }

  console.log('LaunchScreen -> Syncing Android')

  fs.readdirSync(androidDestDir).forEach(folder => {
    const possibleTarget = path.join(androidDestDir, folder, androidSplashFileName)

    if (fs.existsSync(possibleTarget)) {
      fs.copyFileSync(splashImagePath, possibleTarget)
      console.log(`File: ${possibleTarget}`)
    }
  })

  console.log('LaunchScreen -> Syncing ios')

  fs.readdirSync(iosSplashDir).forEach(file => {
    const filePath = path.join(iosSplashDir, file)
    
    if (file.endsWith('.png') && fs.statSync(filePath).isFile()) {
      fs.copyFileSync(splashImagePath, filePath)
      console.log(`File: ${filePath}`)
    }
  })

  console.log('Sync concluded!')

  return true
}