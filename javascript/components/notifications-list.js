import React from 'react'

export default class extends React.Component {
  close = (event) => {
    this.props.clearNote(event.currentTarget.dataset.id)
  }

  render () {
    const { notifications } = this.props
    return (
        <div className='notifications-container'>
          {Object.keys(notifications).map((key, i) => {
            const note = notifications[key]
            return (
              <div key={i} className='notification'>
                <button
                  onClick={this.close}
                  data-id={note.id}
                  className='close'
                >
                  <span>×</span>
                </button>
                <p>{note.text}</p>
              </div>
            )
          })}
        </div>
    )
  }
}
