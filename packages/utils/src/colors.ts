import tinycolor from 'tinycolor2'
import { TypeGuards } from '@codeleap/types'

export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : null
}

const shadeColorCache = {}
export function shadeColor(color: string, percent = 0, opacity = null) {
  const _color = color.trim()
  const serialParams = [_color, percent.toString()]
  if (TypeGuards.isNumber(opacity)) {
    serialParams.push(opacity.toString())
  }
  const cacheKey = serialParams.join('/')

  if (!!shadeColorCache[cacheKey]) {
    return shadeColorCache[cacheKey]
  }
  const cl = tinycolor(_color)
  if (percent !== 0) {

    const shouldDarken = percent < 0

    if (shouldDarken) {
      cl.darken(-percent)
    } else {
      cl.lighten(percent)
    }
  }
  if (TypeGuards.isNumber(opacity)) {
    cl.setAlpha(opacity)

  }

  const rgbObj = cl.toRgb()
  const rgbStr = `rgba(${rgbObj.r},${rgbObj.g},${rgbObj.b},${rgbObj.a})`
  shadeColorCache[cacheKey] = rgbStr
  return rgbStr
}
