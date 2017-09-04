import React from 'react'

export default (location) => {
  const map = { E: 'external', EV: 'virtual', I: 'internal', P: 'patient' }
  const type = map[location.type]
  const excluded = (location.attributes && location.attributes.excludeFromConsumption)
    ? '(excluded from consumption)' : ''

  return (
    <span className='text-capitalize'>
      {location.name} ({type}) {excluded}
    </span>
  )
}
