let express = require('express'),
  path = require('path'),
  favicon = require('serve-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser');
let index = require('./routes/index'),
  oldSite = require('./routes/oldSite'),
  projects = require('./routes/projects'),
  osnotek = require('./routes/osnotek');
let app = express();
let url = require('url');
let Cargo = require('./promventholod/calculate');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/oldSite*', oldSite);
/*
app.use('/projects/the-fool-game', function(req, res, next){
  //console.log(req.socket);
  next();
});
*/
app.use('/projects', projects);
app.use('/osnotek', osnotek);
app.get('/calculate', function(req, res){
  /*
    http://selection4test.ru/calculate?brand=a&model=b&length=1000&width=1000&height=1000&weight=100
  */
  res.header('Access-Control-Allow-Origin', '*');
  res.set({ 'Content-Type': 'json/application', 'Cache-Control': 'no-cache' });

  let urlParsed = url.parse(req.url, true),
		query = urlParsed.query,
    {
      brand, model,
      length, width, height, weight,
      maxInWagon=13, addSize=50, maxRowsInWagon_byWagonWidth=1, maxRowsInWagon_byWagonLength=100, maxFloorsInWagon=1,
      wagonLength=13600, wagonWidth=2450, wagonHeight=3000, wagonCarryingCapacity=20000,
      multiplier=1, eqPrice=0, accssPrice=0,
      cargoType,
    } = query;
  length = Number(length);
  width = Number(width);
  height = Number(height);
  weight = Number(weight);
  eqPrice = Number(eqPrice);
  accssPrice = Number(accssPrice);
  cargoType = String(cargoType);
  let cargo = new Cargo({
    brand, model,
    length, width, height, weight,
    maxInWagon, addSize, maxRowsInWagon_byWagonWidth, maxRowsInWagon_byWagonLength, maxFloorsInWagon,
    wagonLength, wagonWidth, wagonHeight, wagonCarryingCapacity,
    multiplier, eqPrice, accssPrice,
    cargoType,
  });
  let result = cargo.getContainerData();
  res.status(200).send({ query, result });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.title = 'Error';
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.footerTxt = '@pravosleva86';
  res.locals.footerLink = 'https://twitter.com/pravosleva86?lang=en';

  /*
  footerTxt: '@pravosleva86',
  footerLink: 'https://twitter.com/pravosleva86?lang=en'
  */

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
