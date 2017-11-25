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
    tmp += '&amenity[]=bars';
  }
  if (document.getElementById('et-hotels').checked) {
    tmp += '&amenity[]=hotels';
  }
  if (document.getElementById('et-restaurants').checked) {
    tmp += '&amenity[]=restaurants';
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

var setupMarker = function(data) {
  var icon;
  if (data['category'] == 'bars') icon = blueIcon;
  if (data['category'] == 'hotels') icon = redIcon;
  if (data['category'] == 'restaurants') icon = greenIcon;

  var marker = L.marker([data['lat'], data['lon']], {icon: icon});
  var t = '<dl><dt><b>Name:     </b> ' + data['name'] + '</dt>'
            + '<dt><b>Category: </b> ' + data['category'] + '</dt>'
            + '<dt><b>Amenity:  </b> ' + data['amenity'] + '</dt></dl>'

  marker.bindTooltip(t).openTooltip();
  return marker;
};

var findStreet = function(event) {
  currentPosition = mymap.getCenter();
  var amenities = getAmenities();
  if (amenities != '') {
    var request = 'http://127.0.0.1:3000/api/streets?' + amenities + '&lat=' + currentPosition.lat + '&lon=' + currentPosition.lng + '' + getParams();
    getJSON(request,
    function(err, data) {
      if (err !== null) {
        console.log('Error occurred during getting response from nodejs: ' + err);
      } else {
        markers.clearLayers();

        mymap.setView([data[0].lat, data[0].lon], 11);


        // if (parseInt(document.getElementById('param-distance').value)) {
        //   L.circle([e.latlng['lat'], e.latlng['lng']], {
        //     color: 'yellow',
        //     fillColor: '#ff0',
        //     fillOpacity: 0.2,
        //     radius: parseInt(document.getElementById('param-distance').value)
        //   }).addTo(markers);
        // }

        console.log('Request sent to backend ' + request);
        console.log('Fetched ' + data.length + ' objects');
        for (d in data) {
          setupMarker(data[d]).addTo(markers);
          // console.log(data[d]);
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
var markers = L.layerGroup().addTo(mymap);

function onMapClick(e) {

  if (document.getElementById('uc-points').checked) {
    var amenities = getAmenities();
    if (amenities != '') {
      var request = 'http://127.0.0.1:3000/api/points?' + amenities + '&lon=' + e.latlng['lng'] + '&lat=' + e.latlng['lat'] + getParams();
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
              radius: parseInt(document.getElementById('param-distance').value)
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
  }
  else if (document.getElementById('uc-rectangles').checked) {
    if (coordinates.length > 2) coordinates = [];
    coordinates.push(e.latlng['lat'], e.latlng['lng']);
    console.log(coordinates);
    var amenities = getAmenities();
    if (amenities != '' && coordinates.length > 2) {
      {
        var request = 'http://127.0.0.1:3000/api/rectangles?' + amenities + '&lat[]=' + coordinates[0] + '&lon[]=' + coordinates[1] + '&lat[]=' + coordinates[2] + '&lon[]=' + coordinates[3] + getParams();
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
  }
  else if (document.getElementById('uc-paths').checked) {
    console.log('uc-paths');
  }
};

mymap.on('click', onMapClick);
