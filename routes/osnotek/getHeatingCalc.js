const getHeatingCalc = (query) => {
  return {
    tAirOut: 0, // C
    dPAir: 100, // Pa
    dPLiquid: 250, // Pa
  };
};

module.exports = getHeatingCalc;
