class Route {
  constructor(arg){
    let {
      brand, model,
    } = arg;
    this.brand = brand;
    this.model = model;
    //this.linearMeters = linearMeters;
  }
  getRouteData(){
    let routeName = 'Not found',
      detected = false,
      message = 'Ok';
    switch(this.brand){
      case "bluebox": routeName = "I-33061 Rivarotta - Riga"; detected = true; break;
      case "thermocold": routeName = "I-70026 Modugno Bari - Riga"; detected = true; break;
      case "thermokey": routeName = "I-33061 Rivarotta - Riga"; detected = true; break;
      default: message = `Не могу определить имя маршрута внутри getRouteData () для бренда ${this.brand}`; break;
    };
    return { routeName, detected, message }
  }
}

module.exports = Route;
