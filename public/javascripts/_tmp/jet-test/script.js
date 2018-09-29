let _setCustomResult = (arg) => {
  let { msg, bgColor='#D1B37D', color='black' } = arg;
  document.getElementById('resultTable').innerHTML = '<strong>' + msg + '</strong>';
  document.getElementById('resultTable').style.background = bgColor;
  document.getElementById('resultTable').style.color = color;
};

function onCheckBoxChange (checkBox) {
  let callbackAsResolve = (jetsArr) => {
    console.table(jetsArr);
    document.getElementById('resultTable').innerHTML = _getTableHTML(jetsArr);
    document.getElementById('resultTable').style.background = '#69ADA4';//#748CB5
    document.getElementById('resultTable').style.color = 'white';
    document.getElementById('reportTime').innerHTML = new Date();
  },
  callbackAsReject = (err) => {
    //console.error(err);
    document.getElementById('resultTable').innerHTML = '<strong>Error: ' + (err || 'Trying to reconnect...') + '</strong>';
    document.getElementById('resultTable').style.background = '#ee5f5b';
    document.getElementById('resultTable').style.color = 'white';
  };
  if (checkBox.checked) {
    var switched_ON = true;
    _setCustomResult({ msg: 'Connection...' });
    var handlerForCheckBox = (event) => {
      if (!checkBox.checked) {
        switched_ON = false;
        _setCustomResult({ msg: 'Polling switched off...', bgColor: '#69ADA4', color: 'white' });
        checkBox.removeEventListener('change', handlerForCheckBox);
      } else { /* nothing */ }
    };
    checkBox.addEventListener ("change", handlerForCheckBox);
    startPollingByConditions ({
      url: 'http://selection4test.ru:1111/jetsArray',
      toBeOrNotToBe: () => switched_ON,
      interval: 3000,
      callbackAsResolve,
      callbackAsReject
    });
  } else { _setCustomResult({ msg: 'Polling switched off...', bgColor: '#69ADA4', color: 'white' }); };
}

function myAsyncRequest (url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.onload = () => resolve(JSON.parse(xhr.responseText));
    xhr.onerror = () => reject(xhr.statusText);
    xhr.send();
  });
}

function myTimeoutPromise (ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), ms);
  });
}

function startPollingByConditions (arg) {
  let { url, toBeOrNotToBe, interval, callbackAsResolve, callbackAsReject } = arg;
  console.log ("startPollingByConditions ()", url, toBeOrNotToBe(), interval);
  _setCustomResult({ msg: 'Loading...' });
  if (toBeOrNotToBe()) {
    myAsyncRequest (url)
      .then (
        function (result){
          console.log (`startPollingByConditions () is done.`);
          callbackAsResolve(result);
          return (myTimeoutPromise (interval));
        },
        function(){
          callbackAsReject(`startPollingByConditions () is failed: Trying to reconnect...`);
          return (myTimeoutPromise (interval));
        }
      )
      .then (function (){
        console.log (`startPollingByConditions () was called again...`);
        startPollingByConditions ({ url, toBeOrNotToBe, interval, callbackAsResolve, callbackAsReject });
      })
      .catch (function (err) {
        console.log (`startPollingByConditions () is failed! Nothing else.`);
        //callbackAsReject(`startPollingByConditions () is failed: Trying to reconnect...`);
        //startPollingByConditions ({ url, toBeOrNotToBe, interval, callbackAsResolve, callbackAsReject });
      });
  } else { _setCustomResult({ msg: 'Polling stopped.' }); }
}

// fn to detect the distance between two points
let getDistanceBetween2PointsOnSphere = (coordinatesObj1, coordinatesObj2, r=6371) => {
  let { lat: lat1, lon: lon1 } = coordinatesObj1,
    { lat: lat2, lon: lon2 } = coordinatesObj2,
    pi = Math.PI;
  // need to convert to radians:
  lat1 = lat1*pi/180;
  lat2 = lat2*pi/180;
  lon1 = lon1*pi/180;
  lon2 = lon2*pi/180;
  return (
    r * Math.acos( Math.sin(lat1)*Math.sin(lat2) + Math.cos(lat1)*Math.cos(lat2)*Math.cos(lon1-lon2) )
  );
}

function _getTableHTML(jetsArray) {
  // need to sort jets by distance
  let airportCoordinates = { lat: 55.410307, lon: 37.902451 };
  // each element of jets arr should have his current distance as prop which name will be distanceToAirport
  jetsArray.forEach(function callback(element, index, array) {
    // your iterator should be there
    element.distanceToAirport = getDistanceBetween2PointsOnSphere(airportCoordinates, { lat: element.coordinates.lat, lon: element.coordinates.lon });
  });
  // new variable is unnessesary
  jetsArray.sort((element1, element2) => {
    return element1.distanceToAirport - element2.distanceToAirport
  });
  // so, jets array was sorted by compare function which was received as argument...

  let html = '<table><thead>';
  html += "<tr><th>Flight Number</th><th>Coordinates</th><th>Distance to Airport</th></tr>";
  html += '</thead>';
  html += '<tbody>';

  for (jetNum in jetsArray) {
    html += "<tr>" +
      "<td>" + jetsArray[jetNum].flightNumber + "</td>" +
      "<td>" + jetsArray[jetNum].coordinates.lat + ", " + jetsArray[jetNum].coordinates.lon + "</td>" +
      "<td>" + jetsArray[jetNum].distanceToAirport.toFixed(2) + "</td>" +
    "</tr>";
  };

  html += '</tbody></table>';
  return html;
}
