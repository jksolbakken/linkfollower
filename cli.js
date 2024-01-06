#!/usr/bin/env node

import startFollowing from './linkfollower.js'

const follow = async url => {
   const iterator = startFollowing(url)
   let result = await iterator.next()
   while (!result.done) {
      console.log(`${result.value.url} ${result.value.status}`)
      result = await iterator.next()
   }
   if (result.value?.status) {
      console.log(result.value.status)
   }
}

if (process.argv.length != 3) {
   console.log('Usage: follow <URL>')
   process.exit(1)
}

const prefixWithHttp = url => {
   let pattern = new RegExp('^http');
   if (!pattern.test(url)) {
       return 'http://' + url;
   }

   return url;
}

const url = new URL(prefixWithHttp(process.argv[2]))
follow(url)
