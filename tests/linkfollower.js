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
    const result = await startFollowing('http://localhost:3000/3')
    expect(result).to.deep.equal(expectedStatusCodesOnly)
  })

  it('should cope with up to 10 redirects', async () => {
    const result = await startFollowing('http://localhost:3000/10')
    expect(result.length).to.equal(10)
  })

  it('should fail if more than 10 redirects', async () => {
    try {
      await startFollowing('http://localhost:3000/11')
    } catch (error) {
      expect(error).to.equal('Exceeded max redirect depth of 10')
    }
  })

  it('should fail if status code redirect without location header', async () => {
    try {
      await startFollowing('http://localhost:3000/nolocation')
    } catch (error) {
      expect(error).to.equal('http://localhost:3000/nolocation returned a redirect but no URL')
    }
  })

  it('should add missing http prefix in links', async () => {
    const result = await startFollowing('localhost:3000/1')
    expect(result[0].status).to.equal(200)
  })

  it('should handle 200 + meta refresh tag', async function () {
    const result = await startFollowing('localhost:3000/meta')
    return expect(result).to.deep.equal(expectedWithMetaRefresh)
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

})
