
export type ThemeRGB = { r: string; g: string; b: string; a: string }

export type ThemeValue = string | number | ThemeRGB

export type ThemeVariable = {
  id: string
  name: string
  description: string
  type: 'FLOAT'
  valuesByMode: {
    [key: string]: ThemeValue
  }
  resolvedValuesByMode: {
    [key: string]: {
      resolvedValue: ThemeValue
      alias?: string
      aliasName?: string
    }
  }
  scopes: string[]
  hiddenFromPublishing: boolean
  codeSyntax: Record<string, any>
}

export type ThemeShape = {
  id: string
  name: string
  modes: Record<string, string>
  variablesIds: string[]
  variables: ThemeVariable[]
}