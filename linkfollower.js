const edgeOnWin10 = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.2592.102'
const metaRefreshPattern = '(CONTENT|content)=["\']0;[ ]*(URL|url)=(.*?)(["\']*>)'

const MAX_REDIRECT_DEPTH = 10;

const fetchOptions = {
    redirect: 'manual',
    follow: 0,
    headers: {
        'User-Agent': edgeOnWin10,
        'Accept': 'text/html'
    }
}

export default async function* startFollowing(url) {
    let count = 1
    let keepGoing = true
    while (keepGoing) {
        if (count > MAX_REDIRECT_DEPTH) {
            return { url: url, status: `Max redirect depth of ${MAX_REDIRECT_DEPTH} exceeded` }
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
            return locationHeader 
                ? { url: url, redirect: true, status: response.status, redirectUrl: addBaseTo(locationHeader, url.origin) } 
                : { status: `${url} responded with status ${response.status} but no location header` }
        }

        if (response.status === 200) {
            const html = await response.text()
            const extracted = extractors.flatMap((extractor) => extractor(html)).filter((elem) => elem != null)
            return extracted.length !== 0 
                ? { url: url, redirect: true, status: '200 + extracted', redirectUrl: new URL(addBaseTo(extracted[0], url.origin)) }
                : { url: url, redirect: false, status: response.status }
        }
        return { url: url, redirect: false, status: response.status }
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

const extractFromLinkedIn = (html) => {
    const regex = /<a.*name="external_url_click".*>\s+(http[s]?:\/\/.*\s+)<\/a>/g
    const matches = [...html.matchAll(regex)]
    return matches.length != 0 ? matches.map(m => m[1])[0].trim() : null
}

const stripUnwantedCharsFrom = (url) => url.replaceAll(/['" ]/g, "")

const addBaseTo = (maybeCompleteUrl, base) => {
    if (maybeCompleteUrl.startsWith('http')) {
        new URL(maybeCompleteUrl)
    }

    return new URL(maybeCompleteUrl, base)
}

const extractors = [extractMetaRefreshUrl, extractFromLinkedIn]