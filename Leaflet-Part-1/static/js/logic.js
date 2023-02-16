// Create Map Object
var myMap = L.map("map", {
    center: [15.5994, -28.6731],
    zoom: 4
  });
  
  // Load TileLayer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

  // Get the GeoJSON data.
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"


// Connect to GeoJSON API using d3
d3.json(link).then(function(data) {
   
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 2;
  }
 
function getColor(x){

  if (x > 90) {
        return "#006d2c";
      }
      else if (x > 70) {
        return  "#31a354";
      }
      else if (x > 50) {
        return "#74c476";
      }
      else if (x > 30) {
        return  "#a1d99b";
      }
      else if (x > 10) {
        return  "#c7e9c0";
      }
      else {
        return  "#edf8e9";
      }

};

  L.geoJson(data, {
    // Turn Features into a Circular Marker with size corresponding to earthquake magnitude

    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },

    style: styleInfo,
    // Create interactive pop-up including magnitude, depth, and location
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "Magnitude: "
        + feature.properties.mag
        + "<br>Depth: "
        + feature.geometry.coordinates[2]
        + "<br>Location: "
        + feature.properties.place
      );
    }
  }).addTo(myMap);

  // create legend 
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = [-10, 10, 30, 50, 70, 90];
    var colors = ["#edf8e9","#c7e9c0","#a1d99b","#74c476","#31a354","#006d2c"];
    var labels = [""];

    for (var i = 0; i < limits.length; i++) {
      div.innerHTML += "<i style='background-color: " + colors[i] + "'></i> "
        + limits[i] + (limits[i + 1] ? "&ndash;" + limits[i + 1] + "<br>" : "+");
    }

    return div;
  };

  // Add legend to map
  legend.addTo(myMap);



}
    
    
  );

