const TypeDoc = require('typedoc')
const fs = require('fs')
const path = require('path')
const OpenAI = require('openai')

const package = 'web'
const doc_extension = 'mdx'

const componentsDirs = fs.readdirSync(`packages/${package}/src/components`, {
  'withFileTypes': true,
})

const openaiApiKey = ''

const componentDocsDirPath = './components_docs'

function deleteComponentDocsDir() {
  if (!fs.existsSync(componentDocsDirPath)) return

  fs.readdirSync(componentDocsDirPath).forEach((file, index) => {
    const filePath = path.join(componentDocsDirPath, file);

    if (fs.lstatSync(filePath).isDirectory()) {
      deleteComponentDocsDir(filePath)
    } else {
      fs.unlinkSync(filePath)
    }
  })

  fs.rmdirSync(componentDocsDirPath)

  console.log('deleted component docs dir')
}

async function main() {
  deleteComponentDocsDir()

  const entryPoints = []

  componentsDirs.forEach((dir, i) => {
    if (i >= 1 || !dir.isDirectory() || dir.isFile()) return

    console.log(dir.name)

    const path = `./packages/${package}/src/components/${dir.name}/index.tsx`

    let fileExists = true
    try {
      fs.accessSync(path)
    } catch (e) {
      fileExists = false
    }

    if (fileExists) {
      entryPoints.push({ name: dir.name, path })
    }
  })

  const openai = new OpenAI({
    apiKey: openaiApiKey,
  })

  for (const point of entryPoints) {
    const app = await TypeDoc.Application.bootstrapWithPlugins({
      entryPoints: [point.path],
      'disableSources': true,
      'excludeReferences': true,
      'excludeExternals': true,
      'excludeInternal': true,
      'excludeNotDocumented': true, // TODO filtrar o children que tem comment
      'excludeCategories': true,
      'categorizeByGroup': true,
    })

    const project = await app.convert()

    if (project) {
      const outputDir = "docs"
      await app.generateJson(project, outputDir + `/${point.name}.json`)
    }
  }

  const docsDirs = fs.readdirSync('docs', {
    'withFileTypes': true,
  })

  for (const docDir of docsDirs) {
    let componentName = docDir.name?.split('.')?.[0]
    let componentOtherName = null

    console.log(componentName + ':')

    const docContent = fs.readFileSync(`./docs/${docDir.name}`).toString()
    const data = JSON.parse(docContent)

    const { children } = data

    let propsDoc = []

    for (const _child of children) {
      componentOtherName = _child?.comment?.summary?.[0]?.text ?? null
      
      for (const _type of _child.type.types) {
        if (typeof _type?.declaration === 'object') {
          for (const _prop of _type.declaration.children) {

            if (_prop?.comment?.summary) {
              const isIndexedAccess = _prop?.type?.type === 'indexedAccess'

              let propType = ''

              if (isIndexedAccess) {
                const referenceType = _prop?.type?.objectType?.name
                const referenceName = _prop?.type?.indexType?.value

                propType = `${referenceType}['${referenceName}']`
              } else {
                propType = _prop?.type?.name
              }

              propsDoc.push({
                name: _prop?.name,
                optional: _prop?.flags?.isOptional,
                type: propType,
              })
            }
          }

        }
      }
    }

    console.log(propsDoc)

    let propsPrompt = {}

    for (const component_prop of propsDoc) {
      const prop_type = component_prop?.optional ? '?' : ''

      propsPrompt = {
        ...propsPrompt,
        [`${component_prop?.name}${prop_type}`]: component_prop?.type
      }
    }

    const prompt = `
      Write documentation for a react component named "${componentOtherName ?? componentName}", imported from the "@codeleap/${package}" package, 
      which has the following typescript props definition
      ${JSON.stringify(propsPrompt, null, 2)}
      The documentation page should follow the following format, in markdown extended:
      # < component name >
      ## Description
      <What the component shows on screen, and how the user interacts with it>
      ## Props
      <List of props with types and descriptions, specifying whether they are optional or not>
      ## Example Usage
      <Example usage of the component>
    `

    console.log(prompt)

    // return

    const propsOpenai = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ 
        role: "user", 
        content: prompt
      }],
    })

    console.log(propsOpenai)
    console.log('choices', propsOpenai?.choices)
    console.log('message\n', propsOpenai?.choices?.[0]?.message?.content)

    try {
      fs.mkdirSync(componentDocsDirPath, {
        'recursive': true,
      })
    } catch(e) {
      console.log(e)
    }
    
    fs.writeFileSync(`${componentDocsDirPath}/${componentName}.${doc_extension}`, propsOpenai?.choices?.[0]?.message?.content, {
      'encoding': 'ascii'
    })
  }
}

main().catch(console.error)

// set correct title
// ---
// title: Typescript 101
// ---

// refatoração pra modules do codeleap cli talvez
// considerar unions
// Mandar uma unica mensagem com todos os componentes e uma mensagem inicial de explicação
// Especificar a formatação
// Melhorar a forma como ele pega o children das props correto
// Pensar em como colocar props do tipo reference

// trocar apiKey
// ao inves de gerar docs novos, ter uma hash md5 e verificar se mudou algo pra gerar novamente
