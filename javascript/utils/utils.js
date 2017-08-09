export const objectFromKeys = (headers, response) => {
  return response.rows.map(row => {
    const obj = { id: row.id, value: row.value}
    headers.forEach((header, i) => {
      obj[header] = row.key[i]
    })
    return obj
  })
}
