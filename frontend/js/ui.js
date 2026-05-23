const statusElement =
document.querySelector(".status");

document
.getElementById("routeToggle")
.addEventListener("change",function(){

  showRoute = this.checked;

  if(showRoute){

    map.addLayer(routeLine);

  }else{

    map.removeLayer(routeLine);
  }
});

function setOffline(){

  statusElement.innerText =
  "OFFLINE";

  statusElement.style.color =
  "red";
}

function setNoGPS(){

  statusElement.innerText =
  "NO GPS";

  statusElement.style.color =
  "orange";
}
// =========================
// CALCULATE DISTANCE
// =========================
function calculateDistance(points) {

  let total = 0;

  for (let i = 1; i < points.length; i++) {

    const lat1 =
      points[i - 1][0];

    const lng1 =
      points[i - 1][1];

    const lat2 =
      points[i][0];

    const lng2 =
      points[i][1];

    total += haversine(
      lat1,
      lng1,
      lat2,
      lng2
    );
  }

  return total.toFixed(2);
}

// =========================
// HAVERSINE
// =========================
function haversine(
  lat1,
  lon1,
  lat2,
  lon2
) {

  const R = 6371;

  const dLat =
    (lat2 - lat1) *
    Math.PI / 180;

  const dLon =
    (lon2 - lon1) *
    Math.PI / 180;

  const a =
    Math.sin(dLat/2) *
    Math.sin(dLat/2) +

    Math.cos(lat1 * Math.PI/180) *
    Math.cos(lat2 * Math.PI/180) *

    Math.sin(dLon/2) *
    Math.sin(dLon/2);

  const c =
    2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1-a)
    );

  return R * c;
}