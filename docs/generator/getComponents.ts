import { Component } from './types'
import { GeneratorConfig } from './config'
import { GenLogger } from './logger'

const fs = require('fs')

export async function getComponents() {
  const components: Component[] = []

  console.log(__dirname)

  const allComponentDirPath = `./packages/${GeneratorConfig.package}/src/components`

  const allComponents = fs.readdirSync(allComponentDirPath, {
    'withFileTypes': true,
  })

  allComponents.forEach((dir, i) => {
    const enabled = i >= GeneratorConfig.maxTypedocsGenerator || !dir.isDirectory() || dir.isFile()
    
    if (enabled) return

    GenLogger.log(dir?.name)

    const componentPath = `./packages/${GeneratorConfig.package}/src/components/${dir?.name}/index.tsx`

    let fileExists = true

    try {
      fs.accessSync(componentPath)
    } catch (e) {
      fileExists = false
    }

    if (fileExists) {
      const data: Component = { name: dir.name, path: componentPath }

      GenLogger.log(data)

      components.push(data)
    }
  })

  return components
}
