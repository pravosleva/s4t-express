var express = require('express');
var router = express.Router();
var getHeatingCalc = require('./getHeatingCalc');


router.get('/getHeatingCalc', function(req, res, next) {
  switch(req.method){
    // case 'OPTIONS':
    case 'GET':
      console.log(req.query);
      let result = getHeatingCalc(req.query);

      //...

      res.set('Content-Type', 'text/plain');
      res.send(`${result.tAirOut};${result.dPAir};${result.dPLiquid}`);
      // next() // If used then request not ended.
      break;
    default:
      console.log('FCKUP!', req.method);
      res.send('ERROR;Bad request');
      break;
  }
});

module.exports = router;
