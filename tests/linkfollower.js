import startFollowing from '../linkfollower.js'
import { expect } from 'chai'
import './webserver.js'
import startWebserver from './webserver.js'

describe('linkfollower', function () {

  before( () => {
    startWebserver()
  })

  it ('should return an array with urls and status codes', async () => {
    const iterator = await startFollowing(new URL('http://localhost:3000/3'))
    for (let i = 0; i < expectedStatusCodesOnly.length; i++) {
      const result = (await iterator.next()).value
      expect(result).to.deep.equal(expectedStatusCodesOnly[i])
    }
  })

  
  it('should cope with up to 10 redirects', async () => {
    let count = 0
    for await (const _ of startFollowing(new URL('http://localhost:3000/10'))) {
      count++
    }
    expect(count).to.equal(10)
  })

  it('should fail if more than 10 redirects', async () => {
      const itr = await startFollowing(new URL('http://localhost:3000/11'))
      for (let i = 0; i < 10; i++) {
        await itr.next()
      }
      const result = (await itr.next()).value
      expect(result.redirect ?? false).to.be.false
  })
  
  it('should fail if status code redirect without location header', async () => {
      const itr = await startFollowing(new URL('http://localhost:3000/nolocation'))
      const result = (await itr.next()).value
      expect(result.redirect ?? false).to.be.false
  })

  it('should handle 200 + meta refresh tag', async function () {
    const iterator = await startFollowing(new URL('http://localhost:3000/meta'))
    for (let i = 0; i < expectedWithMetaRefresh.length; i++) {
      const result = (await iterator.next()).value
      expect(result).to.deep.equal(expectedWithMetaRefresh[i])
    }
  })

  it('should handle meta refresh locations in single quotes', async function () {
    const iterator = await startFollowing(new URL('http://localhost:3000/metasinglequotes'))
    for (let i = 0; i < expectedWithMetaRefresh.length; i++) {
      const result = (await iterator.next()).value
      expect(result).to.deep.equal(expectedWithMetaRefreshSingleQuotes[i])
    }
  })

  it('should handle meta refresh locations in double quotes', async function () {
    const iterator = await startFollowing(new URL('http://localhost:3000/metadoublequotes'))
    for (let i = 0; i < expectedWithMetaRefresh.length; i++) {
      const result = (await iterator.next()).value
      expect(result).to.deep.equal(expectedWithMetaRefreshDoubleQuotes[i])
    }
  })

  it('should append path-only responses to base url', async function () {
    const iterator = await startFollowing(new URL('http://localhost:3000/pathonly'))
    const result = (await iterator.next()).value
    expect(result).to.deep.equal(expectedWithOnlyPath)
  })

  it('should extract links from lnkd.in urls', async function () {
    const iterator = await startFollowing(new URL('http://localhost:3000/lnkdin'))
    const result = (await iterator.next()).value
    expect(result).to.deep.equal(expectedLnkdIn)
  })

  const expectedStatusCodesOnly = [
    {
      'redirect': true,
      'status': 302,
      'url': new URL('http://localhost:3000/3'),
      'redirectUrl': new URL('http://localhost:3000/2')
    },
    {
      'redirect': true,
      'status': 302,
      'url': new URL('http://localhost:3000/2'),
      'redirectUrl': new URL('http://localhost:3000/1')
    },
    {
      'redirect': false,
      'status': 200,
      'url': new URL('http://localhost:3000/1')
    }
  ]

  const expectedWithMetaRefresh = [
    {
      'redirect': true,
      'status': '200 + extracted',
      'url': new URL('http://localhost:3000/meta'),
      'redirectUrl': new URL('http://localhost:3000/1')
    },
    {
      'status': 200,
      'redirect': false,
      'url': new URL('http://localhost:3000/1')
    }
  ]

  const expectedWithMetaRefreshSingleQuotes = [
    {
      'redirect': true,
      'status': '200 + extracted',
      'url': new URL('http://localhost:3000/metasinglequotes'),
      'redirectUrl': new URL('http://localhost:3000/1')
    },
    {
      'status': 200,
      'redirect': false,
      'url': new URL('http://localhost:3000/1')
    }
  ]

  const expectedWithMetaRefreshDoubleQuotes = [
    {
      'redirect': true,
      'status': '200 + extracted',
      'url': new URL('http://localhost:3000/metadoublequotes'),
      'redirectUrl': new URL('http://localhost:3000/1')
    },
    {
      'status': 200,
      'redirect': false,
      'url': new URL('http://localhost:3000/1')
    }
  ]

  const expectedWithOnlyPath = {
    'status': 302,
    'redirect': true,
    'url': new URL('http://localhost:3000/pathonly'),
    'redirectUrl': new URL('http://localhost:3000/only/the/path')
  }

  const expectedLnkdIn = {
    'status': '200 + extracted',
    'redirect': true,
    'url': new URL('http://localhost:3000/lnkdin'),
    'redirectUrl': new URL('https://sf.globalappsec.org/trainings/')
  }

})

