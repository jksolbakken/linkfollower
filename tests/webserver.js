import express from 'express'
const app = express()

const startWebserver = () => {
  console.log('Starting server');

  app.get('/nolocation', (_, res) => {
    res.sendStatus(302)
  })
  
  app.get('/meta', (_, res) => {
    res.send('<META http-equiv="refresh" content="0; url=http://localhost:3000/1">')
  })

  app.get('/metasinglequotes', (_, res) => {
    res.send(`<META http-equiv="refresh" content="0; url='http://localhost:3000/1'">`)
  })

  app.get('/metadoublequotes', (_, res) => {
    res.send(`<META http-equiv="refresh" content='0; url='"http://localhost:3000/1"'>`)
  })

  app.get('/pathonly', (_, res) => {
    res.redirect('/only/the/path')
  })
  
  app.get('/:number', (req, res) => {
    let number = req.params.number;
    if (number > 1) {
       res.redirect('http://localhost:3000/' + (--number))
    } else {
       res.send("That's it!")
    }
  })
  
  app.listen(3000, function () {
    console.log('Web server listening on port 3000!')
  })
}

export default startWebserver
