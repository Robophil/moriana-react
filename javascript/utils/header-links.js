export default {

  getSublinks(auth, isLocal) {
    const subLinks = {
      account: [
        { title: 'Account', url: '/account', icon: 'icon profile' },
        { title: 'Status', url: '/status/', icon: 'icon clock-h9m0' },
        { title: 'logout', url: '/logout', icon: 'icon close' }
      ],
      admin: [
        { title: 'Users', url: '/admin/users/' },
        { title: 'Databases', url: '/admin/databases/' },
        { title: 'Queries', url: '/admin/queries/' },
        { title: 'Replicate', url: '/admin/replicate/' },
        { title: 'Delete Doc', url: '/admin/delete-doc/' }
      ],
      view: [
        { title: 'Shipments', url: `/d/${auth.dbName}/`, icon: 'icon mail-solid' },
        { title: 'Current Stock', url: `/d/${auth.dbName}/stock/`, icon: 'icon menu' },
        { title: 'Reports', url: `/d/${auth.dbName}/reports/`, icon: 'icono-barChart' }
      ],
      create: [
        { title: 'Receive', url: `/d/${auth.dbName}/shipment/edit-new/receive`, icon: 'icon arrow-down' },
        { title: 'Transfer', url: `/d/${auth.dbName}/shipment/edit-new/transfer`, icon: 'icon arrow-right' },
        { title: 'Transfer Out', url: `/d/${auth.dbName}/shipment/edit-new/transfer-out`, icon: 'icon arrow-up' }
      ],
      database: auth.prettyRoles.map(db => { return { title: db.name, url: `/d/${db.dbName}/`, icon: 'icon focus' } })
    }
    if (isLocal) {
      subLinks.admin.push(
        { title: 'Admin Offline Status', url: '/admin-status/' },
        { title: 'Offline Setup', url: '/admin/offline-setup/' }
      )
    }
    if (auth.dbName && auth.currentLocation.toLowerCase().indexOf('dispensary') !== -1) {
      subLinks.create.push({
        title: 'Dispense', url: `/d/${auth.dbName}/shipment/edit-new/dispense`, icon: 'icon arrow-right'
      })
    }
    return subLinks
  },

  getLinks(auth, isLocal) {
    if (!auth.name) return { leftLinks: [], rightLinks: [] }
    const server = isLocal ? ' [local]' : ' [online]'
    const leftLinks = []
    const rightLinks = [{ section: 'account', icon: 'profile', linkName: auth.name }]
    if (auth.isAdmin) {
      leftLinks.push({
        section: 'admin',
        icon: 'gear',
        linkName: `Admin ${server}`
      })
    } else {
      leftLinks.push({
        section: 'database',
        icon: 'focus',
        linkName: (auth.dbName ? auth.currentLocation : 'Select Location') + server
      })
      if (auth.dbName) {
        rightLinks.unshift(
          { linkName: 'View', icon: 'menu', section: 'view' },
          { section: 'create', icon: 'plus', linkName: 'Create' },
          { linkName: 'Search', icon: 'search', section: 'search' }
        )
      }
    }
    return { leftLinks, rightLinks }
  }

}
