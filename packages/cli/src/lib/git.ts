import { subprocess } from './utils'

export async function getCurrentBranch() {
  const { stdout } = await subprocess(
    'Get current branch',
    'git',
    ['rev-parse', '--abbrev-ref', 'HEAD'],
    {},
  )

  const branchName = stdout.join('').trim()

  return branchName
}

export async function getDefaultBranchName() {
  const { stdout } = await subprocess(
    'Get default branch',
    'git',
    ['symbolic-ref', '--short', 'refs/remotes/origin/HEAD'],
    {},
  )

  let branchName = stdout.join('').trim()

  if (branchName.startsWith('origin/')) {
    branchName = branchName.replace('origin/', '')
  }
  return branchName
}
