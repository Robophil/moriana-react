import chai from 'chai'
const expect = chai.expect
import testUtils from 'test-utils'
import { HomePage } from 'home-page'

export default {
  'Viewing all shipments': {
    'should render given shipments' () {
      const numShipments = 10
      const rows = testUtils.getShipments(numShipments)
      const props = { ...testUtils.getRoute(), rows }
      const homePageEl = testUtils.getElement(new HomePage(props))
      expect(homePageEl.querySelectorAll('tbody tr').length).eq(numShipments)
    }
  }
}
