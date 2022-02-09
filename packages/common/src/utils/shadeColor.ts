export default function shadeColor(color: string, percent: number) {
  const newColor = color
    .replace(/^#/, '')
    .replace(/../g, (color) => (
      '0' +
        Math.min(255, Math.max(0, parseInt(color, 16) + percent)).toString(16)
    ).substr(-2),
    );

  return '#' + newColor;
}
