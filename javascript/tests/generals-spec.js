import {parseHash} from 'routing'
import {buildDatabaseLinkColumns} from 'site-header'

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
      expect(route.params.offset).eq(null)
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
      expect(route.params.abc).eq(null)
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
  },
  'site header build database link columns': {
    'should return given number of columns' () {
      let columnCount = 2
      let links = [...Array(30).keys()].map(i => { return {} })
      let result = buildDatabaseLinkColumns(links, columnCount)
      expect(result.length).eq(columnCount)
      expect(result[0].props.children.length).eq(15)
      expect(result[1].props.children.length).eq(15)
      columnCount = 3
      links = [...Array(13).keys()].map(i => { return {} })
      result = buildDatabaseLinkColumns(links, columnCount)
      expect(result.length).eq(columnCount)
      expect(result[0].props.children.length).eq(5)
      expect(result[1].props.children.length).eq(4)
      expect(result[2].props.children.length).eq(4)
      columnCount = 9
      links = [...Array(8).keys()].map(i => { return {} })
      result = buildDatabaseLinkColumns(links, columnCount)
      expect(result.length).eq(columnCount)
      expect(result[0].props.children.length).eq(1)
      expect(result[7].props.children.length).eq(1)
      expect(result[8].props.children.length).eq(0)
    }
  }
}
