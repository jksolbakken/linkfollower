var express = require('express');
var app = express();

app.get('/nolocation', (req, res) => {
  //res.header('Location', 'Something');
  res.sendStatus(302);
});

app.get('/meta', (req, res) => {
  res.send('<META http-equiv="refresh" content="0;url=http://localhost:3000/1">')
});

app.get('/:number', (req, res) => {
  let number = req.params.number;
  if (number > 1) {
     res.redirect('http://localhost:3000/' + (--number));
  } else {
     res.send("That's it!");
  }
});

app.listen(3000, function () {
  console.log('Web server listening on port 3000!');
});