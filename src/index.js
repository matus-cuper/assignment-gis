var getJSON = function(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  xhr.responseType = 'json';
  xhr.onload = function() {
    var status = xhr.status;
    if (status === 200) {
      callback(null, xhr.response);
    } else {
      callback(status, xhr.response);
    }
  };
  xhr.send();
};

var getAmenities = function() {
  var tmp = '';
  if (document.getElementById('et-bars').checked) {
    tmp += (tmp == '') ? 'amenity[]=bars' : '&amenity[]=bars';
  }
  if (document.getElementById('et-hotels').checked) {
    tmp += (tmp == '') ? 'amenity[]=hotels' : '&amenity[]=hotels';
  }
  if (document.getElementById('et-restaurants').checked) {
    tmp += (tmp == '') ? 'amenity[]=restaurants' : '&amenity[]=restaurants';
  }

  return tmp;
};

var getParams = function() {
  var tmp = '';
  if (!isNaN(parseInt(document.getElementById('param-distance').value))) {
    tmp += ('&distance=' + parseInt(document.getElementById('param-distance').value));
  }
  if (!isNaN(parseInt(document.getElementById('param-limit').value))) {
    tmp += ('&limit=' + parseInt(document.getElementById('param-limit').value));
  }
  if (document.getElementById('param-street').value) {
    tmp += ('&street=' + document.getElementById('param-street').value);
  }

  if (tmp == '')
    return '&limit=10';
  return tmp;
};

var getCoordinates = function(coordinates) {
  var tmp = '';
  for (c in coordinates)
    tmp += (parseInt(c) % 2) ? ('&lng[]=' + coordinates[c]) : ('&lat[]=' + coordinates[c]);

  return tmp;
}

var setupMarker = function(data) {
  var icon;
  if (data.properties.category == 'bars') icon = blueIcon;
  if (data.properties.category == 'hotels') icon = redIcon;
  if (data.properties.category == 'restaurants') icon = greenIcon;

  var marker = L.marker([data.geometry.coordinates[1], data.geometry.coordinates[0]], {icon: icon});
  var t = '<dl><dt><b>Name:     </b> ' + data.properties.name + '</dt>'
            + '<dt><b>Distance: </b> ' + parseFloat(data.properties.distance).toFixed(2) + ' m' + '</dt>'
            + '<dt><b>Category: </b> ' + data.properties.category + '</dt>'
            + '<dt><b>Amenity:  </b> ' + data.properties.amenity + '</dt></dl>'

  marker.bindTooltip(t).openTooltip();
  return marker;
};

var findStreet = function(event) {
  currentPosition = mymap.getCenter();
  var amenities = getAmenities();
  if (amenities != '') {
    var request = 'http://127.0.0.1:3000/api/streets?' + amenities + '&lat=' + currentPosition.lat + '&lng=' + currentPosition.lng + '' + getParams();
    getJSON(request,
    function(err, data) {
      if (err !== null) {
        console.log('Error occurred during getting response from nodejs: ' + err);
      } else {
        markers.clearLayers();

        mymap.setView([data[0].geometry.coordinates[1], data[0].geometry.coordinates[0]], 17);

        console.log('Request sent to backend ' + request);
        console.log('Fetched ' + data.length + ' objects');
        for (d in data) {
          setupMarker(data[d]).addTo(markers);
          for (c in data[d].properties.street.coordinates) {
            if (c < data[d].properties.street.coordinates.length - 1) {
              L.polyline([
                [data[d].properties.street.coordinates[parseInt(c)][1], data[d].properties.street.coordinates[parseInt(c)][0]],
                [data[d].properties.street.coordinates[parseInt(c) + 1][1], data[d].properties.street.coordinates[parseInt(c) + 1][0]]
              ],{color: 'yellow'}).addTo(markers);
            }
          }
        }
      }
    });
  }
}


var greenIcon = L.icon({iconUrl: 'icons/marker-green.png', iconSize: [40, 50], iconAnchor: [20, 50], tooltipAnchor: [0, -35]});
var blueIcon = L.icon({iconUrl: 'icons/marker-blue.png', iconSize: [40, 50], iconAnchor: [20, 50], tooltipAnchor: [0, -35]});
var redIcon = L.icon({iconUrl: 'icons/marker-red.png', iconSize: [40, 50], iconAnchor: [20, 50], tooltipAnchor: [0, -35]});

var mymap = L.map('mapid').setView([48.1472665, 17.1088840], 15);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
  accessToken: 'pk.eyJ1IjoiY3VwbyIsImEiOiJjajhibW9pczQwc3M0MnFwOGo3dDFncWwzIn0.VlG1EafnmV5KoZFf_1EUBQ'
}).addTo(mymap);


var coordinates = [];
var lastEvent = '';
var markers = L.layerGroup().addTo(mymap);

function onMapClick(e) {

  if (document.getElementById('uc-points').checked) {
    var amenities = getAmenities();
    if (amenities != '') {
      var request = 'http://127.0.0.1:3000/api/points?' + amenities + '&lat=' + e.latlng['lat'] + '&lng=' + e.latlng['lng'] + getParams();
      getJSON(request,
      function(err, data) {
        if (err !== null) {
          console.log('Error occurred during getting response from nodejs: ' + err);
        } else {
          markers.clearLayers();

          if (parseInt(document.getElementById('param-distance').value)) {
            L.circle([e.latlng['lat'], e.latlng['lng']], {
              color: 'yellow',
              fillColor: '#ff0',
              fillOpacity: 0.2,
              radius: parseInt(document.getElementById('param-distance').value) * 1/Math.sqrt(2)
            }).addTo(markers);
          }

          console.log('Request sent to backend ' + request);
          console.log('Fetched ' + data.length + ' objects');
          for (d in data) {
            setupMarker(data[d]).addTo(markers);
            console.log(data[d]);
          }
        }
      });
    }
    lastEvent = 'uc-points';
  }
  else if (document.getElementById('uc-rectangles').checked) {
    if (coordinates.length > 2) coordinates = [];
    coordinates.push(e.latlng['lat'], e.latlng['lng']);
    var amenities = getAmenities();
    if (amenities != '' && coordinates.length > 2) {
      { // TODO remove?
        var request = 'http://127.0.0.1:3000/api/rectangles?' + amenities + '&lat[]=' + coordinates[0] + '&lng[]=' + coordinates[1] + '&lat[]=' + coordinates[2] + '&lng[]=' + coordinates[3] + getParams();
        getJSON(request,
        function(err, data) {
          if (err !== null) {
            console.log('Error occurred during getting response from nodejs: ' + err);
          } else {
            markers.clearLayers();
            L.polygon([
              [coordinates[0], coordinates[1]],
              [coordinates[0], coordinates[3]],
              [coordinates[2], coordinates[3]],
              [coordinates[2], coordinates[1]]
            ], {
              color: 'yellow',
              fillColor: '#ff0',
              fillOpacity: 0.2
            }).addTo(markers);

            console.log('Request sent to backend ' + request);
            console.log('Fetched ' + data.length + ' objects');
            for (d in data) {
              setupMarker(data[d]).addTo(markers);
              console.log(data[d]);
            }
          }
        });
      }
    }
    lastEvent = 'uc-rectangles';
  }
  else if (document.getElementById('uc-paths').checked) {
    if (lastEvent != 'uc-paths') {
      coordinates = [];
      markers.clearLayers();
    }
    coordinates.push(e.latlng['lat'], e.latlng['lng']);
    var amenities = getAmenities();
    if (amenities != '') {
      { // TODO remove?
        var requestPoints = 'http://127.0.0.1:3000/api/points?' + amenities + '&lat=' + e.latlng['lat'] + '&lng=' + e.latlng['lng'] + getParams();
        getJSON(requestPoints,
        function(err, data) {
          if (err !== null) {
            console.log('Error occurred during getting response from nodejs: ' + err);
          } else {
            if (lastEvent != 'uc-paths') markers.clearLayers();
            console.log('Request sent to backend ' + requestPoints);
            console.log('Fetched ' + data.length + ' objects');
            for (d in data) {
              setupMarker(data[d]).addTo(markers);
              console.log(data[d]);
            }
          }
        });

        if (coordinates.length > 2) {
          if (coordinates.length > 4) {
            coordinates.shift();
            coordinates.shift();
          }
          var requestPaths = 'http://127.0.0.1:3000/api/paths?' + amenities + getCoordinates(coordinates);
          getJSON(requestPaths,
          function(err, data) {
            if (err !== null) {
              console.log('Error occurred during getting response from nodejs: ' + err);
            } else {
              if (lastEvent != 'uc-paths') markers.clearLayers();

              console.log('Request sent to backend ' + requestPaths);
              console.log('Fetched ' + data.length + ' objects');
              for (d in data) {
                console.log(data[d]);
                for (c in data[d].coordinates) {
                  if (c < data[d].coordinates.length - 1) {
                    L.polyline([
                      [data[d].coordinates[parseInt(c)][1], data[d].coordinates[parseInt(c)][0]],
                      [data[d].coordinates[parseInt(c) + 1][1], data[d].coordinates[parseInt(c) + 1][0]]
                    ],{color: 'yellow'}).addTo(markers);
                  }
                }
              }
            }
          });
        }
      }
    }
    lastEvent = 'uc-paths';
  }
};

mymap.on('click', onMapClick);
