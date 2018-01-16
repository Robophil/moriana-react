import React from 'react'
import { connect } from 'react-redux'
import ClickOutHandler from 'react-onclickout'

import config from 'config'
import { getUser, logout } from 'store/user'
import { clearNote } from 'store/notifications'
import hl from 'utils/header-links'
import h from 'utils/helpers'
import HeaderSearch from 'containers/header-search'
import NotificationsList from 'components/notifications-list'
import Logo from 'components/logo'

const SiteHeader = class extends React.Component {
  state = { openSection: null }

  checkAndHandleForwardSlash = (event) => {
    if (event.target.nodeName === 'BODY' && h.keyMap(event.keyCode) === 'FORWARD_SLASH') {
      this.setState({ openSection: 'search' })
    }
  }

  componentDidMount = () => {
    this.props.getUser()
    document.addEventListener('keyup', this.checkAndHandleForwardSlash)
  }

  componentWillUnmount = () => {
    document.removeEventListener('keyup', this.checkAndHandleForwardSlash)
  }

  componentWillReceiveProps = (props) => {
    if (props.route.path == '/' && !props.route.dbName) {
      const openSection = props.user.isAdmin ? 'admin' : 'database'
      this.setState({ openSection })
    }
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

  hideLink = (event) => {
    this.setState({ openSection: false })
  }

  render () {
    const { user, route } = this.props
    if (user.getUserFailed) window.location.hash = '#/login'
    const { dbName, currentLocationName } = route
    const headerLink = dbName ? `#d/${dbName}/` : '/'
    const links = hl.getLinks(user, config.isLocal, currentLocationName)
    const subsections = hl.getSublinks(user.prettyRoles, config.isLocal, dbName)
    const {openSection} = this.state
    const numberOfDatabaseColumns = 4
    const drawerClasses = `${openSection || 'no-section'} drawer`
    let drawerLinks = null
    if (openSection) {
      if (openSection === 'search' && dbName) {
        drawerLinks = (<HeaderSearch closeClicked={this.hideLink} dbName={dbName} currentLocationName={currentLocationName} />)
      } else if (openSection === 'database' && subsections[openSection].length > numberOfDatabaseColumns) {
        drawerLinks = buildDatabaseLinkColumns(subsections[openSection], numberOfDatabaseColumns, this.linkClicked)
      } else {
        drawerLinks = subsections[openSection].map((link, i) => (
          <a href={link.url} key={i} onClick={this.linkClicked}>{link.title}</a>
        ))
      }
    }
    return (
      <div className='site-header no-print'>
        <ClickOutHandler onClickOut={this.hideLink}>
          <a className='logo' href={headerLink}><Logo /></a>
          {(links.leftLinks.length !==0) && (
            <ul>
            {links.leftLinks.map((link, i) => (
              <li onClick={this.showSection} key={i}>
                <button data-section={link.section}>
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
                  <button data-section={link.section}>
                    {link.linkName}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {openSection && (<div className={drawerClasses}>{drawerLinks}</div>)}
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

export const buildDatabaseLinkColumns = (links, numberOfColumns, onClick) => {
  // Make's an array of arrays; i.e. Python range: [[] for n in range(numberOfDatabaseColumns)]]
  const rows = [...Array(numberOfColumns).keys()].map(i => [])
  const itemsPerColumn = links.length / numberOfColumns
  links.forEach((link, i) => {
    const currentRow = rows[Math.floor(i / itemsPerColumn)]
    currentRow.push((<a href={link.url} key={currentRow.length} onClick={onClick}>{link.title}</a>))
  })
  return rows.map((row, i) => (<div key={i} className='three columns'>{row}</div>))
}
