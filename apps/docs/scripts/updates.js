const fs = require('fs')

const updates = fs.readdirSync(__dirname + '/../src/updates')

const allVersions = updates?.map(v => {
  if (v?.includes('index')) return null

  const content = fs.readFileSync(
    __dirname + '/../src/updates/' + v, 
    'utf-8'
  )

  const match = content.match(/title: '(.*?)'/)

  const title = match[1]

  return {
    version: v?.split('.')[0]?.split('_')?.join('.'),
    path: '/updates/' + v?.split('.')[0],
    title,
    order: Number(v?.split('.')[0]?.split('_')?.join(''))
  }
})?.filter(v => !!v)?.sort((a, b) => b?.order - a?.order)

fs.writeFileSync(__dirname + '/../src/updates/index.json', JSON.stringify({ list: allVersions }))
