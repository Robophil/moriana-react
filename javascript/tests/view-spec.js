import chai from 'chai'
const expect = chai.expect
import {getShipments, getRoute, getElement} from 'test-utils'
import { HomePage } from 'home-page'

export default {
  'Viewing all shipments': {
    'should render given shipments' () {
      const numShipments = 10
      const shipments = getShipments(numShipments)
      const props = { ...getRoute(), shipments }
      const homePageEl = getElement(new HomePage(props))
      expect(homePageEl.querySelectorAll('tbody tr').length).eq(numShipments)
    }
  }
}
