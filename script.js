var map = L.map('map').setView([48.852065, 2.305069], 13);

//Marker personnes
var marker1 = L.marker([48.839865, 2.299919], {
    draggable: true
}).addTo(map);
var marker2 = L.marker([48.849823, 2.316999], {
    draggable: true
}).addTo(map);
var marker3 = L.marker([48.854663, 2.296143], {
    draggable: true
}).addTo(map);



// create a polyline from an array of LatLng points
var latlngs1 = [
    [48.839865, 2.299919],
    [48.856031, 2.314078],
    [48.848494, 2.294149]
];
var latlngs2 = [
    [48.849823, 2.316999],
    [48.844852, 2.330039],
    [48.848494, 2.294149]
];
var latlngs3 = [
    [48.854663, 2.296143],
    [48.839996, 2.287305],
    [48.848494, 2.294149]
];

//Lignes
var polyline1 = L.polyline(latlngs1, {
    color: 'black'
}).addTo(map);
var polyline2 = L.polyline(latlngs2, {
    color: 'yellow'
}).addTo(map);
var polyline3 = L.polyline(latlngs3, {
    color: 'orange'
}).addTo(map);


//Couleurs markers
var myIcon = L.icon({
    iconUrl: 'img/marker-icon-2x-red.png',
    iconSize: [25, 41],
});

var myIconRestau = L.icon({
    iconUrl: 'img/marker-icon-2x-green.png',
    iconSize: [25, 41],
});

//Marker restaurants
var restau1 = L.marker([48.856031, 2.314078], {
    icon: myIconRestau
}).addTo(map);
var restau2 = L.marker([48.844852, 2.330039], {
    icon: myIconRestau
}).addTo(map);
var restau3 = L.marker([48.839996, 2.287305], {
    icon: myIconRestau
}).addTo(map);

//Markers du point d'arrivée
var markerArrive = L.marker([48.848494, 2.294149], {
    draggable: true,
    icon: myIcon
}).addTo(map);


var lat;
var lon;

function getCoordinates(markerID) {

    lat = markerID.latlng.lat;
    lon = markerID.latlng.lng;
    console.log(lat + " Inside");
}





//Fonction pour que la ligne suive le marqueur à la fin du drag
var lat1;
var lon1;
var lat2;
var lon2;
var lat3;
var lon3;
var latArr;
var lonArr;

//Afficher la longitude et latitude des markers
marker1.on('dragend', function (e) {
    // document.getElementById('latitude1').value = marker1.getLatLng().lat;
    // document.getElementById('longitude1').value = marker1.getLatLng().lng;
    lat1 = marker1.getLatLng().lat;
    lon1 = marker1.getLatLng().lng;
    latlngs1 = [
        [lat1, lon1],
        [48.856031, 2.314078],
        [48.848494, 2.294149]
    ];
    polyline1 = L.polyline(latlngs1, {
        color: 'black'
    }).addTo(map);
});
marker2.on('dragend', function (e) {
    // document.getElementById('latitude2').value = marker2.getLatLng().lat;
    // document.getElementById('longitude2').value = marker2.getLatLng().lng;
});
marker3.on('dragend', function (e) {
    // document.getElementById('latitude3').value = marker3.getLatLng().lat;
    // document.getElementById('longitude3').value = marker3.getLatLng().lng;
});
markerArrive.on('dragend', function (e) {
    // document.getElementById('latitude4').value = markerArrive.getLatLng().lat;
    // document.getElementById('longitude4').value = markerArrive.getLatLng().lng;
    lat1 = marker1.getLatLng().lat;
    lon1 = marker1.getLatLng().lng;
    latlngs1 = [
        [lat1, lon1],
        [48.856031, 2.314078],
        [48.848494, 2.294149]
    ];
    polyline1 = L.polyline(latlngs1, {
        color: 'black'
    }).addTo(map);
});


//Popup marker
// var popup = L.popup();

// marker1.bindPopup("P1").openPopup();
// marker2.bindPopup("P2").openPopup();
// marker3.bindPopup("P3").openPopup();
// markerArrive.bindPopup("Arrivée").openPopup();

// restau1.bindPopup("R1").openPopup();
// restau2.bindPopup("R2").openPopup();
// restau3.bindPopup("R3").openPopup();


//Map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


//Popup qui affiche la position lorsqu'on clique sur la map
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("Vous avez cliqué à : " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);







function getDistance(origin, destination) {
    // return distance in meters
    var lon1 = toRadian(origin[1]),
        lat1 = toRadian(origin[0]),
        lon2 = toRadian(destination[1]),
        lat2 = toRadian(destination[0]);

    var deltaLat = lat2 - lat1;
    var deltaLon = lon2 - lon1;

    var a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var EARTH_RADIUS = 6371;
    return c * EARTH_RADIUS * 1000;
}
function toRadian(degree) {
    return degree*Math.PI/180;
}
// var distance = getDistance([lat1, lng1], [lat2, lng2])