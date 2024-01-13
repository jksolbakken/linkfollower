# linkfollower

![master](https://github.com/jksolbakken/linkfollower/workflows/master/badge.svg)

[![npm version](https://badge.fury.io/js/linkfollower.png)](https://badge.fury.io/js/linkfollower)

[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/jksolbakken/linkfollower/badge)](https://securityscorecards.dev/viewer/?uri=github.com/jksolbakken/linkfollower)

Node.js based command line utility for finding out where a shortened (or any other) HTTP URL end up.
Follows up to 10 redirects. Now also adds User-Agent header to requests since Facebook won't redirect unsupported browsers from fb.me addresses.

## Installation
```
npm install -g linkfollower
```

## Usage

```
follow http://tinyurl.com/m3q2xt
```

## Result
```
http://tinyurl.com/m3q2xt -> 301
http://en.wikipedia.org/wiki/URL_shortening -> 301
https://en.wikipedia.org/wiki/URL_shortening -> 200
```