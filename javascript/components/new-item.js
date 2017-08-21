import React from 'react'
import PropTypes from 'prop-types'
import h from 'helpers'
import ClickOutHandler from 'react-onclickout'
import SearchDrop from 'search-drop'
import {searchCategories} from 'items'

export default class NewItem extends React.Component {
  state = { item: '', category: '' }

  componentDidMount = () => {
    if (this.props.value) {
      this.setState({ item: this.props.value })
    }
  }

  onKeyDown = (event) => {
    switch (h.keyMap(event.keyCode)) {
      case 'ENTER': {
        this.onSubmit()
        break
      }
      case 'ESCAPE': {
        this.props.closeClicked()
        break
      }
    }
  }

  nameChanged = (event) => {
    const newState = {}
    this.setState({item: event.currentTarget.value})
  }

  newCategorySelected = (category) => {
    this.setState({category})
  }

  categorySelected = (category) => {
    this.setState({category: category.name})
  }

  onSubmit = (event) => {
    if (event) event.preventDefault()
    const {item, category} = this.state
    if (item && category) {
      this.props.valueUpdated(item, category)
    }
  }

  render () {
    return (
      <ClickOutHandler onClickOut={this.props.closeClicked}>
        <div className='clickout-modal'>
          <div className='modal-header'>
            <button type='button' className='close' onClick={this.props.closeClicked}>
              <span>×</span>
            </button>
            <h4 className='modal-title'>New Item</h4>
          </div>
          <div className='modal-body'>
            <form className='form-horizontal' onSubmit={this.onSubmit}>
              <fieldset>
                <div>
                  <div className='form-group'>
                    <label className='col-lg-2 control-label'>Item Name</label>
                    <div className='col-lg-10'>
                      <input
                        type='text'
                        className='form-control form-input'
                        value={this.state.item}
                        onChange={this.nameChanged}
                        onKeyDown={this.onKeyDown}
                        autoFocus
                      />
                    </div>
                  </div>
                  <SearchDrop
                    rows={this.props.categories}
                    loading={false}
                    valueSelected={this.categorySelected}
                    value={{name: this.state.category}}
                    onNewSelected={this.newCategorySelected}
                    searchFilterFunction={searchCategories}
                    label={'Item Category'}
                    resourceName={'Category'}
                  />
                </div>
                <br /><br />
                <div className='form-group'>
                  <div className='col-lg-10 col-lg-offset-2'>
                    <button onMouseDown={this.props.closeClicked} className='btn btn-default'>Cancel</button>
                    <button onClick={this.onSubmit} className='btn btn-primary'>OK</button>
                  </div>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </ClickOutHandler>
    )
  }
}

NewItem.propTypes = {
  value: PropTypes.string,
  valueUpdated: PropTypes.func.isRequired,
  closeClicked: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired
}
