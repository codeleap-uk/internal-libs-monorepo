const fs = require('fs')

const updates = fs.readdirSync(__dirname + '/../src/updates')

const allVersions = updates?.map(v => {
  if (v?.includes('index')) return null

  return {
    version: v?.split('.')[0]?.split('_')?.join('.'),
    path: '/updates/' + v?.split('.')[0],
  }
})?.filter(v => !!v)

fs.writeFileSync(__dirname + '/../src/updates/index.json', JSON.stringify({ list: allVersions }))
