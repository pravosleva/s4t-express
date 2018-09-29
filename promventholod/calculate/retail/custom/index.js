require('./_aux.js');

// ТАМОЖНЯ

let custom = (arg) => {
  /* @cargoType
    - [x] thermokey_drycoolers
    - [x] thermocold_chillers
    - [ ] bluebox_chillers
  */
  let {
    cargoType,
    EXW=0, transport=0,
    //wagonsNumber=1,
    completeFilling,// bool
    model='all',
  } = arg,

    result = 0,
    message = 'Ok',
    detected = true;

  switch (cargoType) {

    case 'thermokey_drycoolers':
      switch (completeFilling) {
        case false:
          //result = (EXW + transport*wagonsNumber*0.7)*0.3; detected = true;
          result = (EXW + transport*0.7)*0.3; detected = true;
          message = `Custom= (EXW + transport x0.7) x0.3= (${EXW} +${transport} x0.7) x0.3`;
          message = 'Неполная загрузка, ' + message;
          break;
        default:
          //result = (EXW + 5100*wagonsNumber); detected = true;
          result = EXW + 5100; detected = true;
          message = `Таможня посчитана с учетом оформления, Custom+Formal= EXW +5100€= ${EXW} +5100€= ${(result).toFixed(2)}, [by default for cargoType= ${cargoType}, completeFilling= ${completeFilling}]`;
          message = 'Полная загрузка, ' + message;
      }
      break;

    case 'thermocold_chillers':
      switch (completeFilling) {
        case false:
          if ( model.substringTest('DOMINo')===true ) {
            //result = ( EXW + transport*wagonsNumber*0.7 )*0.2;
            result = ( EXW + transport*0.7 )*0.2;
            message = `${cargoType} (DOMINO detected), Custom= (EXW +Transport xWgnsNumber x0.7) x0.2= (${EXW} +${transport} x0.7) x0.2= ${(result).toFixed(2)}`;
          } else {
            //result = ( EXW + transport*wagonsNumber*0.7 )*0.3;
            result = ( EXW + transport*0.7 )*0.3;
            message = `${cargoType} (but not DOMINO), Custom= (EXW +Transport x0.7) x0.3= (${EXW} +${transport} x0.7) x0.3= ${(result).toFixed(2)}`;
          }
          message = 'Неполная загрузка, ' + message;
          break;
        default:
          result = EXW + 6100; message = `Таможня посчитана с учетом оформления, Custom+Formal= EXW +6100€= ${EXW} +6100€= ${(result).toFixed(2)}`;
          message = 'Полная загрузка, ' + message;
      }
      break;

    //...

    default: message = `При расчете таможни не определено действие для груза типа ${cargoType}`; detected = false;
  }

  return { result, message, detected };
};

module.exports = custom;
