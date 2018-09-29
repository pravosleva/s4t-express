console.log(`_aux.js inclided`);

Array.prototype.getUniquePropValues = function (propName) {
  //console.log(this);
  var o = {}, a = [], i, e;
  for (let i = 0; i<this.length; i++) {
    //console.log(i, this[i][propName], this[i]);
    o[this[i][propName]] = 1
  };
  for (e in o) {
    a.push( e );
  };
  return a;
}

String.prototype.substringTest = function (substr) {
  //let { substr, str } = arg;
  //str = String(str).toLowerCase();
	substr = String(substr).toLowerCase();
	//return (str.indexOf (substr) !== -1);
  return ((this).toLowerCase().indexOf (substr) !== -1);
}
