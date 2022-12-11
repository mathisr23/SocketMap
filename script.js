var map = L.map('map').setView([48.852065, 2.305069], 13);


var popup = L.popup();
let markerResto = "";
var arrayResto = [];
const requestRestos = new XMLHttpRequest();

//Marker des personnes
var marker1 = L.marker([48.839865, 2.299919], {
    draggable: true,
}).addTo(map);
var marker2 = L.marker([48.849823, 2.316999], {
    draggable: true
}).addTo(map);
var marker3 = L.marker([48.849229, 2.338925], {
    draggable: true
}).addTo(map);



// Déclaration des coordonnées pour les 3 polylines
var latlngs1 = [
    [48.839865, 2.299919],
    [48.839301, 2.30718], //Le central - Paris
    [48.842999, 2.320904]
];
var latlngs2 = [
    [48.849823, 2.316999],
    [48.847869, 2.327529], //Le Lakanal
    [48.842999, 2.320904]
];
var latlngs3 = [
    [48.849229, 2.338925],
    [48.840346, 2.359412], //La Romanella
    [48.842999, 2.320904]
];

//Declaration des 3 polylines + ajout à la map
var polyline1 = L.polyline(latlngs1, {
    color: 'black'
}).addTo(map);
var polyline2 = L.polyline(latlngs2, {
    color: 'blue'
}).addTo(map);
var polyline3 = L.polyline(latlngs3, {
    color: 'orange'
}).addTo(map);


//Déclaration des icons de marqueurs
var myIconArrivee = L.icon({
    iconUrl: 'img/marker-icon-2x-red.png',
    iconSize: [25, 41],
});

var myIconRestau = L.icon({
    iconUrl: 'img/restaurant.png',
    iconSize: [20, 20],
});

//Positionnement des markers sur la Map - 
var restau1 = L.marker([48.839301, 2.30718], {
    icon: myIconRestau
}).addTo(map);
var restau2 = L.marker([48.847869, 2.327529], {
    icon: myIconRestau
}).addTo(map);
var restau3 = L.marker([48.840346, 2.359412], {
    icon: myIconRestau
}).addTo(map);

var markerArrive = L.marker([48.842999, 2.320904], {
    draggable: true,
    icon: myIconArrivee
}).addTo(map);



//Utilisation de l'API opendata.paris.fr pour obtenir une liste des restaurants de Paris
requestRestos.open(
    "GET",
    "https://opendata.paris.fr/api/records/1.0/search/?dataset=restaurants-casvp&q=&facet=code&facet=nom_restaurant&facet=types",
    true
)

// A la fin du chargement de la page, stockage de la liste des restaurants dans le tableau arraytResto.
// Chaque entrée du tableau possède un attribut "name", "lat", "lon"
requestRestos.onload = function () {
    // Begin accessing JSON data here
    let data = JSON.parse(this.response)

    if (requestRestos.status >= 200 && requestRestos.status < 400) {
        data.records.forEach((resto) => {
            if (resto.geometry !== undefined) {
                let coord = resto.geometry.coordinates
                let obj = {}
                let name = resto.fields["nom_restaurant"]
                let adresse = resto.fields["adresse"]
                obj["name"] = name
                obj["adresse"] = adresse
                let lon = coord[0]
                obj["lon"] = lon
                let lat = coord[1]
                obj["lat"] = lat
                arrayResto.push(obj)

            }
        })
    } else {
        console.log("error")
    }
    console.log(arrayResto)
}

// Chargement des restaurant dans la liste <ul id="resto"></ul> de la page + sur la MAP
function initMap() {
    for (i = 0; i < arrayResto.length; i++) {
        markerResto = L.marker([arrayResto[i].lat, arrayResto[i].lon], {
            autoPan: true,
            icon: myIconRestau
        }).addTo(map)
        markerResto.bindPopup(arrayResto[i].name)

        $("#resto").append(
            "<li class='restausAPI' id='resto" + [i] +
            "'> " +
            arrayResto[i].name +
            " <br>",
            "<p class='restauName'>" +
            arrayResto[i].adresse +
            "'</p> ",
            " <br>",
        )

    }

    var_distance1 = Math.round(computeDistance(marker1.getLatLng().lat, marker1.getLatLng().lng, restau1.getLatLng().lat, restau1.getLatLng().lng) + computeDistance(restau1.getLatLng().lat, restau1.getLatLng().lng, markerArrive.getLatLng().lat, markerArrive.getLatLng().lng));
    var_distance2 = Math.round(computeDistance(marker2.getLatLng().lat, marker2.getLatLng().lng, restau2.getLatLng().lat, restau2.getLatLng().lng) + computeDistance(restau2.getLatLng().lat, restau2.getLatLng().lng, markerArrive.getLatLng().lat, markerArrive.getLatLng().lng));
    var_distance3 = Math.round(computeDistance(marker3.getLatLng().lat, marker3.getLatLng().lng, restau3.getLatLng().lat, restau3.getLatLng().lng) + computeDistance(restau3.getLatLng().lat, restau3.getLatLng().lng, markerArrive.getLatLng().lat, markerArrive.getLatLng().lng));
    document.getElementById('distance1').innerHTML = var_distance1;
    document.getElementById('distance2').innerHTML = var_distance2;
    document.getElementById('distance3').innerHTML = var_distance3;

    var_heureDepart1 = Math.round(60 - var_distance1 * 60 / 5000);
    var_heureDepart2 = Math.round(60 - var_distance2 * 60 / 5000);
    var_heureDepart3 = Math.round(60 - var_distance3 * 60 / 5000);
    document.getElementById('depart1').innerHTML = var_heureDepart1;
    document.getElementById('depart2').innerHTML = var_heureDepart2;
    document.getElementById('depart3').innerHTML = var_heureDepart3;

    var_tempsRestant1 = Math.round(var_distance1 * 60 / 5000);
    var_tempsRestant2 = Math.round(var_distance2 * 60 / 5000);
    var_tempsRestant3 = Math.round(var_distance3 * 60 / 5000);
    document.getElementById('tempsRestant1').innerHTML = var_tempsRestant1;
    document.getElementById('tempsRestant2').innerHTML = var_tempsRestant2;
    document.getElementById('tempsRestant3').innerHTML = var_tempsRestant3;
}


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

// Fonction de mise à jour de la polyline appelée au moment du dragend d'un marker draggable

marker1
    .on('dragstart', dragStart_F)
    .on('drag', drag_F)
    .on('dragstop', dragStop_F);

marker2
    .on('dragstart', dragStart_F)
    .on('drag', drag_F)
    .on('dragstop', dragStop_F);

marker3
    .on('dragstart', dragStart_F)
    .on('drag', drag_F)
    .on('dragstop', dragStop_F);

markerArrive
    .on('drag', dragArrivee_F)
    .on('dragstop', dragStopArrivee_F);


// Functions to manage move of start markers

function dragStart_F(e) {
    switch (this) {

        case marker1:
            latlngs_e = latlngs1;
            polyline_e = polyline1;
            break;

        case marker2:
            latlngs_e = latlngs2;
            polyline_e = polyline2;
            break;

        case marker3:
            latlngs_e = latlngs3;
            polyline_e = polyline3;
            break;
    }

    // Get the selected polyline's latlngs
    var latlngs = polyline_e.getLatLngs(),

        // Get the selected marker's start latlng
        latlng = this.getLatLng();

    // Iterate the polyline's latlngs and replace the latlng modified
    for (var i = 0; i < latlngs.length; i++) {
        if (latlng.equals(latlngs[i])) {
            //this.polylineLatlng = i;
            this.latlngs_e = i;
        }
    }
}

function drag_F(e) {

    // Get the polyline's latlngs
    var latlngs = polyline_e.getLatLngs(),

        // Get the marker's current latlng
        latlng = this.getLatLng();

    // Replace the old latlng with the new
    // latlngs.splice(this.polylineLatlng, 1, latlng);
    latlngs.splice(this.latlngs_e, 1, latlng);

    // Update the polyline with the new latlngs
    polyline_e.setLatLngs(latlngs);
}

function dragStop_F(e) {

    // Delete key from marker instance
    // delete this.polylineLatlng;
    delete this.latlngs_e;
}

// Functions to manage move of target marker

function dragArrivee_F(e) {

    let latlngs_e = [latlngs1, latlngs2, latlngs3];
    latlng = this.getLatLng();

    latlngs_e.forEach(function (latlngs_i) {
        // Replace the old latlng with the new
        // latlngs.splice(this.polylineLatlng, 1, latlng);
        latlngs_i.splice(2, 1, latlng);


    });
    // Update the polyline with the new latlngs
    polyline1.setLatLngs(latlngs1);
    polyline2.setLatLngs(latlngs2);
    polyline3.setLatLngs(latlngs3);

}

function dragStopArrivee_F(e) {

    // Delete key from marker instance
    // delete this.polylineLatlng;
    delete this.latlngs_e;
}



function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

function computeDistance(lat1, lng1, lat2, lng2) {
    // The radius of the planet earth in meters
    let R = 6378137;
    let dLat = degreesToRadians(lat2 - lat1);
    let dLong = degreesToRadians(lng2 - lng1);
    let a = Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
        Math.cos(degreesToRadians(lat1)) *
        Math.cos(degreesToRadians(lat1)) *
        Math.sin(dLong / 2) *
        Math.sin(dLong / 2);

    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = R * c;

    return distance;

}

// Chargement de la page avec appel de la fonction initMap()
window.onload = function () {
    initMap()
}
requestRestos.send()