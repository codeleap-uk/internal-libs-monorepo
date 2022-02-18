import { defaultPresets } from '@codeleap/common/dist/styles/presets'

const presetNames = Object.keys(defaultPresets)

export function filterVariant(variant: string) {
  const filters = [
    variant !== 'default',
    !(variant === 'dynamicHandler'),
    !variant.startsWith('padding'),
    !variant.startsWith('margin'),
    !presetNames.includes(variant),
  ]

  return filters.every((r) => r)
}

export function beautifyName(str: string) {
  const characters = []

  str.split('').forEach((char, idx) => {
    let toAppend = char
    if (idx == 0) {
      toAppend = char.toUpperCase()
    }

    if (char == char.toUpperCase()) {
      toAppend = ` ${char}`
    }

    characters.push(toAppend)
  })

  return characters.join('')
}
