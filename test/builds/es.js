/* eslint-env mocha */
import expect from 'expect'
import configureStore from '../../dist/index-es'

describe('ES Module Build', () => {
  it('exports configureStore by default', () => {
    expect(typeof configureStore).toBe('function')
    expect(configureStore.name).toBe('configureStore')
  })
})
