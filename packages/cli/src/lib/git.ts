import { subprocess } from './utils'

export async function getCurrentBranch() {
  const { stdout } = await subprocess(
    'Get current branch',
    'git',
    ['rev-parse', '--abbrev-ref', 'HEAD'],
    {},
  )

  const branchName = stdout.join('').trim()
  console.log('branchName', branchName)
  return branchName
}
