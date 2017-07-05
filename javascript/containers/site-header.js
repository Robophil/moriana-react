import React from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { getUser, logout } from 'user'
import { checkLocationChange } from 'locations'
import ClickOutHandler from 'react-onclickout'
import Logo from 'logo'
import hl from 'header-links'
import config from 'config'

const SiteHeader = class extends React.Component {
  state = { openSection: null }

  componentDidMount = () => {
    this.props.getUser()
    window.addEventListener('hashchange', (event) => {
      this.props.checkLocationChange(event.newURL)
    })
  }
  clickLogout = this.props.logout

  showSection = (e) => {
    let {section} = e.target.dataset
    section = (this.state.openSection === section) ? null : section
    this.setState({ openSection:  section, sectionPosition: e.target.dataset.position })
  }

  linkClicked = (e) => {
    if (e.target.pathname === '/logout') {
      e.preventDefault()
      this.props.logout()
    }
    this.hideLink()
  }

  hideLink = () => { this.setState({ openSection: false }) }

  render () {
    const { user, locations } = this.props
    const links =  hl.getLinks(user, config.isLocal, locations.currentLocation)
    const subsections = hl.getSublinks(user.prettyRoles, config.isLocal, locations.currentLocationDbName)
    const {openSection, sectionPosition} = this.state
    let subsection = openSection ? (
      <div className={`toggle-content toggle-content-${openSection}`}>
        <div className={`text-${sectionPosition}`}>
        {subsections[openSection].map((link, i) => (
          <Link key={i} to={link.url} className="btn btn-default btn-lg some-margin" onClick={this.linkClicked}>
            <i className={`${link.icon} small`}></i> &nbsp; {link.title}
          </Link>
        ))}
        </div>
      </div>
    ) : ''
    return (
      <ClickOutHandler onClickOut={this.hideLink}>
        <div className='header'>
          {user.getUserFailed && (<Redirect to='/login' />)}
          <nav className="navbar navbar-default no-print">
            <div className="container-fluid">
              <div className="navbar-header">
                <Link to='/' className="navbar-brand show-drop-nav location-link">
                  <Logo />
                </Link>
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
    return { user: state.user, locations: state.locations }
  },
  { getUser, logout, checkLocationChange }
)(SiteHeader)
