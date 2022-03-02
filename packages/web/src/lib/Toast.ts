import { toast } from 'react-toastify'

type ToastArgs = {
  title:string
} &Parameters<typeof toast.info>[1]

function info({ title, ...others }:ToastArgs) {
  toast.info(title, others)
}

function success({ title, ...others }:ToastArgs) {
  toast.success(title, others)
}

function error({ title, ...others }:ToastArgs) {
  toast.error(title, others)
}

export default {
  info,
  success,
  error,
}
