import {parseHash} from 'utils/routing'
import {buildDatabaseLinkColumns} from 'containers/site-header'

const PAGES = {
  '/': { paramKeys: ['offset'] },
  'test': { paramKeys: [] },
  'test/shipment': { paramKeys: ['abc'] }
}

describe('routings parseHash', () => {
  // route object looks like: { path: "/", dbName: moriana_loc, currentLocationName: Loc, params: [] }
  test('should turn "#d/moriana_loc/" into a route object', () => {
    const route = parseHash('#d/moriana_loc/', PAGES)
    expect(route.path).toBe('/')
    expect(route.dbName).toBe('moriana_loc')
    expect(route.currentLocationName).toBe('Loc')
    expect(route.params.offset).toBe(null)
  })

  test('should turn "" into a route object of { path: "/", dbName: null, currentLocationName: null, params: []}', () => {
    const route = parseHash('', PAGES)
    expect(route.path).toBe('/')
    expect(route.dbName).toBe(null)
    expect(route.currentLocationName).toBe(null)
    expect(Object.keys(route.params).length).toBe(0)
  })

  test('should get params: {offset: 500} from "#d/moriana_loc/500"', () => {
    const route = parseHash('#d/moriana_loc/500', PAGES)
    expect(route.path).toBe('/')
    expect(route.params.offset).toBe(500)
  })

  test('should return route = test/shipment on test/shipment', () => {
    const route = parseHash('#d/moriana_loc/test/shipment', PAGES)
    expect(route.params.abc).toBe(null)
    expect(route.path).toBe('test/shipment')
  })

  test('should return params on nested routes', () => {
    const route = parseHash('#d/moriana_loc/test/shipment/abcval', PAGES)
    expect(route.params.abc).toBe('abcval')
    expect(route.path).toBe('test/shipment')
  })

  test('should return route = test on test', () => {
    const route = parseHash('#d/moriana_loc/test', PAGES)
    expect(route.path).toBe('test')
  })
})

// TODO: Jest with webpack 

// describe('site header build database link columns', () => {
//   test('should return given number of columns', () => {
//     let columnCount = 2
//     let links = [...Array(30).keys()].map(i => { return {} })
//     let result = buildDatabaseLinkColumns(links, columnCount)
//     expect(result.length).toBe(columnCount)
//     expect(result[0].props.children.length).toBe(15)
//     expect(result[1].props.children.length).toBe(15)
//     columnCount = 3
//     links = [...Array(13).keys()].map(i => { return {} })
//     result = buildDatabaseLinkColumns(links, columnCount)
//     expect(result.length).toBe(columnCount)
//     expect(result[0].props.children.length).toBe(5)
//     expect(result[1].props.children.length).toBe(4)
//     expect(result[2].props.children.length).toBe(4)
//     columnCount = 9
//     links = [...Array(8).keys()].map(i => { return {} })
//     result = buildDatabaseLinkColumns(links, columnCount)
//     expect(result.length).toBe(columnCount)
//     expect(result[0].props.children.length).toBe(1)
//     expect(result[7].props.children.length).toBe(1)
//     expect(result[8].props.children.length).toBe(0)
//   })
// })
