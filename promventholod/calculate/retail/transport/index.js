let Route = require('./Route');

// ДОСТАВКА

function _getDeliveryPrice(arg){
  let { routeName, linearMeters, cargoType } = arg,
    /*
      @cargoType
        - thermokey_drycoolers
    */
    detected = true,
    result;
  switch(routeName){

  case "I-33061 Rivarotta - Riga":
    /* NORT ITALY
      - thermokey
      - bluebox

    */
    message = 'Ok';
    /* inComplete */
    if (linearMeters > 0 && linearMeters <= 1) {
      result = 845; currency = 'EUR'; detected = true;
    } else if (linearMeters > 1 && linearMeters <= 2) {
      result = 1235; currency = 'EUR'; detected = true;
    } else if (linearMeters > 2 && linearMeters <= 3) {
      result = 1655; currency = 'EUR'; detected = true;
    } else if (linearMeters > 3 && linearMeters <= 4) {
      result = 2025; currency = 'EUR'; detected = true;
    } else if (linearMeters > 4 && linearMeters <= 5) {
      result = 2635; currency = 'EUR'; detected = true;
    } else if (linearMeters > 5 && linearMeters <= 6) {
      result = 3035; currency = 'EUR'; detected = true;
    } else {
      /* complete (by cargoType)
        - [x] thermokey_drycoolers
        - [x] bluebox_chillers
      */
      switch (cargoType) {
        case 'thermokey_drycoolers':
        case 'bluebox_chillers':
          result = 5600; currency = 'EUR';
          break;
        default:
          result = 0;
          currency = 'EUR';
          message = 'При расчете транспорта: Имя маршрута определено, тип груза - нет!';
          detected = false;
      }
    }
    break;

  case "I-70026 Modugno Bari - Riga":
    /* SOUTH ITALY
      - thermocold (only)
    */
    message = 'Ok';
    if (linearMeters > 0 && linearMeters <= 1) {
      result = 1045; currency = "EUR"; detected = true;
    } else if (linearMeters > 1 && linearMeters <= 2) {
      result = 1415; currency = "EUR"; detected = true;
    } else if (linearMeters > 2 && linearMeters <= 3) {
      result = 2045; currency = "EUR"; detected = true;
    } else if (linearMeters > 3 && linearMeters <= 4) {
      result = 2645; currency = "EUR"; detected = true;
    } else if (linearMeters > 4 && linearMeters <= 5) {
      result = 3225; currency = "EUR"; detected = true;
    } else if (linearMeters > 5 && linearMeters <= 6) {
      result = 3855; currency = "EUR"; detected = true;
    } else {
      /* complete (by cargoType)
        - [x] thermocold_chillers
      */
      switch (cargoType) {

        case 'thermocold_chillers':
          result = 5600; currency = 'EUR';
          break;

        default://never for this RouteName
          result = 0;
          currency = 'EUR';
          message = 'При расчете транспорта имя маршрута определено, тип груза - нет!';
          detected = false;
      }
    }
    break;

  default:
    result = 0;
    message = `При расчете транспорта не удалось расчитать стоимость доставки для маршрута ${routeName} для груза типа ${cargoType}`;
    detected = false;
  }
  return { result, currency, message, detected }
};

let transport = (arg) => {
  let {
    brand, model, linearMeters, cargoType,
  } = arg,
    route = new Route({ brand, model }),
    routeData = route.getRouteData(),
    routeName = routeData.routeName,
    delivery = _getDeliveryPrice({ routeName, linearMeters, cargoType });

  return { routeData, delivery };
};

module.exports = transport;
