// I couldn't get jasmine nor mocha to work in just the browser
// (everything wanted a separate 'npm tests' process running in a second terminal with a headless browser, karma)
//  but this somewhat hacky convention is:
// each testfilename-spec.js has:
// { 'section of tests name': { 'individual test name': () => { //expect goes here } }}

export default function () {
  console.log('%c Running tests in local dev environment...', 'color: blue;')
  let testsCount = 0
  let testsPassed = 0
  // const testFiles = {viewSpecs, stockSpecs, locationsSpec}
  const testsContext = require.context('./', false, /-spec$/)
  testsContext.keys().map(filename => {
    const testModule = testsContext(filename).default
    Object.keys(testModule).forEach(testSection => {
      Object.keys(testModule[testSection]).forEach(testName => {
        testsCount++
        try {
          testModule[testSection][testName]()
          testsPassed++
        } catch (e) {
          console.log(`Test Failed in %c${filename}:` + `%c ${testSection} ${testName}`, 'color: blue;', 'color: red;')
          console.log(e.stack)
        }
      })
    })
  })
  console.log(`%c ${testsPassed} of ${testsCount} tests passed. (${Math.floor( testsPassed / testsCount * 100 )}%)`, 'color: blue;');
}
