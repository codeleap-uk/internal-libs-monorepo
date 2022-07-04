export function copyToClipboard(text:string) {
  let tmpTextArea = document.createElement('textarea')
  const styles = [
    'display:none;', 'height:0;', 'visibility:hidden;', 'opacity:0;', 'width:0;',
  ]
  tmpTextArea.setAttribute('style', styles.join(''))

  tmpTextArea.setAttribute('value', text)
  tmpTextArea.setAttribute('id', 'copy_text')

  document.body.appendChild(tmpTextArea)

  tmpTextArea = document.getElementById('copy_text') as HTMLTextAreaElement
  tmpTextArea.focus()
  tmpTextArea.select()

  try {
    const successful = document.execCommand('copy')
    const msg = successful ? 'successful' : 'unsuccessful'

  } catch (err) {
    alert('Unable to copy')
  }

}
