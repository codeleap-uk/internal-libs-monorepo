import { cwd, USER_CONFIG } from '../constants'
import { fs, git, path } from '../lib'
import { codeleapCommand } from '../lib/Command'


export const downloadKeystores = codeleapCommand(
  {
    name: 'download-keystores',
    parameters: [
        '[branch]'
    ],
  },
  async ({ _ }) => {

    const dir = path.join(cwd, 'android', 'app', 'keystores')
    fs.rmSync(dir, {
        recursive: true,
        force: true
    })
    
    
    await git.raw('clone', `https://${USER_CONFIG.GITHUB_TOKEN}@github.com/codeleap-uk/keystores-android.git`, '-b', _.branch, dir)
  },
)
