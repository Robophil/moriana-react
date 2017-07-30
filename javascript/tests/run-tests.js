// I couldn't get jasmine nor mocha to work in just the browser
// without needing a separate 'npm tests', so kept things simple, convention is just:
// { 'section of tests name': { 'individual test name': () => { //expect goes here } }}

import viewSpecs from 'view-specs'
import stockSpecs from 'stock-specs'

export default function () {
  console.log('%c Running tests in local dev environment...', 'color: blue;')
  let testsCount = 0
  let testsPassed = 0
  const testFiles = {viewSpecs, stockSpecs}
  Object.keys(testFiles).forEach(filename => {
    Object.keys(testFiles[filename]).map(description => {
      Object.keys(testFiles[filename][description]).map(testName => {
        testsCount++
        try {
          testFiles[filename][description][testName]()
          testsPassed++
        } catch (e) {
          console.log(`Test Failed in %c${filename}:` + `%c ${description} ${testName}`, 'color: blue;', 'color: red;')
          console.log(e.stack)
        }
      })
    })
  })
  console.log(`%c ${testsPassed} of ${testsCount} tests passed. (${Math.floor( testsPassed / testsCount * 100 )}%)`, 'color: blue;');
}
