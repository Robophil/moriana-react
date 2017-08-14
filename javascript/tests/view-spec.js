import {getShipments, getRoute, getElement} from 'test-utils'
import { ShipmentsPage } from 'shipments-page'

import chai from 'chai'
const expect = chai.expect

export default {
  'Viewing all shipments': {
    'should render given shipments' () {
      const numShipments = 10
      const shipments = getShipments(numShipments)
      const props = { ...getRoute(), shipments }
      const homePageEl = getElement(new ShipmentsPage(props))
      expect(homePageEl.querySelectorAll('tbody tr').length).eq(numShipments)
    }
  }
}
