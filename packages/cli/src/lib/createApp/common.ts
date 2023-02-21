import { git, fs, path } from '..'

export async function initRepoFromTemplate(templateUrl:string, location: string) {
  await git.raw('clone', templateUrl, location)

  fs.rmSync(
    path.join(location, '.git'),
    { force: true, recursive: true },
  )

  await git.raw('-C', location, 'init', '--initial-branch', 'master')

}
