export const objectFromKeys = (headers, response) => {
  return response.rows.map(row => {
    const obj = { value: row.value }
    if (row.id) obj.id = row.id
    headers.forEach((header, i) => {
      obj[header] = row.key[i]
    })
    return obj
  })
}

export const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

export const isNumeric = (inputValue) => {
  return !isNaN(parseFloat(inputValue)) && isFinite(inputValue)
}

export const empty = (input) => {
  if (!input) return true
  return (removeExtraWhiteSpace(input) === '')
}

const removeExtraWhiteSpace = (input) => {
  return input ? input.replace(/\s+/g, ' ').trim() : ''
}
