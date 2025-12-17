export const convertLineBreaksToHtml = (text: string) => {
  return text.replace(/\n/g, '<br>')
}
