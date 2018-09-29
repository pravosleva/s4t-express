let costPrice = function(arg){
  // Доставка

  let { dostavka, inWagon, cargoType, weight } = arg,
    result, comment;
  //var dostavka = Number(dostavka), inWagon = Number(inWagon);
  switch(cargoType){
    case "thermocold_chillers":
      result = (dostavka / inWagon).toFixed(2);
      comment = "Ok";
      break;
    case "luvata_evaporators":
      result = (dostavka / inWagon).toFixed(2);
      comment = "Ok: dostavka = " + dostavka + " inWagon = " + inWagon + " result = " + result;
      break;
    case "thermokey_dryCoolers":
      result = (dostavka / inWagon).toFixed(2);
      comment = "Ok";
      break;
    case "stefani_evaporators":
      result = (dostavka / inWagon).toFixed(2);
      comment = "Доставка = Input_dostavka/inWagon";
      break;
    case "Cooling Towers Open type Dry BAC":
      result = (dostavka / weight).toFixed(2);
      comment = "Доставка = Input_dostavka/weight";
      break;
    // etc.
    default:
      result = 0;
      comment = "cargoType is undefined"
  };
  return { result, comment }
};

module.exports = costPrice;
