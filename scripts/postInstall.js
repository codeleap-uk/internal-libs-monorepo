/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const fs = require('fs')
const path = require('path')

async function deleteFilesAndDirectory(directory) {
  try {
    const directoryExists = await fs.existsSync(directory)

    if (!directoryExists) {
      console.log(`Directory "${directory}" does not exist.`)
      return
    }

    const files = await fs.readdirSync(directory)

    await Promise.all(files.map(async (file) => {
      const filePath = path.join(directory, file)
      
      const stat = await fs.statSync(filePath)

      if (stat.isDirectory()) {
        await deleteFilesAndDirectory(filePath)
      } else {
        await fs.unlinkSync(filePath)
      }
    }))

    await fs.rmdirSync(directory)
    console.log(`Directory "${directory}" and files deleted successfully!`)
  } catch (e) {
    console.log(`Error deleting directory: ${e.message}`)
  }
}

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
  await deleteFilesAndDirectory('./patches')

  console.log('Copying PATCHES from the Mobile-Template')

  await copyFilesAndDirectorySync('./apps/mobile/patches', './patches')
}

main()
