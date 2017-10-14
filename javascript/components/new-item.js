import React from 'react'
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
        <div className='modal'>
          <div>
            <button className='close' onClick={this.props.closeClicked}>
              <span>×</span>
            </button>
            <h5>New Item</h5>
          </div>
          <form onSubmit={this.onSubmit}>
            <fieldset>
              <div>
                <div className='row'>
                  <label>Item Name</label>
                  <div className='input-group'>
                    <input
                      type='text'
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
              <button onMouseDown={this.props.closeClicked}>Cancel</button>
              <button onClick={this.onSubmit} className='button-primary'>OK</button>
            </fieldset>
          </form>
        </div>
      </ClickOutHandler>
    )
  }
}
