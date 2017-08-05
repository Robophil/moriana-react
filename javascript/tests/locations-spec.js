import chai from 'chai';
const expect = chai.expect;
import { parseLocations } from 'locations'

const locations = {"rows":[
  {"key":["E","Normal Location",{}],"value":25},
  {"key":["EV","Expired Location",null],"value":22},
  {"key":["E","Excluded Location",{"excludeFromConsumption":true}],"value":2},
]}

const extensions = {"total_rows":100,"offset":0,"rows":[
  {"id":"00__2016-11-03T07:08:23.634Z__test__extension","key":"extension","value":1,"doc":{"_id":"00__2016-11-03T07:08:23.634Z__test__extension","_rev":"1-e3ab8b60c3b8aedc947f865ccc28d941","created":"2016-11-03T07:08:23.634Z","username":"kdoran","docType":"extension","subjectType":"location","subject":"Test Location Excluded Through Doc","attributes":{"excludeFromConsumption":true},"updated":"2016-11-03T07:08:23.635Z"}},
]}

export default {
  'parseLocations': {
    'should return a unique list of locations' () {
      expect(false).eq(true)
    },
    'should return a hash of locations that are excluded from consumption' () {
      expect(false).eq(true)
    }
  },
}
