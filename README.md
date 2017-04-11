# linkfollower

[![Build Status](https://travis-ci.org/jksolbakken/linkfollower.svg?branch=master)](https://travis-ci.org/jksolbakken/linkfollower)

[![npm version](https://badge.fury.io/js/linkfollower.png)](https://badge.fury.io/js/linkfollower)

Node.js based command line utility for finding out where a shortened (or any other) HTTP URL end up.
Follows up to 10 redirects. Now also adds Chrome User-Agent header to requests since Facebook won't redirect 
unsupported browsers from fb.me addresses.

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