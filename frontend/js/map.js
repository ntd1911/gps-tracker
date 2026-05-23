const map = L.map("map")
.setView([21.0285, 105.8542], 13);

L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:"&copy; OpenStreetMap"
  }
).addTo(map);

const marker = L.marker(
  [21.0285, 105.8542]
).addTo(map);

let routeLine = L.polyline([],{
  color:"red",
  weight:5
}).addTo(map);