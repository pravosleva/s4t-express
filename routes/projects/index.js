var express = require('express');
var router = express.Router();

// var Gallery = require('express-photo-gallery');
// var opts = { title: 'My Awesome Photo Gallery' };

/* GET for projects. */

router.get('/auxiliary-calc', function(req, res, next) {
  res.render(
    'projs/auxiliary-calc',
    { title: 'Auxiliary HVAC tool | Liquid' }
  );
});

router.get('/cargo-react', function(req, res, next) {
  res.render(
    'projs/cargo-react',
    { title: 'Cargo' }
  );
});


router.get('/thermocold-heva-fc-test', function(req, res, next) {
  res.render(
    //'projs/thermocold-heva-fc-test',
    //{ title: 'HEVA FC test' }
    'projs/thermocold-lines',
    { title: 'Thermocold Lines' }
  );
});
/* Need to send image
router.get('/projects/:image', function(req, res, next) {
  app.get('/imgs/:path_to_image', function (req, res) {
    res.sendFile('./imgs/');
  });
});
*/
router.get('/get-offer-react-gallery', function(req, res, next) {
  res.render(
    'projs/get-offer-react-gallery',
    { title: 'Get Offer' }
  );
});

/*
router.get('/t', function(req, res, next){
  //console.log(__dirname);
  res.sendFile('../public/images/get-offer-all-screens/screen-1.jpg');
});
//views\projs\imgs\get-offer-all-screens
//router.get('/photos', Gallery('../views/projs/imgs/get-offer-all-screens', opts));//routs -is current dir
*/

router.use('/cargo-3d/retail', function(req, res, next){

  switch(req.method){
    case 'OPTIONS':
    case 'POST':
      console.log(req);
      let costPrice = require('./calc-cost-price-2018');
      //console.log(typeof costPrice);
      let dostavka = decodeURIComponent( Number(req.query.dostavka) ),
        containerGroupList = req.body.containerGroupList;
      console.log(containerGroupList);
      //...

      res.set('Content-Type', 'application/json');
      res.send({ 'containerGroupList': containerGroupList });
      //next() - not used - so req ended.
      break;
    default:
      next();
      break;
  }
});
router.get('/cargo-3d', function(req, res, next) {
  //console.log(req.query.x);
  res.render(
    'projs/cargo-3d',
    {
      title: 'Cargo 3D',
      wagonLength: decodeURIComponent( Number(req.query.wagonLength) ),
      wagonWidth: decodeURIComponent( Number(req.query.wagonWidth) ),
      wagonHeight: decodeURIComponent( Number(req.query.wagonHeight) ),
      wagonCarryingCapacity: decodeURIComponent( Number(req.query.wagonCarryingCapacity) ),
      cargoLength: decodeURIComponent( Number(req.query.cargoLength) ),
      cargoWidth: decodeURIComponent( Number(req.query.cargoWidth) ),
      cargoHeight: decodeURIComponent( Number(req.query.cargoHeight) ),
      cargoWeight: decodeURIComponent( Number(req.query.cargoWeight) ),
      addSize: decodeURIComponent( Number(req.query.addSize) ),
      maxInWagon: decodeURIComponent( Number(req.query.maxInWagon) ),
      maxRowsInWagon_byWagonWidth: decodeURIComponent( Number(req.query.maxRowsInWagon_byWagonWidth) ),
      maxRowsInWagon_byWagonLength: decodeURIComponent( Number(req.query.maxRowsInWagon_byWagonLength) ),
      maxFloorsInWagon: decodeURIComponent( Number(req.query.maxFloorsInWagon) ),
      cargoType: decodeURIComponent( String(req.query.cargoType) ),
      containerType: decodeURIComponent( String(req.query.containerType) ),
      modelName: decodeURIComponent( String(req.query.modelName) ),
    }
  );
});
router.get('/cargo-3d-2021', function(req, res, next) {
  res.render(
    'projs/cargo-3d-2021',
    {
      productList: req.query.productList,
      title: 'Cargo 3D',
      wagonLength: decodeURIComponent( Number(req.query.wagonLength) ),
      wagonWidth: decodeURIComponent( Number(req.query.wagonWidth) ),
      wagonHeight: decodeURIComponent( Number(req.query.wagonHeight) ),
      wagonCarryingCapacity: decodeURIComponent( Number(req.query.wagonCarryingCapacity) ),
      cargoLength: decodeURIComponent( Number(req.query.cargoLength) ),
      cargoWidth: decodeURIComponent( Number(req.query.cargoWidth) ),
      cargoHeight: decodeURIComponent( Number(req.query.cargoHeight) ),
      cargoWeight: decodeURIComponent( Number(req.query.cargoWeight) ),
      addSize: decodeURIComponent( Number(req.query.addSize) ),
      maxInWagon: decodeURIComponent( Number(req.query.maxInWagon) ),
      maxRowsInWagon_byWagonWidth: decodeURIComponent( Number(req.query.maxRowsInWagon_byWagonWidth) ),
      maxRowsInWagon_byWagonLength: decodeURIComponent( Number(req.query.maxRowsInWagon_byWagonLength) ),
      maxFloorsInWagon: decodeURIComponent( Number(req.query.maxFloorsInWagon) ),
      cargoType: decodeURIComponent( String(req.query.cargoType) ),
      containerType: decodeURIComponent( String(req.query.containerType) ),
      modelName: decodeURIComponent( String(req.query.modelName) ),
    }
  );
});

router.get('/_preview-1-hello-world', function(req, res, next) {
  res.render( 'projs/_preview/_preview-1-hello-world', { title: 'Preview' } );
});

router.get('/the-fool-game', function(req, res, next) {
  res.render( 'projs/the-fool-game-test-1', { title: 'The Fool test-1' } );
});

router.get('/english-tenses', function(req, res, next) {
  res.render(
    'projs/english-tenses',
    {
      title: 'English Tenses',
      footerTxt: '@pravosleva86',
      footerLink: 'https://twitter.com/pravosleva86?lang=en'
    }
  );
});

router.get('/test', function(req, res, next){
  res.render(
    'projs/test',
    {}
  );
});

router.get('/jet-test', function(req, res, next) {
  res.render(
    'projs/jet-test',
    { title: 'Jets' }
  );
});
router.get('/jet-test-original', function(req, res, next) {
  res.render(
    'projs/jet-test-original',
    { title: 'Jets' }
  );
});

router.get('/sezon-lines', function(req, res, next) {
  res.render(
    'projs/sezon-lines',
    { title: 'Sezon Lines' }
  );
});

router.get('/thermocold-lines', function(req, res, next) {
  res.render(
    'projs/thermocold-lines',
    { title: 'Thermocold Lines' }
  );
});
router.use('/getPrice', function(req, res, next){
  switch(req.method){
    case 'GET':
      //console.log(req);
      let thermocoldPrice = require('./thermocold-price');
      //console.log(containerGroupList);
      //let _ = decodeURIComponent( Number(req.query.q) ),
      //  __ = req.body.containerGroupList;
      let options = thermocoldPrice().options,
        specification = thermocoldPrice().specification,
        priceVersion = thermocoldPrice().priceVersion;
      res.header('Access-Control-Allow-Origin', '*');
      res.set('Content-Type', 'application/json');
      //switch(req.query.q){}
      res.send({ options, specification, priceVersion });

      //next() - not used - so req ended.
      break;
    default:
      next();
      break;
  }
});
router.use('/promventholod-iframes-for-projector-z', function(req, res, next){
  switch (req.method) {
    case 'GET':
      res.header('Access-Control-Allow-Origin', '*');
      res.set('Content-Type', 'application/json');
      //switch(req.query.q){}
      res.send([
        { src: 'http://selection4test.ru/projects/thermocold-lines', btnText: 'HEVA FC' },
      ]);
      break;
    default:
      next();
  }
});
router.get('/th-pres', function(req, res, next) {
  res.render(
    'projs/thermocold-presentation',
    { title: 'Presentation' }
  );
});

router.get('/midea-lines', function(req, res, next) {
  res.render(
    'projs/midea-modular',
    { title: 'Midea Lines' }
  );
});

router.get('/total-work-time-analysis', function(req, res, next) {
  res.render(
    'projs/total-work-time-analysis',
    { title: 'Total Work Time Analysis' }
  );
});

router.get('/react-maps-lab', function(req, res, next) {
  res.render(
    'projs/react-maps-lab',
    { title: 'React Maps Lab' }
  );
});

router.get('/cpu', function(req, res, next) {
  res.render(
    'projs/cpu',
    { title: 'CPU' }
  );
});
router.get('/threejs-ts-course', function(req, res, next) {
  res.render(
    'projs/threejs-ts-course',
    { title: 'Three.js TypeScript tutorial' }
  );
});

router.get('/*', function(req, res, next) {
  res.render(
    'sorry',
    {
      title: 'Aborted',
      msg: 'This router is under construction yet. You can see old projects here... But later.',
      footerTxt: '@pravosleva86',
      footerLink: 'https://twitter.com/pravosleva86?lang=en'
    }
  );
});

module.exports = router;
