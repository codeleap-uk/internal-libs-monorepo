export function getHeadingId(content:string) {
  return `section-${
    content
      .replace(/\s/g, '-')
      .replace(/\./g, '-')
  }`
}
