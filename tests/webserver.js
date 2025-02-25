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

  app.get('/lnkdin', (_, res) => {
    res.send(lnkdInResponse)
  })
  
  app.get('/redirecttoerror', (req, res) => {
    res.redirect('http://localhost:3000/yolo')
  })

  app.get('/yolo', (req, res) => {
    res.sendStatus(404)
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

const lnkdInResponse = `<!DOCTYPE html>









<html lang="en">
  <head>
    <meta name="pageKey" content="d_shortlink_frontend_external_link_redirect_interstitial">
<!---->        <meta name="locale" content="en_US">
    <meta id="config" data-app-version="0.0.220" data-call-tree-id="AAYdONb2EJX4Hv2k7h+aqQ==" data-multiproduct-name="shortlink-frontend" data-service-name="shortlink-frontend" data-browser-id="4421e75c-497c-46ee-8503-ff9325f2f97b" data-page-instance="urn:li:page:d_shortlink_frontend_external_link_redirect_interstitial;QABwdWSFRIW+UIPAkJVk/Q==" data-disable-jsbeacon-pagekey-suffix="false">

    <link rel="canonical" href="https://www.linkedin.com">
<!----><!---->
<!---->
<!---->
<!---->
<!---->
      <link rel="icon" href="https://static.licdn.com/aero-v1/sc/h/al2o9zrvru7aqj8e1x2rzsrca">

    <script>
      function getDfd() {let yFn,nFn;const p=new Promise(function(y, n){yFn=y;nFn=n;});p.resolve=yFn;p.reject=nFn;return p;}
      window.lazyloader = getDfd();
      window.tracking = getDfd();
      window.impressionTracking = getDfd();
      window.ingraphTracking = getDfd();
      window.appDetection = getDfd();
      window.pemTracking = getDfd();
    </script>

<!---->

    <title>LinkedIn</title>
    <meta name="description" content="This link will take you to a page that’s not on LinkedIn">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta property="og:title" content="LinkedIn">
    <meta property="og:description" content="This link will take you to a page that’s not on LinkedIn">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://www.linkedin.com">
    <meta property="og:image" content="https://static.licdn.com/scds/common/u/images/logos/favicons/v1/favicon.ico">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:site" content="@linkedin">
    <meta name="twitter:title" content="LinkedIn">
    <meta name="twitter:description" content="This link will take you to a page that’s not on LinkedIn">
    <meta name="twitter:image" content="https://static.licdn.com/scds/common/u/images/logos/favicons/v1/favicon.ico">
    <meta name="robots" content="noarchive">
    <meta name="asset-url" id="artdeco-icons/static/images/icons.svg" content="https://static.licdn.com/aero-v1/sc/h/4u3n21bmitzyljlm274yvwzfu">
    <link rel="stylesheet" href="https://static.licdn.com/aero-v1/sc/h/cx9odeynkvgtvlvwt4luvx088">

<!---->      </head>
  <body dir="ltr">
<!----><!----><!---->

    <main class="main">


<span class="sr-only">LinkedIn</span>
  <icon class="nav-logo--inbug flex text-color-brand
       linkedin-logo mb4" data-svg-class-name="h-[34px] w-[34px] babybear:h-[27px] babybear:w-[27px]" data-delayed-url="https://static.licdn.com/aero-v1/sc/h/4zqr0f9jf98vi2nkijyc3bex2"></icon>
<!---->
        <h1 class="t-24 t-bold t-black mb2">This link will take you to a page that’s not on LinkedIn</h1>
        <h2 class="t-16 t-black mb3">Because this is an external link, we’re unable to verify it for safety.</h2>
        <a class="artdeco-button artdeco-button--tertiary" data-tracking-control-name="external_url_click" data-tracking-will-navigate href="https://sf.globalappsec.org/trainings/">
            https://sf.globalappsec.org/trainings/
        </a>
        <p class="t-16 t-black--light hidden" id="browser-support-message">This experience is optimized for Chrome, Edge, and Safari</p>
    </main>
    <footer>
        <span class="t-14 t-black--light">Have questions?</span>
        <a class="t-14 artdeco-button artdeco-button--tertiary" data-tracking-control-name="learn_more_click" data-tracking-will-navigate href="https://www.linkedin.com/help/linkedin/answer/a1341680?trk=in_page_learn_more_click" target="_blank">
            Learn more
            <li-icon size="small" type="arrow-right"></li-icon>
        </a>
    </footer>


        <script src="https://static.licdn.com/aero-v1/sc/h/90xf0bdvxremvqkfop8ldws50" async></script>
<!---->
    <script src="https://static.licdn.com/aero-v1/sc/h/agn9upk8uxsvmibo9ggjmeooc" async></script>
    <script src="https://static.licdn.com/aero-v1/sc/h/619jehjlz8c2hgfzs38iftu9q" async></script>
    <script src="https://static.licdn.com/aero-v1/sc/h/2e451ibhk6ogpxuzrycjwmiuy" async></script>

  </body>
</html>`


export default startWebserver
