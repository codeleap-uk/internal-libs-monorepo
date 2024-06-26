'use strict'

const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

async function copyFilesAndDirectorySync(source, destination) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination)
  }

  const files = fs.readdirSync(source)

  files.forEach(file => {
    const sourcePath = path.join(source, file)
    const destinationPath = path.join(destination, file)

    if (fs.statSync(sourcePath).isDirectory()) {
      copyDirectorySync(sourcePath, destinationPath)
    } else {
      fs.copyFileSync(sourcePath, destinationPath)
    }
  })

  console.log('Directory copied successfully!')
}

async function main() {
  // console.log('[INFO] Copying PATCHES from Mobile-Template')

  // await copyFilesAndDirectorySync('./apps/mobile/patches', './patches')
}

main()
