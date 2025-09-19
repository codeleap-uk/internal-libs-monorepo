import { fs } from '../../lib'

export function capitalize(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export function formatComponentName(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

export function generateComponentFile(name: string): string {
  const componentName = capitalize(name)

  return `import { React, StyleRegistry, StyleSheets } from '@/app'
import { StyledComponent } from '@codeleap/styles'

type ${componentName}Props = {
  switchServerOnPress?: boolean
  inverseColor?: boolean
}

export const ${componentName}: StyledComponent<
  typeof StyleSheets.${componentName}Styles,
  ${componentName}Props
> = props => {
  return null
}

${componentName}.styleRegistryName = '${componentName}'
${componentName}.elements = []

StyleRegistry.registerComponent(${componentName})
`
}

export function generateStylesheetFile(name: string): string {
  const componentName = capitalize(name)

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

export function updateStylesheetsImport(stylesheetsDir: string, name: string) {

}
