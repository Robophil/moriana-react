export default {

  getSublinks (prettyRoles, isLocal, dbName) {
    const subLinks = {
      account: [
        { title: 'Account', url: '#/account' },
        { title: 'Status', url: '#/status/' },
        { title: 'Log Out', url: '/logout' }
      ],
      admin: [
        { title: 'Users', url: '#/admin/users/' },
        { title: 'Databases', url: '#/admin/databases/' },
        { title: 'Queries', url: '#/admin/queries/' },
        { title: 'Replicate', url: '#/admin/replicate/' },
        { title: 'Delete Doc', url: '#/admin/delete-doc/' }
      ],
      view: [
        { title: 'Shipments', url: `#d/${dbName}/` },
        { title: 'Current Stock', url: `#d/${dbName}/stock/` },
        { title: 'Reports', url: `#d/${dbName}/reports/` }
      ],
      create: [
        { title: 'Receive', url: `#d/${dbName}/shipment/edit/receive` },
        { title: 'Transfer', url: `#d/${dbName}/shipment/edit/transfer` },
        { title: 'Transfer Out', url: `#d/${dbName}/shipment/edit/transfer-out` }
      ],
      search: [],
      database: prettyRoles.map(db => { return { title: db.name, url: `#d/${db.dbName}/` } })
    }
    if (isLocal) {
      subLinks.admin.push(
        { title: 'Admin Offline Status', url: '/admin-status/' },
        { title: 'Offline Setup', url: '/admin/offline-setup/' }
      )
    }
    if (dbName && dbName.toLowerCase().indexOf('dispensary') !== -1) {
      subLinks.create.push({ title: 'Dispense', url: `#d/${dbName}/shipment/edit/dispense` })
    }
    return subLinks
  },

  getLinks (user, isLocal, currentLocationName) {
    if (!user.name) return { leftLinks: [], rightLinks: [] }
    const server = isLocal ? ' [local]' : ' [online]'
    const leftLinks = []
    const rightLinks = [{ section: 'account', linkName: user.name }]
    if (user.isAdmin) {
      leftLinks.push({ section: 'admin', linkName: `Admin ${server}` })
    } else {
      leftLinks.push({ section: 'database', linkName: (currentLocationName || 'Select Database') + server })
      if (currentLocationName) {
        rightLinks.unshift(
          { linkName: 'View', section: 'view' },
          { section: 'create', linkName: 'Create' },
          { linkName: 'Search', section: 'search' }
        )
      }
    }
    return { leftLinks, rightLinks }
  }

}
