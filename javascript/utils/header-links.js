export default {

  getSublinks(prettyRoles, isLocal, dbName) {
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
        { title: 'Shipments', url: `#d/${dbName}/`, icon: 'icon mail-solid' },
        { title: 'Current Stock', url: `#d/${dbName}/stock/`, icon: 'icon menu' },
        { title: 'Reports', url: `#d/${dbName}/reports/`, icon: 'icono-barChart' }
      ],
      create: [
        { title: 'Receive', url: `#d/${dbName}/shipment/edit-new/receive`, icon: 'icon arrow-down' },
        { title: 'Transfer', url: `#d/${dbName}/shipment/edit-new/transfer`, icon: 'icon arrow-right' },
        { title: 'Transfer Out', url: `#d/${dbName}/shipment/edit-new/transfer-out`, icon: 'icon arrow-up' }
      ],
      search: [],
      database: prettyRoles.map(db => { return { title: db.name, url: `#d/${db.dbName}/`, icon: 'icon focus' } })
    }
    if (isLocal) {
      subLinks.admin.push(
        { title: 'Admin Offline Status', url: '/admin-status/' },
        { title: 'Offline Setup', url: '/admin/offline-setup/' }
      )
    }
    if (dbName && dbName.toLowerCase().indexOf('dispensary') !== -1) {
      subLinks.create.push({
        title: 'Dispense', url: `#d/${dbName}/shipment/edit-new/dispense`, icon: 'icon arrow-right'
      })
    }
    return subLinks
  },

  getLinks(user, isLocal, currentLocationName) {
    if (!user.name) return { leftLinks: [], rightLinks: [] }
    const server = isLocal ? ' [local]' : ' [online]'
    const leftLinks = []
    const rightLinks = [{ section: 'account', icon: 'profile', linkName: user.name }]
    if (user.isAdmin) {
      leftLinks.push({
        section: 'admin',
        icon: 'gear',
        linkName: `Admin ${server}`
      })
    } else {
      leftLinks.push({
        section: 'database',
        icon: 'focus',
        linkName: (currentLocationName ? currentLocationName : 'Select Location') + server
      })
      if (currentLocationName) {
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
