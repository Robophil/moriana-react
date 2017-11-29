import React from 'react'
import h from 'utils/helpers'

export default (props) => {
  return (
    <span>
      <strong>{props.name}</strong>
      {props.dob && (<span> Date of birth: <strong>{h.formatDate(props.dob)}</strong></span>)}
      {props.identifier && (<span> Identifier: <strong>{props.identifier}</strong></span>)}
      {props.district && (<span> District: <strong>{props.district}</strong></span>)}
      {props.gender && (<span> Gender: <strong>{props.gender}</strong></span>)}
    </span>
  )
}
