import { fs } from '../../lib'
import { AppType } from '../../types'

export function capitalize(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export function formatComponentName(name: string) {
  return capitalize(name.charAt(0).toUpperCase() + name.slice(1))
}

export function generateComponentFile(componentName: string, app: AppType): string {
  const rootDir = app === 'web' ? '@/config' : '@/app'

  return `import { React, StyleRegistry, StyleSheets } from '${rootDir}'
import { StyledComponent } from '@codeleap/styles'
import { useStylesFor } from '@codeleap/${app}'

type ${componentName}Props = {
  switchServerOnPress?: boolean
  inverseColor?: boolean
}

export const ${componentName}: StyledComponent<
  typeof StyleSheets.${componentName}Styles,
  ${componentName}Props
> = props => {
  const styles = useStylesFor(${componentName}.styleRegistryName, props?.style)
  return null
}

${componentName}.styleRegistryName = '${componentName}'
${componentName}.elements = []

StyleRegistry.registerComponent(${componentName})
`
}

export function generateStylesheetFile(componentName: string, app: AppType): string {
  return `import { createStyles } from '@codeleap/styles'
import { StyleRegistry } from '../styles'

export type ${componentName}Composition = ''

const create${componentName}Variant = createStyles<${componentName}Composition>

export const ${componentName}Styles = {
  default: create${componentName}Variant(theme => ({})),
}

StyleRegistry.registerVariants('${componentName}', ${componentName}Styles)
`
}

type CreateFileProps = {
  dir: string
  filePath: string
  content: string
  fileName: string
}

export function createFile({ dir, filePath, content, fileName }: CreateFileProps) {
  if (fs.existsSync(filePath)) {
    console.error(`❌ ${fileName} already exists in ${filePath}.`)
    return
  }

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log(`📁 Created directory: ${dir}`)
  }

  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`✅ ${fileName} created successfully at: ${filePath}`)
}

export function updateStylesheetsImport(stylesheetsDir: string, componentName: string) {
  const indexTsPath = `${stylesheetsDir}/index.ts`
  const indexTsxPath = `${stylesheetsDir}/index.tsx`

  let indexPath: string
  if (fs.existsSync(indexTsPath)) {
    indexPath = indexTsPath
  } else if (fs.existsSync(indexTsxPath)) {
    indexPath = indexTsxPath
  } else {
    console.error(`❌ index.ts or index.tsx not found in ${stylesheetsDir}`)
    return
  }

  const currentContent = fs.readFileSync(indexPath, 'utf-8')
  const exportStatement = `export { ${componentName}Styles } from './${componentName}'`
  const updatedContent = currentContent.trimEnd() + '\n' + exportStatement + '\n'

  fs.writeFileSync(indexPath, updatedContent, 'utf-8')
  console.log(`✅ Added export for ${componentName}Styles to ${indexPath}`)
}

export function updateComponentsImport(componentsDir: string, componentFolder: string, componentName: string) {
  const indexTsPath = `${componentsDir}/index.ts`
  const indexTsxPath = `${componentsDir}/index.tsx`

  let indexPath: string
  if (fs.existsSync(indexTsPath)) {
    indexPath = indexTsPath
  } else if (fs.existsSync(indexTsxPath)) {
    indexPath = indexTsxPath
  } else {
    console.error(`❌ index.ts or index.tsx not found in ${componentsDir}`)
    return
  }

  const currentContent = fs.readFileSync(indexPath, 'utf-8')
  const exportPattern = `export * from './${componentFolder}'`

  if (!currentContent.includes(exportPattern)) {
    const updatedContent = currentContent.trimEnd() + '\n' + exportPattern + '\n'
    fs.writeFileSync(indexPath, updatedContent, 'utf-8')
    console.log(`✅ Added export for ${componentFolder} to ${indexPath}`)
  } else {
    console.log(`ℹ️ Export for ${componentFolder} already exists in ${indexPath}`)
  }

  const componentIndexTsPath = `${componentsDir}/${componentFolder}/index.ts`
  const componentIndexTsxPath = `${componentsDir}/${componentFolder}/index.tsx`

  let componentIndexPath: string
  if (fs.existsSync(componentIndexTsPath)) {
    componentIndexPath = componentIndexTsPath
  } else if (fs.existsSync(componentIndexTsxPath)) {
    componentIndexPath = componentIndexTsxPath
  } else {
    componentIndexPath = componentIndexTsPath
    fs.writeFileSync(componentIndexPath, '', 'utf-8')
    console.log(`📁 Created file: ${componentIndexPath}`)
  }

  const componentCurrentContent = fs.readFileSync(componentIndexPath, 'utf-8')
  const componentExportStatement = `export * from './${componentName}'`
  const componentUpdatedContent = componentCurrentContent.trimEnd() + '\n' + componentExportStatement + '\n'

  fs.writeFileSync(componentIndexPath, componentUpdatedContent, 'utf-8')
  console.log(`✅ Added export for ${componentName} to ${componentIndexPath}`)
}
