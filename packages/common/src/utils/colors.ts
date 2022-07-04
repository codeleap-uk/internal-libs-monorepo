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

export function shadeColor(color: string, percent: number) {
  const newColor = color
    .replace(/^#/, '')
    .replace(/../g, (color) => (
      '0' +
        Math.min(255, Math.max(0, parseInt(color, 16) + percent)).toString(16)
    ).substr(-2),
    )

  return '#' + newColor
}
