#!/usr/bin/env node

const follower = require('./linkfollower');

let link = process.argv[2];
if (!link) {
   console.log('Usage: follow <URL>');
   process.exit(1);
}

follower.follow(link)
   .then(result => {
      result.forEach(value => console.log(value.url + ' -> ' + value.status));
   })
   .catch(error => {
      console.error(error);
   });