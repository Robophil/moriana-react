export default {

  getAccountLinks (username) {
    const accountLinks = {
      section: 'account',
      icon: 'profile',
      linkName: username,
      subLinks: [
        { title: 'Account', url: '/account', icon: 'icon profile' },
        { title: 'Status', url: '/status/', icon: 'icon clock-h9m0' },
        { title: 'logout', url: '/logout', icon: 'icon close' },
      ],
    }
    return accountLinks
  },

  getLinks(user, currentLocation, dbName) {
    if (!user.name) {
      return {}
    } else if (user.isAdmin) {
      return this.getAdminLinks(user.name)
    }
    const server = config.isLocal ? ' [local]' : ' [online]'
    const leftLinks = [{
      section: 'database', icon: 'focus',
      linkName: (dbName ? currentLocation : 'Select Location') + server,
      containerclasses: 'text-center', subLinks: this.getDatabaseLinks(user.roles)
    }]
    const createLinks = { section: 'create', icon: 'plus', linkName: 'Create', subLinks: [
        { title: 'Receive', url: `/d/${dbName}/shipment/edit-new/receive`, icon: 'icon arrow-down' },
        { title: 'Transfer', url: `/d/${dbName}/shipment/edit-new/transfer`, icon: 'icon arrow-right' },
        { title: 'Transfer Out', url: `/d/${dbName}/shipment/edit-new/transfer-out`, icon: 'icon arrow-up' }]
    }
    if (dbName && currentLocation.toLowerCase().indexOf('dispensary') !== -1) {
      createLinks.subLinks.push({ title: 'Dispense', url: `/d/${dbName}/shipment/edit-new/dispense`, icon: 'icon arrow-right' })
    }
    const links = [
      this.getAccountLinks(user.name),
    ]
    const locationBasedLinks = [
      { linkName: 'View', icon: 'menu', section: 'view', subLinks: [
        { title: 'Shipments', url: `/d/${dbName}/`, icon: 'icon mail-solid' },
        { title: 'Current Stock', url: `/d/${dbName}/stock/`, icon: 'icon menu' },
        { title: 'Reports', url: `/d/${dbName}/reports/`, icon: 'icono-barChart' }]
      },
      createLinks,
      { linkName: 'Search', icon: 'search', section: 'search', subLinks: [], containerclasses: 'text-left' },
    ]
    if (dbName) links.unshift(...locationBasedLinks)
    return { username: user.name, leftLinks, links, allLinks: leftLinks.concat(links) }
  },

  getDatabaseLinks(roles) {
    return _.chain(roles).filter(role => role !== '_admin')
    .map(role => {
      return {
        title: locationname(role, {}), url: `/d/${role}/`, icon: 'icon focus'
      }
    }).sortBy().value()
  },

  getAdminLinks(username) {
    const links = [
      this.getAccountLinks(username)
    ]
    const leftLinks = [{ section: 'admin', icon: 'gear', linkName: 'Admin',
      containerclasses: 'text-left', subLinks: [
        { title: 'Users', url: '/admin/users/' },
        { title: 'Databases', url: '/admin/databases/' },
        { title: 'Queries', url: '/admin/queries/' },
        { title: 'Replicate', url: '/admin/replicate/' },
        { title: 'Delete Doc', url: '/admin/delete-doc/' }, ]
    }]
    if (config.isLocal) {
      leftLinks[0].subLinks.push({ title: 'Admin Offline Status', url: '/admin-status/' },
      { title: 'Offline Setup', url: '/admin/offline-setup/' })
    }
    return { links, leftLinks, username, allLinks: leftLinks.concat(links) }
  },

}
