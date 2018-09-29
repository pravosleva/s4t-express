var express = require('express');
var router = express.Router();

/* GET for old version of site. */
router.get('/', function(req, res, next) {
  //res.send('Sorry, this router not completed yet. Old version will be here... But later.');
  res.render(
    'sorry',
    {
      title: 'Aborted',
      msg: 'This router not completed yet. Old version will be here... But later.',
      footerTxt: '@pravosleva86',
      footerLink: 'https://twitter.com/pravosleva86?lang=en'
    }
  );
});

module.exports = router;
