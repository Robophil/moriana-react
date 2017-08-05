import chai from 'chai'
const expect = chai.expect
import testUtils from 'test-utils'
import { HomePage } from 'home-page'

export default {
  'Viewing all shipments': {
    'should render given shipments' () {
      const numShipments = 10
      const shipments = testUtils.getShipments(numShipments)
      const props = { ...testUtils.getRoute(), shipments }
      const homePageEl = testUtils.getElement(new HomePage(props))
      expect(homePageEl.querySelectorAll('tbody tr').length).eq(numShipments)
    }
  }
}
