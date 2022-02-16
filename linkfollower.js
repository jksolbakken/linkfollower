import fetch from 'node-fetch'

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'
const metaRefreshPattern = '(CONTENT|content)=["\']0;[ ]*(URL|url)=(.*?)(["\']*>)';

const MAX_REDIRECT_DEPTH = 10;

const fetchOptions = {
    redirect: 'manual',
    follow: 0,
    headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html'
    }
}

export default async url => {
    const visits = []
    let count = 1
    let keepGoing = true
    while (keepGoing) {
        if (count > MAX_REDIRECT_DEPTH) {
            throw `Exceeded max redirect depth of ${MAX_REDIRECT_DEPTH}`
        }
        try {
            const response = await visit(url)
            count++
            visits.push(response)
            keepGoing = response.redirect
            url = response.redirectUrl
        } catch (err) {
            keepGoing = false
            visits.push({ url: url, redirect: false, status: `Error: ${err}` })
        }
    }
    return visits;
}

const visit = async url => {
    url = prefixWithHttp(url)
    const response = await fetch(url, fetchOptions)

    if (isRedirect(response.status)) {
        const location = response.headers.get('location')
        if (!location) {
            throw `${url} responded with status ${response.status} but no location header`
        }
        return { url: url, redirect: true, status: response.status, redirectUrl: response.headers.get('location') }
    } else if (response.status == 200) {
        const text = await response.text()
        const redirectUrl = extractMetaRefreshUrl(text)
        return redirectUrl ?
            { url: url, redirect: true, status: '200 + META REFRESH', redirectUrl: redirectUrl } :
            { url: url, redirect: false, status: response.status }
    } else {
        return { url: url, redirect: false, status: response.status }
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
    return match && match.length == 5 ? match[3] : null
}

const prefixWithHttp = url => {
    let pattern = new RegExp('^http');
    if (!pattern.test(url)) {
        return 'http://' + url;
    }

    return url;
}
