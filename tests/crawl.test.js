const { normalizeURL, getURLsFromHTML } = require('../crawl.js')
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

test('getURLsSingle', () => {
    const inputHTML = `
    <html>
        <body>
            <a href="https://test.domain.com/path/">
            blog page
            </a>
        <body>  
    <html>   
    `
    const inputBaseULR = "https://test.domain.com/path/"
    const output = getURLsFromHTML(inputHTML, inputBaseULR)
    const expectedOutput = ['https://test.domain.com/path/']
    expect(output).toEqual(expectedOutput)
})

test('getURLsMutliple', () => {
    const inputHTML = `
    <html>
        <body>
            <a href="https://test.domain.com/path/">
            blog page
            </a>
            <a href="/path/2">
            blog page
            </a>
        <body>  
    <html>   
    `
    const inputBaseULR = "https://test.domain.com"
    const output = getURLsFromHTML(inputHTML, inputBaseULR)
    const expectedOutput = ['https://test.domain.com/path/', 'https://test.domain.com/path/2']
    expect(output).toEqual(expectedOutput)
})

test('getURLsRelative', () => {
    const inputHTML = `
    <html>
        <body>
            <a href="/path/">
            blog page
            </a>
        <body>  
    <html>   
    `
    const inputBaseULR = "https://test.domain.com"
    const output = getURLsFromHTML(inputHTML, inputBaseULR)
    const expectedOutput = ['https://test.domain.com/path/']
    expect(output).toEqual(expectedOutput)
})

test('getURLsInvalid', () => {
    const inputHTML = `
    <html>
        <body>
            <a href="invalid">
            blog page
            </a>
        <body>  
    <html>   
    `
    const inputBaseULR = "https://test.domain.com"
    const output = getURLsFromHTML(inputHTML, inputBaseULR)
    const expectedOutput = []
    expect(output).toEqual(expectedOutput)
})