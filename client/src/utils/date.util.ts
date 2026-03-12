export function formatDate(date: string | Date) {
  const d = new Date(date)
  const day = d.getDate().toString()
  const month = (d.getMonth() + 1).toString()
  const year = d.getFullYear().toString()
  return `${day}.${month}.${year}.`
}
