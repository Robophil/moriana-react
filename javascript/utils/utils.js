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

export const isNumeric = (input) => {
  return !isNaN(parseFloat(input)) && isFinite(input)
}

export const isNumber = (input) => {
  return isNumeric(input) && typeof(input) !== 'string';
}

export const empty = (input) => {
  if (!input) return true
  return (removeExtraWhiteSpace(input) === '')
}

export const removeExtraWhiteSpace = (input) => {
  return input ? input.replace(/\s+/g, ' ').trim() : ''
}

export const generateId = (username, created, docType) => {
  return `00__${created}__${username}__${docType}__${getRandom()}`
}

export const getRandom = () => {
  return ('' + Math.random()).substring(2,8)
}
