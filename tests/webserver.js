var express = require('express');
var app = express();

app.use('/nolocation', (req, res, next) => {
  //res.header('Location', 'Something');
  res.sendStatus(302);
});

app.use('/:number', (req, res, next) => {
  let number = req.params.number;
  if (number > 1) {
     res.redirect('http://localhost:3000/' + (--number));
  } else {
     res.send("That's it!");
  }
  next();
});

app.listen(3000, function () {
  console.log('Web server listening on port 3000!');
});