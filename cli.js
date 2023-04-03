#!/usr/bin/env node

import startFollowing from './linkfollower.js'

const follow = async url => {
   for await (const response of startFollowing(url)) {
      console.log(`${response.url}: ${response.status}`)
    }
}

if (process.argv.length != 3) {
   console.log('Usage: follow <URL>')
   process.exit(1)
}

follow(process.argv[2])
