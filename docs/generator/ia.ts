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

export async function articleGenerator(openai: OpenAI, docs: any[]) {
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

    const prompt = `
      Write documentation for a react component named "${componentOtherName ?? componentName}", imported from the "@codeleap/${GeneratorConfig.package}" package, 
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
