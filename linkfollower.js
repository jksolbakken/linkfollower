import fetch from 'node-fetch'

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'
const metaRefreshPattern = '(CONTENT|content)=["\']0;[ ]*(URL|url)=(.*?)(["\']*>)'

const MAX_REDIRECT_DEPTH = 10;

const fetchOptions = {
    redirect: 'manual',
    follow: 0,
    headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html'
    }
}

export default async function* startFollowing(url) {
    let count = 1
    let keepGoing = true
    while (keepGoing) {
        if (count > MAX_REDIRECT_DEPTH) {
            return { url: url, status: `Max redirect depth of ${MAX_REDIRECT_DEPTH} exceeded`  }
        }
        try {
            const response = await visit(url)
            count++
            keepGoing = response.redirect
            url = keepGoing ? new URL(response.redirectUrl) : null
            yield response
        } catch (err) {
            keepGoing = false
            return { url: url, status: `${err}` }
        }
    }
}

const visit = async url => {
    try {
        const response = await fetch(url, fetchOptions)   
        if (isRedirect(response.status)) {
            const locationHeader = response.headers.get('location').replaceAll(/\/$/g, "")
            if (!locationHeader) {
                return { status: `${url} responded with status ${response.status} but no location header` }
            }
            return { url: url, redirect: true, status: response.status, redirectUrl: addPathTo(locationHeader, url.origin) }
        } 
        
        if (response.status == 200) {
            const metaRefreshUrl = extractMetaRefreshUrl(await response.text())
            return metaRefreshUrl ?
                { url: url, redirect: true, status: '200 + META REFRESH', redirectUrl: addPathTo(metaRefreshUrl, url.origin) } :
                { url: url, redirect: false, status: response.status }
        } 
    } catch (error) {
        return { status: `${error.message}` }
    }
}

const isRedirect = status => {
    return status === 301
        || status === 302
        || status === 303
        || status === 307
        || status === 308;
}

const extractMetaRefreshUrl = html => {
    let match = html.match(metaRefreshPattern)
    return match && match.length == 5 ? stripUnwantedCharsFrom(match[3]) : null
}

const stripUnwantedCharsFrom = (url) => url
    .replaceAll("'", "")
    .replaceAll('"', "")
    .replaceAll(" ", "")
    .replaceAll(/\/$/g, "")

const addPathTo = (locationResponse, base) => {
    if (locationResponse.startsWith('http')) {
        new URL(locationResponse)
    }

    return new URL(locationResponse, base)
}