import React from 'react'
import { connect } from 'react-redux'
import ClickOutHandler from 'react-onclickout'

import { getUser, logout } from 'user'

import hl from 'header-links'
import HeaderSearch from 'header-search'
import Logo from 'logo'
import NotificationsList from 'notifications-list'
import {clearNote} from 'notifications'

import config from 'config'
import h from 'helpers'

const SiteHeader = class extends React.Component {
  state = { openSection: null }

  componentDidMount = () => {
    this.props.getUser()
    const { dbName, path } = this.props.route
    if (!dbName && path === '/') {
      this.setState({ openSection: 'database' })
    }
    document.addEventListener('keyup', (event) => {
      if (event.target.nodeName === 'BODY' && h.keyMap(event.keyCode) === 'FORWARD_SLASH') {
        this.setState({ openSection: 'search' })
      }
    })
  }
  clickLogout = this.props.logout

  showSection = (e) => {
    let {section} = e.target.dataset
    if (section === 'database') e.preventDefault()
    section = (this.state.openSection === section) ? null : section
    this.setState({ openSection: section })
  }

  linkClicked = (e) => {
    if (e.currentTarget.href.indexOf('logout') !== -1) {
      e.preventDefault()
      this.props.logout()
    }
    this.hideLink()
  }

  hideLink = () => { this.setState({ openSection: false }) }

  render () {
    const { user, route } = this.props
    if (user.getUserFailed) window.location.hash = '#/login'
    const { dbName, currentLocationName } = route
    const headerLink = dbName ? `/#d/${dbName}/` : '/'
    const links = hl.getLinks(user, config.isLocal, currentLocationName)
    const subsections = hl.getSublinks(user.prettyRoles, config.isLocal, dbName)
    const {openSection} = this.state
    let subsection = openSection ? (
      <div className={`drawer ${openSection === 'database' ? 'database' : ''}`}>
        {subsections[openSection].map((link, i) => (
          <a className='button' key={i} href={link.url} onClick={this.linkClicked}>
            {/* <i className={`${link.icon} small`} /> &nbsp;  */}
            {link.title}
          </a>
        ))}
      </div>
    ) : ''
    if (openSection === 'search' && dbName) {
      subsection = (<HeaderSearch closeClicked={this.hideLink} dbName={dbName} currentLocationName={currentLocationName} />)
    }
    return (
      <div className='site-header'>
        <ClickOutHandler onClickOut={this.hideLink}>
          <a href={headerLink}><Logo /></a>
          {(links.leftLinks.length !==0) && (
            <ul>
            {links.leftLinks.map((link, i) => (
              <li onClick={this.showSection} key={i}>
                <button data-section={link.section}>
                  {/* <i className={`${link.icon} icon`} /> */}
                  {link.linkName}
                </button>
              </li>
            ))}
            </ul>
          )}
          {(links.rightLinks.length !== 0) && (
            <ul className='right-links'>
              {links.rightLinks.map((link, i) => (
                <li onClick={this.showSection} key={i}>
                  <button href='' data-section={link.section}>
                    {/* <i className={`${link.icon} icon`} /> */}
                    {link.linkName}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {subsection}
          <NotificationsList
            clearNote={this.props.clearNote}
            notifications={this.props.notifications}
          />
        </ClickOutHandler>
      </div>
    )
  }
}

export default connect(
  state => {
    return { user: state.user, notifications: state.notifications }
  },
  { getUser, logout, clearNote }
)(SiteHeader)
