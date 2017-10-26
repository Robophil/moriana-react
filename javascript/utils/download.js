import h from 'helpers'

// headers are expected as ordered list of objects: { name: 'Shipment Date', key: 'date' }

export default function (rows, headers, fileName) {
  const a = document.createElement('a')
  a.download = fileName.replace(/[\/:*?"<>|]/g, '') + new Date().toISOString() + '.xls'
  const tsvRows = rows.map(row => {
    return headers.map(header => {
      return transforms[header.key] ? transforms[header.key](row[header.key]) : row[header.key]
    }).join('\t')
  })
  tsvRows.unshift(headers.map(header => header.name).join('\t'))
  console.log(JSON.stringify(tsvRows, null, 2))
  const blob = new Blob([tsvRows.join('\n')], { type: 'text/plain' })
  a.href = URL.createObjectURL(blob)
  a.target = '_blank'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

const transforms = {
  expiration: h.expiration,
  date: h.formatDate
}
