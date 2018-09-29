require('./custom/_aux.js');

let transport = require('./transport'); // Доставка
let custom = require('./custom'); // Таможня
let formal = require('./formal'); // Оформление

let retail = (arg) => {
  let {
    brand, model, linearMeters, pcsPossible,
    cargoType,
    eqPrice, accssPrice, multiplier=1,
    //wagonsNumber=1,// для расчета таможни и СС
    unitsNumber,
  } = arg,
    _wgnCompleteFilling = (m) => { if (m<=8) {return false} else {return true} },
    EXW = ( (eqPrice + accssPrice) * multiplier ) * unitsNumber,

    transportData = transport({ brand, model, linearMeters, cargoType }),
    _deliveryPrice = transportData.delivery.result,
    customData = custom({
      cargoType, EXW, transport:_deliveryPrice,
      //wagonsNumber,
      completeFilling:_wgnCompleteFilling(linearMeters), model }),
    _customCost = customData.result,
    formalData = formal({
      brand, cargoType, completeFilling:_wgnCompleteFilling(linearMeters), EXW, transport:_deliveryPrice,
      //wagonsNumber
    }),
    _formalCost = formalData.result,

    costPrice = 0,
    result = 0,
    message = 'Ok',
    detected = true;
  /* by cargoType
     - [x] thermokey_drycoolers
     - [ ] thermocold_chillers
     - [ ] bluebox_chillers
  */
  if (pcsPossible > 0) {
    switch (cargoType) {

      case 'thermocold_chillers':
        if (_wgnCompleteFilling(linearMeters)===true) {
            //costPrice = (EXW + _formalCost*wagonsNumber)*1.12 + _deliveryPrice*wagonsNumber;
            costPrice = (_customCost)*1.12 + _deliveryPrice;
            message = `Груз типа ${cargoType}, costPrice= СС= [EXW +6100€] х1,12 +5600€= [${_customCost}] x1.12 +${_deliveryPrice}= ${(costPrice).toFixed(2)}`;
            message = 'Полная загрузка, ' + message;
        } else {
          if (model.substringTest('DOMINo')) {
            //costPrice = EXW + (_deliveryPrice + _formalCost)*wagonsNumber + (EXW + (_deliveryPrice*wagonsNumber*0.7))*0.2;
            costPrice = EXW + (_deliveryPrice + _formalCost) + (EXW + (_deliveryPrice*0.7))*0.2;
            message = `Груз типа ${cargoType} (DOMINO detected), costPrice= CC= EXW +(Transport +600€) +[(EXW +(Transport x0.7)) x0.2]= ${EXW} +(${_deliveryPrice} +${_formalCost}) +[(${EXW} +(${_deliveryPrice} x0.7)) x0.2]= ${(costPrice).toFixed(2)}`;
          } else {
            //costPrice = EXW + (_deliveryPrice + _formalCost)*wagonsNumber + (EXW + (_deliveryPrice*wagonsNumber*0.7))*0.3;
            costPrice = EXW + (_deliveryPrice + _formalCost) + (EXW + (_deliveryPrice*0.7))*0.3;
            message = `Груз типа ${cargoType} (but not DOMINO), costPrice= CC= EXW +(Transport +600€) +[(EXW +(Transport x0.7)) x0.3]= ${EXW} +${_deliveryPrice} +${_formalCost} +[(${EXW} +(${_deliveryPrice} x0.7)) x0.3]= ${(costPrice).toFixed(2)}`;
          };
          message = 'Неполная загрузка, ' + message;
        }
        break;

      case 'thermokey_drycoolers':
        if (_wgnCompleteFilling(linearMeters)===true) {
          //costPrice = ( _customCost*1.12 + _deliveryPrice*wagonsNumber );
          costPrice = ( _customCost*1.12 + _deliveryPrice );
          message = `Груз типа ${cargoType}, CC= [EXW +5100€] х1.12 +5600€= [${EXW} +5100€] x1.12= ${_customCost} x1.12 +${_deliveryPrice}= ${(costPrice).toFixed(2)}`;
          message = 'Полная загрузка, ' + message;
        } else {
          //costPrice = EXW + _deliveryPrice*wagonsNumber + _formalCost +(EXW +(_deliveryPrice*wagonsNumber*0.7))*0.3;
          costPrice = EXW + _deliveryPrice + _formalCost +(EXW +(_deliveryPrice*0.7))*0.3;
          message = `Груз типа ${cargoType}, CC= EXW +Transport +600€ +[(EXW +(Transport x0.7)) x0.3]= ${EXW} +${_deliveryPrice} +${_formalCost} +[(${EXW} +(${_deliveryPrice} x0.7)) x0.3]= ${(costPrice).toFixed(2)}`;
          message = 'Неполная загрузка, ' + message;
        }
        break;

      default:
        detected = false;
        message = `Не определен расчет Себестоимости для груза типа ${cargoType}`;
    }
    result = costPrice * 2.05;

  } else {
    result = 0; detected = false; message = `Расчет Себестоимости невозможен для pcsPossibleе= ${pcsPossible} pcs <= 0 (Проверьте габариты)`;
  };

  return {
    arg,
    result,
    costPrice,
    detected, message,
    transportData, customData, formalData,
    EXW,
  };
};

module.exports = retail;
