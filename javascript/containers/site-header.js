import React from 'react'
import { connect } from 'react-redux'
import { getUser, logout } from 'user'
import ClickOutHandler from 'react-onclickout'
import Logo from 'logo'
import hl from 'header-links'
import config from 'config'
import HeaderSearch from 'header-search'

const SiteHeader = class extends React.Component {
  state = { openSection: 'search' }
  // state = { openSection: null }

  componentDidMount = () => {
    this.props.getUser()
    const { dbName, path } = this.props.route
    if (!dbName && path === '/') {
      this.setState({ openSection: 'database' })
    }
  }
  clickLogout = this.props.logout

  showSection = (e) => {
    let {section} = e.target.dataset
    section = (this.state.openSection === section) ? null : section
    this.setState({ openSection:  section, sectionPosition: e.target.dataset.position })
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
    const links =  hl.getLinks(user, config.isLocal, currentLocationName)
    const subsections = hl.getSublinks(user.prettyRoles, config.isLocal, dbName)
    const {openSection, sectionPosition} = this.state
    let subsection = openSection ? (
      <div className={`toggle-content toggle-content-${openSection}`}>
        <div className={`text-${sectionPosition}`}>
        {subsections[openSection].map((link, i) => (
          <a key={i} href={link.url} className="btn btn-default btn-lg some-margin" onClick={this.linkClicked}>
            <i className={`${link.icon} small`}></i> &nbsp; {link.title}
          </a>
        ))}
        </div>
      </div>
    ) : ''
    if (openSection === 'search') {
      subsection = (<HeaderSearch closeClicked={this.hideLink} dbName={dbName} currentLocationName={currentLocationName} />)
    }
    return (
      <ClickOutHandler onClickOut={this.hideLink}>
        <div className='header'>
          {/* {user.getUserFailed && (<Redirect to='/login' />)} */}
          <nav className="navbar navbar-default no-print">
            <div className="container-fluid">
              <div className="navbar-header">
                <a href={headerLink} className="navbar-brand show-drop-nav location-link">
                  <Logo />
                </a>
                <ul className="nav navbar-nav left-links">
                  {links.leftLinks.map((link, i) => (
                    <li onClick={this.showSection} key={i}>
                      <a href={null} data-section={link.section} className="toggle-link"  data-position='left'>
                        <i className={`${link.icon} icon`}></i> {link.linkName}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <ul className="nav navbar-nav navbar-right">
                {links.rightLinks.map((link, i) => (
                  <li onClick={this.showSection} key={i}>
                    <a href={null} data-section={link.section} className="toggle-link" data-position='right'>
                      <i className={`${link.icon} icon`}></i> {link.linkName}
                    </a>
                  </li>
                ))}
                <li></li>
              </ul>
            </div>
          </nav>
          {subsection}
          <hr />
        </div>
      </ClickOutHandler>
    )
  }
}

export default connect(
  state => {
    return { user: state.user }
  },
  { getUser, logout }
)(SiteHeader)
