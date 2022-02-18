import { toast } from 'react-toastify'

function info({title}) {
  toast.info(title)
}

function success({title}) {
  toast.success(title)
}

function error({title}) {
  toast.error(title)
}

export default {
  info,
  success,
  error,
}
