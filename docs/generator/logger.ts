
function log(args: object | string) {
  const isStr = typeof args === 'string'

  if (isStr) {
    console.log('Generator (log) -> ' + args)
  } else {
    console.log('Generator (log) -> ', args)
  }
}

function exception(args: object | string) {
  const isStr = typeof args === 'string'

  if (isStr) {
    console.log('Generator (error) -> ' + args)
  } else {
    console.log('Generator (error) -> ', args)
  }
}

function echo(msg, args) {
  console.log('Generator (echo) -> ' + msg, args)
}

export const GenLogger = {
  log,
  exception,
  echo,
}
