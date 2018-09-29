// ОФОРМЛЕНИЕ

let formal = (arg) => {
  let {
    brand, cargoType, completeFilling=false, EXW=0, transport=0,
    //wagonsNumber=1,
  } = arg,
    message = `Ok [EXW= ${EXW.toFixed(2)}]`,
    detected = false;
  /*
    @brand
      - thermocold
      - thermokey
      - bluebox
  */
  //let routeData = getRouteData({ brand, model, linearMeters });

  switch (cargoType) {
    /*
      - [x] thermocold_chillers
      - [x] thermokey_drycoolers
      - [x] bluebox_chillers
    */

    case 'thermokey_drycoolers':
    case 'bluebox_chillers':
      switch (completeFilling){
        case false: result = 600; detected = true; break;
        case true: result = 0; detected = true; message = 'Оформление уже было включено в стоимость Таможни'; break;
      }
      break;

    case 'thermocold_chillers':
      switch (completeFilling){
        case false:
          if ( brand.substringTest('DOMINo') ) {
            //result = ( EXW + transport*wagonsNumber*0.7 )*0.2;
            //result = ( EXW + transport*0.7 )*0.2;
            result = 600;
            //message = `${cargoType} (DOMINO detected), formalCost= (EXW + transport x0.7) x0.2= (${EXW} + ${transport} x0.7) x0.2`;
            message = `${cargoType} (DOMINO detected), formalCost= 600`;
          } else {
            //result = ( EXW + transport*wagonsNumber*0.7 )*0.3;
            //result = ( EXW + transport*0.7 )*0.3;
            result = 600;
            message = `${cargoType} (but not DOMINO), formalCost= 600`;
            //message = `${cargoType} (but not DOMINO), formalCost= (EXW + transport x0.7) x0.2= (${EXW} + ${transport} x0.7) x0.2`;
          }
          break;
        case true:
          result = 0; detected = true; message = 'Оформление уже было включено в стоимость Таможни';
          break;
      }
      break;

    default: message = `При расчете Оформления не определено действие для груза типа ${cargoType}`;
  }

  return { result, message };
};

module.exports = formal;
