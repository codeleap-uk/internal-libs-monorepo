export function singleLine(text:string) {
  return text?.replace(/\n/g, ' ')
}


export function stringiparse(string) {
  return JSON.parse(JSON.stringify(string))
}


