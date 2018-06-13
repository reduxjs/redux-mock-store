/* eslint-env mocha */
const expect = require('expect')
const reduxMockStore = require('../../dist/index-cjs')

describe('CommonJS Build', () => {
  it('exports configureStore by default', () => {
    expect(typeof reduxMockStore.default).toBe('function')
    expect(reduxMockStore.default.name).toBe('configureStore')
  })

  it('exports a named configureStore property', () => {
    expect(typeof reduxMockStore.configureStore).toBe('function')
    expect(reduxMockStore.configureStore.name).toBe('configureStore')
  })
})
