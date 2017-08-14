import {parseHash} from 'routing'

import chai from 'chai'
const expect = chai.expect

const PAGES = {
  '/': { paramKeys: ['offset'] },
  'test': { paramKeys: [] },
  'test/shipment': { paramKeys: ['abc'] }
}

export default {
  'routings parseHash': {
    // route object looks like: { path: "/", dbName: moriana_loc, currentLocationName: Loc, params: [] }
    'should turn "#d/moriana_loc/" into a route object' () {
      const route = parseHash('#d/moriana_loc/', PAGES)
      expect(route.path).eq('/')
      expect(route.dbName).eq('moriana_loc')
      expect(route.currentLocationName).eq('Loc')
      expect(route.params.offset).eq(0)
    },
    'should turn "" into a route object of { path: "/", dbName: null, currentLocationName: null, params: []}' () {
      const route = parseHash('', PAGES)
      expect(route.path).eq('/')
      expect(route.dbName).eq(null)
      expect(route.currentLocationName).eq(null)
      expect(Object.keys(route.params).length).eq(0)
    },
    'should get params: {offset: 500} from "#d/moriana_loc/500"' () {
      const route = parseHash('#d/moriana_loc/500', PAGES)
      expect(route.path).eq('/')
      expect(route.params.offset).eq(500)
    },
    'should return route = test/shipment on test/shipment' () {
      const route = parseHash('#d/moriana_loc/test/shipment', PAGES)
      expect(route.params.abc).eq(0)
      expect(route.path).eq('test/shipment')
    },
    'should return params on nested routes' () {
      const route = parseHash('#d/moriana_loc/test/shipment/abcval', PAGES)
      expect(route.params.abc).eq('abcval')
      expect(route.path).eq('test/shipment')
    },
    'should return route = test on test' () {
      const route = parseHash('#d/moriana_loc/test', PAGES)
      expect(route.path).eq('test')
    }
  }
}
