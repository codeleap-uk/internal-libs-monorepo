export function singleLine(text:string) {
  return text?.replace(/\n/g, ' ')
}


export function stringiparse(string) {
  return JSON.parse(JSON.stringify(string))
}


export function capitalize(str:string){
  return str[0].toUpperCase() + str.substring(1)
}
