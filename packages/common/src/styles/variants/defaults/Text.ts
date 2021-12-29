import {  Fonts, TypographyStyle } from '../..';
import { includePresets } from '../../presets'
import { createDefaultVariantFactory } from '../createDefaults' 

export type TextComposition = 'text' | 'inner' |'wrapper' | 'icon' | 'loader';
const createTextStyle = createDefaultVariantFactory<TextComposition>()

const presets = includePresets((styles) => createTextStyle(() => ({ wrapper: styles })))
function createClampExpression(values:TypographyStyle, baseSize:number){
  const {max, min, multiplier, viewport} = values.size
  const add = typeof multiplier == 'string'  ?  multiplier : `${baseSize*multiplier}px`
  const s = `max(${min}px, min(calc(${add} + ${viewport}vw), ${max}px))`
  // const s = `clamp(${min}px, calc(${add} + ${viewport}vw), ${max}px)`
  return s
  
}
function assignTextStyle(name:Fonts){
  return createTextStyle((theme) => {
    const style = theme.typography.styles[name]
    return {
      text: {
        fontWeigth: style.weigth,
        fontSize: createClampExpression(style, theme.typography.baseFontSize),
        lineHeigth: style.lineHeight,
      },
    }
  })
}

export const TextStyles = {
  ...presets,
  default: createTextStyle(({typography}) => ({
    text: { 
      fontFamily: typography.fontFamily,
    },
  })),
  h1: assignTextStyle('h1'),
  h2: assignTextStyle('h2'),
  h3: assignTextStyle('h3'),
  h4: assignTextStyle('h4'),
  h5: assignTextStyle('h5'),
  h6: assignTextStyle('h6'),
  p1: assignTextStyle('p1'),
  p2: assignTextStyle('p2'),
  p3: assignTextStyle('p3'),
  p4: assignTextStyle('p4'),
}
