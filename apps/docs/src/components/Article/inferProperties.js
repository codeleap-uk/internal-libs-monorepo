function inferProperties(absolutePath) {
  let parts = absolutePath.split('/')
  const sliceFrom = parts.lastIndexOf('articles')
  const articlesPath = parts.slice(0, sliceFrom + 1)
  parts = parts.slice(sliceFrom + 1)
  // const sliceFrom = parts.indexOf('articles')
  const [pageModule, categoryOrFileName, ...others] = parts
  let pagePath = `${pageModule}/${categoryOrFileName.toLowerCase()}`

  if (others.length) {
    pagePath += `/${others[0]}`
  }
  pagePath = pagePath.split('.').slice(0, -1).join('')
  const filename = pagePath.split('/').pop()
  return {
    path: pagePath,
    module: pageModule,
    category: others.length ? categoryOrFileName : 'root',
    isLibrary: !['concepts'].includes(pageModule),
    orderFile: [...articlesPath, pageModule, 'order.json'].join('/'),
    filename,
  }
}

module.exports = { inferProperties }
