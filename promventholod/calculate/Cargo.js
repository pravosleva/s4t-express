let retail = require('./retail');

class Gargo {
  constructor(arg){
    let {
      brand, model,
      length, width, height, weight,
      maxInWagon=13, addSize=50, maxRowsInWagon_byWagonWidth=1, maxRowsInWagon_byWagonLength=100, maxFloorsInWagon=1,
      wagonLength=13600, wagonWidth=2400, wagonHeight=3000, wagonCarryingCapacity=20000,

      multiplier=1, eqPrice=0, accssPrice=0,

      cargoType,
    } = arg;
    this.accssPrice = accssPrice;
    this.addSize = addSize;
    this.brand = brand;
    this.eqPrice = eqPrice;
    this.height = height;
    this.length = length;
    this.maxInWagon = maxInWagon;
    this.maxFloorsInWagon = maxFloorsInWagon;
    this.maxRowsInWagon_byWagonLength = maxRowsInWagon_byWagonLength;
    this.maxRowsInWagon_byWagonWidth = maxRowsInWagon_byWagonWidth;
    this.model = model;
    this.multiplier = multiplier;
    this.weight = weight;
    this.wagonLength = wagonLength;
    this.wagonWidth = wagonWidth;
    this.wagonHeight = wagonHeight;
    this.wagonCarryingCapacity = wagonCarryingCapacity;
    this.width = width;

    this.cargoType = cargoType;
  }
  get(field){ return this[field] }
  set(field, value){ this[field] = value }
  getEXW(){ return Number(((this.eqPrice + this.accssPrice)*this.multiplier).toFixed(2)) }
  getContainerData(){
    console.log('getContainerData () CALLED');
    let {
      brand, model,
      length, width, height, weight,
      maxInWagon, addSize, maxRowsInWagon_byWagonWidth, maxRowsInWagon_byWagonLength, maxFloorsInWagon,
      wagonLength, wagonWidth, wagonHeight, wagonCarryingCapacity,
      multiplier, eqPrice, accssPrice,
      cargoType,
    } = this;
    let cargoConfig = this.getCargoConfig();
    let linearMeters = Number(((cargoConfig.sizes.fullX)*0.001).toFixed(3));
    let pcsPossible = cargoConfig.sizes.pcsPossible;
    let EXW = this.getEXW();
    return {
      retail: retail({
        brand, model, linearMeters, EXW, pcsPossible, cargoType, eqPrice, accssPrice, multiplier,
        wagonsNumber: 1, // Should be received by Front-end
        unitsNumber: pcsPossible,
      }),
      cargoConfig
    };
  }
  getCargoConfig(){
    let maxLength = this.wagonLength,
      maxWidth = this.wagonWidth,
      maxHeight = this.wagonHeight,
      maxWeight = this.wagonCarryingCapacity;
    return this._inWagon({
      length: this.length,
      width: this.width,
      height: this.height,
      weight: this.weight,
      maxInWagon: this.maxInWagon,
      addSize: this.addSize,
      maxRowsInWagon_byWagonWidth: this.maxRowsInWagon_byWagonWidth,
      maxRowsInWagon_byWagonLength: this.maxRowsInWagon_byWagonLength,
      maxFloorsInWagon: this.maxFloorsInWagon,
      wagon: {
        maxLength: Number(maxLength),
        maxWidth: Number(maxWidth),
        maxHeight: Number(maxHeight),
        maxWeight: Number(maxWeight)
      }
    });
    // result example
    /*
    {
      "result": 11,
      "comment": "Additional horizontal size is 200 mm\nDims for each unit [ in Blue + additional size ] is 1200 x 1200 x 1000 mm",
      "horizontalOrientation": "byLength",
      "wagon": {
        "maxLength": 13600,
        "maxWidth": 2400,
        "maxHeight": 3000,
        "maxWeight": 20000
      },
      "config": {
        "byLength1": 11,
        "byWidth1": 1,
        "result1": 11,
        "byLength2": 11,
        "byWidth2": 1,
        "result2": 11,
        "pcsX": 11,
        "pcsY": 1,
        "pcsZ": 1
      },
      "sizes": {
        "pcsPossible": 11,
        "pcsXPossible": 11,
        "pcsYPossible": 1,
        "pcsZPossible": 1,
        "fullX": 13200,
        "fullY": 1200,
        "fullZ": 1000,
        "comment": "Total units number is 11 pcs\nBlue= 11 pcs\nBlueZ= 1 pcs\nBlueY= 1 pcs\nBlueX= 11 pcs\nFull X size= 13200 mm\nFull Y size= 1200 mm\nFull Z size= 1000 mm"
      }
    }
    */
  }
  _inWagon(arg){
    //console.log(arg);
    let length = Number(arg.length),
      width = Number(arg.width),
      height = Number(arg.height),
      weight = Number(arg.weight),
      maxInWagon = Number(arg.maxInWagon),
      addSize = Number(arg.addSize),
      maxRowsInWagon_byWagonWidth = Number(arg.maxRowsInWagon_byWagonWidth),
      maxRowsInWagon_byWagonLength = Number(arg.maxRowsInWagon_byWagonLength),
      maxFloorsInWagon = Number(arg.maxFloorsInWagon),
      wagon = arg.wagon;

    var l, w, floors, result, config={}, horizontalOrientation = '';
    if(length < width){
      l = width + addSize;
      w = length + addSize;
    }else{
      w = width + addSize;
      l = length + addSize;
    };
    var result = 0,
      comment = `Additional horizontal size is ${addSize} mm
Dims for each unit [ in Blue + additional size ] is ${l} x ${w} x ${height} mm`;
    if(w > wagon.maxWidth){
      result = 0;
      comment += " / Наименьший гор. размер 1 единицы с учетом запаса превышает макс. ширину контейнера " + w + " > " + wagon.maxWidth + " mm!"
    }else if(l > wagon.maxLength){
      result = 0;
      comment += " / Наибольший гор. размер 1 единицы с учетом запаса превышает макс. длину контейнера " + l + " > " + wagon.maxLength + " mm!"
    }else if(height > wagon.maxHeight){
      result = 0;
      comment += " / Вертикальный размер 1 единицы превышает макс. высоту контейнера " + height + " > " + wagon.maxHeight + " mm!"
    }else if(weight > wagon.maxWeight){
      result = 0;
      comment += " / Масса 1 единицы превышает грузоподъемность контейнера " + weight + " > " + wagon.maxWeight + " kg!";
    }else{
      // расчетное количество ярусов в машине (в соответствии с разрешенным maxFloorsInWagon для данного бренда)
      floors = 1;
      for(var i=1; i<=maxFloorsInWagon; i++){ if(wagon.maxHeight >= (height * i)){floors = i} };

      // v2
      config.byLength1 = Math.floor(wagon.maxLength / (length + addSize));
      if(config.byLength1 > maxRowsInWagon_byWagonLength){config.byLength1 = maxRowsInWagon_byWagonLength};
      config.byWidth1 = Math.floor(wagon.maxWidth / (width + addSize));
      if(config.byWidth1 > maxRowsInWagon_byWagonWidth){config.byWidth1 = maxRowsInWagon_byWagonWidth};
      config.result1 = config.byLength1 * config.byWidth1;
      config.byLength2 = Math.floor(wagon.maxLength / (width + addSize));
      if(config.byLength2 > maxRowsInWagon_byWagonLength){config.byLength2 = maxRowsInWagon_byWagonLength};
      config.byWidth2 = Math.floor(wagon.maxWidth / (length + addSize));
      if(config.byWidth2 > maxRowsInWagon_byWagonWidth){config.byWidth2 = maxRowsInWagon_byWagonWidth};
      config.result2 = config.byLength2 * config.byWidth2;

      //result = Math.max(config.result1, config.result2);
      //if(result === config.result1){horizontalOrientation = "byLength"}else{horizontalOrientation = "byWidth"}
      if(config.result1 >= config.result2){
        result = config.result1;
        horizontalOrientation = "byLength";
        // for the 3D model:
        config.pcsX = config.byLength1;
        config.pcsY = config.byWidth1;
        config.pcsZ = floors;
      }else if(config.result1 < config.result2){
        result = config.result2;
        horizontalOrientation = "byWidth";
        // for the 3D model:
        config.pcsX = config.byLength2;
        config.pcsY = config.byWidth2;
        config.pcsZ = floors;
      }else{
        comment += " / Не удалось определить расположение груза относительно контейнера!";
      }

      //result = result * rows;
      if(result > maxRowsInWagon_byWagonLength * maxRowsInWagon_byWagonWidth){result = maxRowsInWagon_byWagonLength * maxRowsInWagon_byWagonWidth};
      if(result * floors > maxInWagon){
        result = maxInWagon
      }else{
        result = result * floors;
      }
    };//console.log(result);

    // Full length:
    let sizes = {};
    // 2) Height is firstly:
    var _pcs = 0, // количество отображаемых кубиков
      _pcsBlue = 0, _pcsXBlue = 0, _pcsYBlue = 0, _pcsZBlue = 0; // кол-во синих по X Y Z

    // --- Should be refactored!
    //if(result===1){
    //	_pcs = _pcsBlue = _pcsXBlue = _pcsYBlue = _pcsZBlue = 1;
    //}else{
      _pcs = 0;
      _pcsXBlue = _pcsYBlue = _pcsZBlue = 0;
      for (let j = 0; j < config.pcsX; j++){ // For each by X
        for (let k = 0; k < config.pcsZ; k++){ // For each by Z
          for (let i = 0; i < config.pcsY; i++) { // For each by Y
            _pcs += 1;
            if (_pcs <= result) {// If Blue
              _pcsBlue += 1;

              if (_pcsXBlue < j) _pcsXBlue = j;
              if (_pcsYBlue < i) _pcsYBlue = i;
              if (_pcsZBlue < k) _pcsZBlue = k;

            }
          }
        }
      };
      _pcsXBlue += 1;
      _pcsYBlue += 1;
      _pcsZBlue += 1;
    //}
    // ---

    sizes.pcsPossible = _pcsBlue;
    sizes.pcsXPossible = _pcsXBlue;
    sizes.pcsYPossible = _pcsYBlue;
    sizes.pcsZPossible = _pcsZBlue;
    switch(horizontalOrientation){
      case "byWidth":
        sizes.fullX = _pcsXBlue * (width + addSize);
        sizes.fullY = _pcsYBlue * (length + addSize);
        break;
      case "byLength":
      default:
        sizes.fullX = _pcsXBlue * (length + addSize);
        sizes.fullY = _pcsYBlue * (width + addSize);
        break;
    }
    sizes.fullZ = _pcsZBlue * height;
    sizes.comment = `Total units number is ${_pcs} pcs
Blue= ${_pcsBlue} pcs
BlueZ= ${_pcsZBlue} pcs
BlueY= ${_pcsYBlue} pcs
BlueX= ${_pcsXBlue} pcs
Full X size= ${sizes.fullX} mm
Full Y size= ${sizes.fullY} mm
Full Z size= ${sizes.fullZ} mm`;

    // Cost calc for 1 m. is possible...
    //...

    return { result, comment, horizontalOrientation, wagon, config, sizes }
  }
};

module.exports = Gargo;
