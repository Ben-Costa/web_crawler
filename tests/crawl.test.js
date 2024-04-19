const { normalizeURL } = require('../crawl.js')
const {test, expect} = require('@jest/globals')

test('normalizeURL', () => {
    const input = 'http://test.domain.com/path'
    const output = normalizeURL(input)
    const expectedOutput = 'test.domain.com/path'
    expect(output).toEqual(expectedOutput)
})

//trailing slash test
test('normalizeURLTrailingSlash', () => {
    const input = 'http://test.domain.com/path/'
    const output = normalizeURL(input)
    const expectedOutput = 'test.domain.com/path'
    expect(output).toEqual(expectedOutput)
})

test('normalizeURLCapitals', () => {
    const input = 'http://test.Domain.com/path/'
    const output = normalizeURL(input)
    const expectedOutput = 'test.domain.com/path'
    expect(output).toEqual(expectedOutput)
})

test('normalizeURLDifferntProtocol', () => {
    const input = 'https://test.domain.com/path/'
    const output = normalizeURL(input)
    const expectedOutput = 'test.domain.com/path'
    expect(output).toEqual(expectedOutput)
})