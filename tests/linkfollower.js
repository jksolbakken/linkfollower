import startFollowing from '../linkfollower.js'
import chai from 'chai'
import './webserver.js'
import startWebserver from './webserver.js'

const expect = chai.expect

describe('linkfollower', function () {

  before( () => {
    startWebserver()
  })

  it ('should return an array with urls and status codes', async () => {
    const iterator = await startFollowing('http://localhost:3000/3')
    for (let i = 0; i < expectedStatusCodesOnly.length; i++) {
      const result = (await iterator.next()).value
      expect(result).to.deep.equal(expectedStatusCodesOnly[i])
    }
  })

  
  it('should cope with up to 10 redirects', async () => {
    let count = 0
    for await (const _ of startFollowing('http://localhost:3000/10')) {
      count++
    }
    expect(count).to.equal(10)
  })

  it('should fail if more than 10 redirects', async () => {
      const itr = await startFollowing('http://localhost:3000/11')
      for (let i = 0; i < 10; i++) {
        await itr.next()
      }
      const result = (await itr.next()).value
      expect(result.redirect ?? false).to.be.false
  })
  
  it('should fail if status code redirect without location header', async () => {
      const itr = await startFollowing('http://localhost:3000/nolocation')
      const result = (await itr.next()).value
      expect(result.redirect ?? false).to.be.false
  })
  
  it('should add missing http prefix in links', async () => {
    const itr = await startFollowing('localhost:3000/1')
    const result = (await itr.next()).value
    expect(result.status).to.equal(200)
    expect(result.url).to.equal('http://localhost:3000/1')
  })

  it('should handle 200 + meta refresh tag', async function () {
    const iterator = await startFollowing('http://localhost:3000/meta')
    for (let i = 0; i < expectedWithMetaRefresh.length; i++) {
      const result = (await iterator.next()).value
      expect(result).to.deep.equal(expectedWithMetaRefresh[i])
    }
  })

  it('should handle meta refresh locations in single quotes', async function () {
    const iterator = await startFollowing('http://localhost:3000/metasinglequotes')
    for (let i = 0; i < expectedWithMetaRefresh.length; i++) {
      const result = (await iterator.next()).value
      expect(result).to.deep.equal(expectedWithMetaRefreshSingleQuotes[i])
    }
  })

  it('should handle meta refresh locations in double quotes', async function () {
    const iterator = await startFollowing('http://localhost:3000/metadoublequotes')
    for (let i = 0; i < expectedWithMetaRefresh.length; i++) {
      const result = (await iterator.next()).value
      expect(result).to.deep.equal(expectedWithMetaRefreshDoubleQuotes[i])
    }
  })

  const expectedStatusCodesOnly = [
    {
      'redirect': true,
      'status': 302,
      'url': 'http://localhost:3000/3',
      'redirectUrl': 'http://localhost:3000/2'
    },
    {
      'redirect': true,
      'status': 302,
      'url': 'http://localhost:3000/2',
      'redirectUrl': 'http://localhost:3000/1'
    },
    {
      'redirect': false,
      'status': 200,
      'url': 'http://localhost:3000/1'
    }
  ]

  const expectedWithMetaRefresh = [
    {
      'redirect': true,
      'status': '200 + META REFRESH',
      'url': 'http://localhost:3000/meta',
      'redirectUrl': 'http://localhost:3000/1'
    },
    {
      'status': 200,
      'redirect': false,
      'url': 'http://localhost:3000/1'
    }
  ]

  const expectedWithMetaRefreshSingleQuotes = [
    {
      'redirect': true,
      'status': '200 + META REFRESH',
      'url': 'http://localhost:3000/metasinglequotes',
      'redirectUrl': 'http://localhost:3000/1'
    },
    {
      'status': 200,
      'redirect': false,
      'url': 'http://localhost:3000/1'
    }
  ]

  const expectedWithMetaRefreshDoubleQuotes = [
    {
      'redirect': true,
      'status': '200 + META REFRESH',
      'url': 'http://localhost:3000/metadoublequotes',
      'redirectUrl': 'http://localhost:3000/1'
    },
    {
      'status': 200,
      'redirect': false,
      'url': 'http://localhost:3000/1'
    }
  ]

})
