const http = require('http');
const https = require('https');
const url = require('url');

const metaRefreshPattern = '(CONTENT|content)=["\']0;[ ]*(URL|url)=(.*?)(["\']\s*>)';
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246';

const MAX_REDIRECT_DEPTH = 10;

let follow = (link) => {
    return new Promise((resolve, reject) => {
        link = prefixWithHttp(link);
        let parsedUrl = url.parse(link);
        if (!parsedUrl.host) {
            reject(link + ' is not a valid URL');
        }

        startFollowing(parsedUrl, result => {
            resolve(result);
        }, error => {
            reject(error.message);
        });
    })
};

let startFollowing = (startUrl, success, failure) => {
    let depth = 0;
    let result = [];

    let visit = location => {
        if (depth >= MAX_REDIRECT_DEPTH) {
            failure(new Error('Exceeded max redirect depth of ' + MAX_REDIRECT_DEPTH));
        }

        let options = {
            host: location.hostname,
            path: location.path,
            port: location.port,
            headers: {
                'User-Agent': userAgent
            }
        };
        let requestor = location.protocol.startsWith('https') ? https : http;
        requestor.get(options, response => {
            let html = [];
            response.on('data', d => {
                html.push(d.toString());
            });

            response.on('end', () => {
                let processedResponse = processResponse(response, "".concat(...html));
                let statusCode = response.statusCode;
                let statusTxt = (statusCode === 200 && processedResponse.url) ? '200 + META REFRESH' : statusCode;
                result.push({ url: location.href, status: statusTxt});
                if (processedResponse.redirect) {
                    if (!processedResponse.url) {
                        failure(new Error(location.href + ' returned a redirect but no URL'));
                        return;
                    }
                    depth++;
                    visit(location.parse(processedResponse.url));
                } else {
                    success(result);
                }

            });
        }).on('error', function (err) {
            failure(err);
        });
    }

    visit(startUrl);
};

let processResponse = (response, html) => {
    let statusCode = response.statusCode;
    let httpRedirect = 
        statusCode === 301
        || statusCode === 302
        || statusCode === 303
        || statusCode === 307
        || statusCode === 308;
    if (httpRedirect) {
        return { redirect: true, url: response.headers.location }
    }

    let htmlRefreshUrl = extractMetaRefreshUrl(html);
    if (htmlRefreshUrl) {
        return { redirect: true, url: htmlRefreshUrl }
    }

    return { redirect: false }
}

let prefixWithHttp = link => {
    let pattern = new RegExp('^http');
    if (!pattern.test(link)) {
        return 'http://' + link;
    }

    return link;
}

let extractMetaRefreshUrl = html => {
    let match = html.match(metaRefreshPattern);
    return match && match.length == 5 ? match[3] : null;
}

exports.follow = follow;
