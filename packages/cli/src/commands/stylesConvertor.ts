import { codeleapCommand } from '../lib/Command'
import fs from 'fs'
import path from 'path'
import '../lib/firebase'
import { CodeleapCLISettings } from '../types'
import { CODELEAP_CLI_SETTINGS_PATH } from '../constants'
import OpenAI from 'openai'

const commandName = 'styles-convertor'

const newStylePackage = `
  import { createStyles } from '@codeleap/styles'
  import { ComponentNameComposition } from '@codeleap/mobile'
  import { StyleRegistry } from '../newstyle'

  const createComponentNameVariant = createStyles<ComponentNameComposition>

  export const ComponentNameStyles = {
    test: createComponentNameVariant(theme => ({
      wrapper: {
        backgroundColor: theme.colors.primary,
      },
    })),
    test2: createComponentNameVariant({
      wrapper: {
        backgroundColor: 'blue',
      },
    }),
  }

  StyleRegistry.registerVariants('ComponentName', ComponentNameStyles)
`

const newStyleApp = `
  import { ICSS, createStyles } from '@codeleap/styles'
  import { StyleRegistry } from '../newstyle'

  export type ComponentNameComposition = 'wrapper' | 'text'

  const createComponentNameStyle = createStyles<ComponentNameComposition>

  export const ComponentNameStyles = {
    default: createComponentNameStyle((theme) => ({
      wrapper: {
        width: 200,
        height: 200,
        backgroundColor: theme.colors.primary,
      },
      text: {
        color: 'white',
      },
    })),
    abc: createComponentNameStyle((theme) => ({
      wrapper: {
        backgroundColor: theme.colors.primary,
      },
    })),
  }

  StyleRegistry.registerVariants('ComponentName', ComponentNameStyles)
`

async function convertStylesheets(openai: OpenAI) {
  let stylesheets = []

  const stylesheetFiles: string[] = fs.readdirSync('./src/app/stylesheets/')

  const ignoredFiles = ['index.ts', 'ViewV2.ts', 'MyComponent.ts']

  for (const stylesheet of stylesheetFiles) {
    if (!ignoredFiles.includes(stylesheet)) {
      stylesheets.push(stylesheet)
    }
  }

  console.log('Files to convert', stylesheets)

  for (const stylesheet of stylesheets) {
    const content = fs.readFileSync(`./src/app/stylesheets/${stylesheet}`).toString()

    const prompt = `
        I'm redoing my application's style system in react native, and I want you to convert this code with an old style system into the new format.
        ${content}
        Pay attention, there are two formats for this style, if the old style has any import related to Composition, it is necessary to use this format as a base:
        ${newStylePackage}
        Otherwise, use this format as a base:
        ${newStyleApp}
      `

    console.log(prompt)

    const propsOpenai = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: prompt
      }],
    })

    console.log('message\n', propsOpenai?.choices?.[0]?.message?.content)
  }
}

const newComponentStyle = `
  import { ComponentStyleSheets } from '@/app'
  import { StyledComponent } from '@codeleap/styles'
  import { StyleRegistry } from '../app/newstyle'
  import { View, Text } from '@/components'

  type MyComponentProps = {
    text: string
  }

  export const MyComponent: StyledComponent<typeof ComponentStyleSheets.MyComponentStyles, MyComponentProps> = ({ style, text }) => {
    const styles = StyleRegistry.styleFor(MyComponent.styleRegistryName, style)

    return (
      <View style={styles.wrapper}>
        <Text style={styles.text} text={text} />
      </View>
    )
  }

  MyComponent.styleRegistryName = 'MyComponent'
  MyComponent.elements = ['wrapper', 'text']

  StyleRegistry.registerComponent(MyComponent)
`

const oldComponentPropsStyle = `
import { React, variantProvider, Theme, AppImages } from '@/app'
import { Image, View } from '@/components'
import { useCodeleapContext } from '@codeleap/common'

export const Splash = () => {
  const { currentTheme } = useCodeleapContext()

  return (
    <View
      variants={['center', 'full', 'absolute']}
      style={{
        backgroundColor: Theme.colors[currentTheme].neutral10,
      }}
    >
      <Image
        fast
        source={AppImages.templateLogoWhite}
        resizeMode='contain'
        style={styles.image}
        styles={{
          overlayWrapper: {
            position: 'absolute'
          }
        }}
      />
    </View>
  )
}

const styles = variantProvider.createComponentStyle(theme => ({
  image: {
    ...theme.presets.fullWidth,
    height: '80%',
    width: '80%',
  },
}), true)
`

const newComponentPropsStyle = `
import { React, Theme, AppImages } from '@/app'
import { Image, View } from '@/components'
import { useCodeleapContext } from '@codeleap/common'
import { createStyles } from '@codeleap/styles'

export const Splash = () => {
  const { currentTheme } = useCodeleapContext()

  return (
    <View
      style={[
        'center', 'full', 'absolute',
        { backgroundColor: Theme.colors[currentTheme].neutral10 }
      ]}
    >
      <Image
        fast
        source={AppImages.templateLogoWhite}
        resizeMode='contain'
        style={[
          styles.image,
          {
            overlayWrapper: {
              position: 'absolute'
            }
          }
        ]}
      />
    </View>
  )
}

const styles = createStyles(theme => ({
  image: {
    ...theme.presets.fullWidth,
    height: '80%',
    width: '80%',
  },
}))
`

const listFiles = (dir: string) => {
  let list = []
  const files = fs.readdirSync(dir)

  files.forEach(item => {
    const filePath = path.join(dir, item)
      
    if (fs.statSync(filePath).isDirectory()) {
      const subDirList = listFiles(filePath).map(f => item + '/' + f)

      list = list.concat(subDirList)
    } else {
      list.push(item)
    }
  })

  return list
}

async function convertComponents(openai: OpenAI) {
  const styledComponents = []
  const unstyledComponents = []

  let componentFiles: string[] = listFiles('./src/components/')

  // @test
  componentFiles = ['SocialProviders.tsx']

  console.log(componentFiles)

  const ignoredFiles = ['index.ts']

  for (const component of componentFiles) {
    if (!ignoredFiles.includes(component)) {
      const componentContent = fs.readFileSync(`./src/components/${component}`).toString()

      if (componentContent.includes('useDefaultComponentStyle')) {
        styledComponents.push(componentContent)
      } else if (componentContent.includes('variants=') || componentContent.includes('styles=') || componentContent.includes('variantProvider.createComponentStyle')) {
        unstyledComponents.push(componentContent)
      }
    }
  }

  for (const styledComponent of styledComponents) {
    const prompt = `
      I'm redoing the code for my react native application, I'm going to give you the code for a component and I want you to redo it to fit the new format that I'm also going through:
      ${styledComponent}
      This should be the new format in which the component should be written:
      ${newComponentStyle}
      I need you to REFACTOR THE OLD STYLE CODE TO SUIT THE NEW STYLE, JUST GIVE ME THE REFACTORED CODE
    `

    const propsOpenai = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: prompt
      }],
    })

    console.log('message\n', propsOpenai?.choices?.[0]?.message?.content)
  }

  for (const unstyledComponent of unstyledComponents) {
    const prompt = `
      I'm redoing the code for my react native application, I'm going to give you the code for a component and I want you to redo it to fit the new format that I'm also going through.
      This is an example of code done in the OLD format:
      ${oldComponentPropsStyle}
      This is an example of code done in the NEW format:
      ${newComponentPropsStyle}
      For example this code
      <Example
        variants={['floating', 'size:1']}
        styles={{
          icon: styles.example,
        }}
      />
      This code should change
      <Example
        style={['floating', 'size:1', { icon: styles.example }]}
      />
      Now you must refactor the code I'm giving you and take everything I said into account when refactoring:
      REMEMBER IF: the "variants" and "styles" props become just ONE WITH THE "style" prop and "variantProvider.createComponentStyle" should be replaced by createStyles 
      JUST GIVE ME THE REFACTORED CODE
      ${unstyledComponent}
    `

    const propsOpenai = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: prompt
      }],
    })

    console.log('message\n', propsOpenai?.choices?.[0]?.message?.content)
  }
}

async function convertPages(openai: OpenAI) {
  const pages = []

  let pagesFiles: string[] = listFiles('./src/scenes/')

  const ignoredFiles = ['Playground/_utils.ts', 'Playground/index.tsx', 'Playground/new.tsx', 'Playground/old.tsx', 'Scenes.tsx']

  for (const page of pagesFiles) {
    if (!ignoredFiles.includes(page)) {
      const pageContent = fs.readFileSync(`./src/scenes/${page}`).toString()

      pages.push(pageContent)
    }
  }

  for (const page of pages) {
    const prompt = `
      Pay attention to what I'm saying, because you will refactor a certain code made in React Native that I will pass on based on the information in this message
      
      -------------------

      For example this code

      import { variantProvider } from '@/app'

      function Page() {
        return (
          <Example
            variants={['floating', 'size:1']}
            style={{ backgroundColor: '#fff' }}
            styles={{
              icon: styles.example,
            }}
          />
        )
      }

      const styles = variantProvider.createComponentStyle((theme) => ({}), true)

      -------------------

      This code should change

      import { createStyles } from '@codeleap/styles'

      function Page() {
        return (
          <Example
            style={['floating', 'size:1', { icon: styles.example, backgroundColor: '#fff' }]}
          />
        )
      }

      const styles = createStyles((theme) => ({}))

      -------------------

      The "variants" and "styles" props become just ONE WITH THE "style" prop and "variantProvider.createComponentStyle" function should be replaced by createStyles function WHICH MUST BE IMPORTED FROM @codeleap/styles
      However, keep the imports that come from @/app, don't remove them! Just remove the mention of variantProvider

      Now you must refactor the code I'm giving you and take everything I said into account when refactoring
      Just give me the refactored code:
      ${page}
    `

    const propsOpenai = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: prompt
      }],
    })

    console.log('message\n', propsOpenai?.choices?.[0]?.message?.content)
  }
}

export const stylesConvertorCommand = codeleapCommand(
  {
    name: commandName,
    parameters: [],
    help: {
      description: '',
      examples: [
        `codeleap ${commandName}`,
      ],
    },
  },
  async () => {
    const settingsPath = CODELEAP_CLI_SETTINGS_PATH

    const settingsJSON = fs.readFileSync(settingsPath).toString()

    let settings: CodeleapCLISettings['convertor-webp'] = JSON.parse(settingsJSON)['convertor-webp']

    console.log('Starting conversion', settings)

    const openai = new OpenAI({
      apiKey: null,
    })

    // await convertStylesheets(openai)

    // await convertComponents(openai)

    await convertPages(openai)
  },
)
