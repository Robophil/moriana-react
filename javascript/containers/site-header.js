import React from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { getUser, logout } from 'auth'
import ClickOutHandler from 'react-onclickout'
import Logo from 'logo'
import headerLinks from 'header-links'

const SiteHeader = class extends React.Component {
  state = { showAccountDrawer: false }

  componentDidMount = this.props.getUser
  clickLogout = this.props.logout
  toggleAccountDrawer = () => { this.setState({ showAccountDrawer: !this.state.showAccountDrawer }) }
  hideDrawer = () => { this.setState({ showAccountDrawer: false }) }

  render () {
    return (
      <ClickOutHandler onClickOut={this.hideDrawer}>
        <div className='header'>
          {this.props.getUserFailed && (<Redirect to='/login' />)}
          <nav className="navbar navbar-default no-print">
            <div className="container-fluid">
              <div className="navbar-header">
                <Link to='/' className="navbar-brand show-drop-nav location-link">
                  <Logo />
                </Link>
                <ul className="nav navbar-nav left-links">
                  {/* {{#each leftLinks}}
                  <li><a href="#" data-section="{{section}}" className="toggle-link">
                    <i className="{{icon}} icon"></i> {{linkName}}</a>
                  </li>
                  {{/each}} */}
                </ul>
              </div>
              <ul className="nav navbar-nav navbar-right">
                {/* {{#each links}}
                <li><a href="#" data-section="{{section}}" className="toggle-link">
                  <i className="{{icon}} icon"></i> {{linkName}}</a>
                </li>
                {{/each}} */}
                <li></li>
              </ul>
            </div>
          </nav>
          {/* {{#each allLinks}}
          <div data-section="{{section}}" className="toggle-content toggle-content-{{section}} hidden">
            <div className="{{#unless containerclasses}}text-right{{/unless}} {{containerclasses}}">
              {{#each subLinks}}
              <a href="{{url}}" className="btn btn-default btn-lg some-margin hide-on-click">
                <i className="{{icon}} small"></i> &nbsp; {{title}}
              </a>
              {{/each}}
            </div>
          </div>
          {{/each}} */}
          <hr />
        </div>
      </ClickOutHandler>
    )
  }
}

export default connect(
  state => state.auth,
  { getUser, logout }
)(SiteHeader)
