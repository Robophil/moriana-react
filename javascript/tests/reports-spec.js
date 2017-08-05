import chai from 'chai';
const expect = chai.expect;
import locationsReducer from 'locations'
import {RECEIVED_ALL_TRANSACTIONS} from 'locations'

const shipments = [
  {  }
]
const locationsExcludedFromConsumption = {}

export default {
  'locations reducer: RECEIVED_ALL_TRANSACTIONS': {
    'should return a list of available date filters' () {
      expect(locationsState.locations instanceof Array).eq(true)
      expect(locationsState.locations[0].name).eq('Normal Location')
      expect(locationsState.locations[0].type).eq('E')
    },
  },
}
