import { parseLocations } from 'locations'

import chai from 'chai'
const expect = chai.expect

const locationsResponse = {'rows': [
  {'key': ['E', 'Normal Location', {}], 'value': 25},
  {'key': ['E', 'Normal Location', null], 'value': 3},
  {'key': ['I', 'Normal Internal Location', {}], 'value': 8},
  {'key': ['EV', 'Expired Location', null], 'value': 22},
  {'key': ['E', 'Excluded Location', {'excludeFromConsumption': true}], 'value': 2},
  {'key': ['E', 'Location later excluded through extension', {'excludeFromConsumption': false}], 'value': 2}
]}

const extensionsResponse = {
  'total_rows': 100,
  'offset': 0,
  'rows': [
    {
      'id': '00__2016-11-03T07:08:23.634Z__test__extension',
      'key': 'extension',
      'value': 1,
      'doc': {'_id': '00__2016-11-03T07:08:23.634Z__test__extension', '_rev': '1-e3ab8b60c3b8aedc947f865ccc28d941', 'created': '2016-11-03T07:08:23.634Z', 'username': 'kdoran', 'docType': 'extension', 'subjectType': 'location', 'subject': 'Test Location Excluded Through Doc', 'attributes': {'excludeFromConsumption': true}, 'updated': '2016-11-03T07:08:23.635Z'}
    },
    {
      'id': '00__2016-11-03T07:08:23.634Z__test__extension',
      'key': 'extension',
      'value': 1,
      'doc': {'_id': '00__2016-11-03T07:08:23.634Z__test__extension', '_rev': '1-e3ab8b60c3b8aedc947f865ccc28d941', 'created': '2016-11-03T07:08:23.634Z', 'username': 'kdoran', 'docType': 'extension', 'subjectType': 'location', 'subject': 'Location later excluded through extension', 'attributes': {'excludeFromConsumption': true}, 'updated': '2016-11-03T07:08:23.635Z'}
    }
  ]
}

const locationsState = parseLocations(locationsResponse, extensionsResponse)

export default {
  'parseLocations': {
    'should return a unique list of locations' () {
      expect(locationsState.locations instanceof Array).eq(true)
      expect(locationsState.locations[0].name).eq('Normal Location')
      expect(locationsState.locations[0].type).eq('E')
    },
    'should return unique locations' () {
      let foundDuplicate = false
      const locHash = {}
      locationsState.locations.forEach(loc => {
        if (locHash[loc.name]) {
          foundDuplicate = true
        } else {
          locHash[loc.name] = true
        }
      })
      expect(foundDuplicate).eq(false)
    },
    'should return a hash of locations that are excluded from consumption' () {
      expect(typeof locationsState.locationsExcludedFromConsumption).eq('object')
    },
    'should include excludeFromConsumption attribute if found in extension doc' () {
      expect(locationsState.locationsExcludedFromConsumption['Location later excluded through extension']).eq(true)
      const loc = locationsState.locations.find(l => l.name === 'Location later excluded through extension')
      expect(loc.attributes.excludeFromConsumption).eq(true)
    },
    'should return locations from locations response with excludedFromConsumption attribute' () {
      expect(locationsState.locationsExcludedFromConsumption['Excluded Location']).eq(true)
    },
    'should return locations from locations response with type "EV"' () {
      expect(locationsState.locationsExcludedFromConsumption['Expired Location']).eq(true)
    },
    'should not include normal locations' () {
      expect(locationsState.locationsExcludedFromConsumption['Normal Location']).eq(undefined)
    },
    'should return locations from extension docs' () {
      expect(locationsState.locationsExcludedFromConsumption['Test Location Excluded Through Doc']).eq(true)
    },
    'should return externalLocations all with type "E"' () {
      expect(locationsState.externalLocations.length).eq(4)
      locationsState.externalLocations.forEach(location => {
        expect(['E', 'EV'].indexOf(location.type)).not.eq(-1)
      })
    }
  }
}
