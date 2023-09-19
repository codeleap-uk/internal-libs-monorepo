import OpenAIClass, { OpenAI } from 'openai'
import { GenLogger } from './logger'
import { GeneratorConfig } from './config'
import { ComponentPropDoc } from './types'

const fs = require('fs')

function initialize(): OpenAI {
  GenLogger.log('initialize OpenAI')
  
  const env = fs.readFileSync(`./docs/.env.json`).toString()
  const variables = JSON.parse(env)

  const openai = new OpenAIClass({
    apiKey: variables.OPENAI_API_KEY,
  })

  return openai
}

export async function articleGenerator(openai: OpenAI, _docs: any[]) {
  const docs = _docs?.slice(0, GeneratorConfig.maxTypedocsGenerator)

  for (const docDir of docs) {
    let componentName = docDir.name?.split('.')?.[0]
    let componentOtherName = null

    GenLogger.log(componentName)

    const docContent = fs.readFileSync(`${GeneratorConfig.typedocsOutputDir}/${docDir.name}`).toString()
    const data = JSON.parse(docContent)

    const { children } = data

    let propsDoc: ComponentPropDoc[] = []

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

    const componentPath = `./packages/${GeneratorConfig.package}/src/components/${componentName}/index.tsx`

    const componentSourceCode = fs.readFileSync(componentPath).toString()

    const promptSourceCode = `
      This is the source code of a React component named ${componentName}, imported from the "@codeleap/${GeneratorConfig.package}" package.
      I want you to just understand the code:

      ${componentSourceCode}
    `
    const prompt = `
      Write documentation for the react component "${componentName}" that I sent previously.
      The documentation page should follow the following structure (IMPORTANT), in markdown extended (.mdx):
      
      ## Description
      Put here: What the component shows on the screen and what it can be used for (do not say how it can be imported and do not cite "@codeleap/${GeneratorConfig.package}").
      
      ## Args
      Put here: In this section you must ignore all the props in the code I passed previously, and you must list ONLY the following props:
      ${JSON.stringify(propsPrompt, null, 2)}
      AND YOU NEED TO LIST IN THE FOLLOWING STRUCTURE:
      - name of prop (type of prop, optional or not optional): description of prop

      ## Example Usage
      <Example usage of the component>
    `

    console.log(promptSourceCode)
    console.log(prompt)

    const propsOpenai = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "user", 
          content: promptSourceCode
        },
        { 
          role: "user", 
          content: prompt
        }
      ],
    })

    console.log(propsOpenai)

    try {
      fs.mkdirSync(GeneratorConfig.articlesOutputDir, {
        'recursive': true,
      })
    } catch(e) {
      GenLogger.exception(e)
    }

    const articlePath = `${GeneratorConfig.articlesOutputDir}/${componentName}.${GeneratorConfig.articleGeneratorExtension}`
    
    // @ts-ignore
    fs.writeFileSync(articlePath, propsOpenai?.choices?.[0]?.message?.content, {
      'encoding': 'ascii'
    })
  }
}

export const GeneratorIA = {
  initialize,
  articleGenerator,
}
