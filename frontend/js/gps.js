async function loadGPS(){

  if(historyMode) return;

  try{

    const response =
    await fetch(
      `https://api.thingspeak.com/channels/${channelID}/feeds.json?results=1`
    );

    const data =
    await response.json();

    const feed =
    data.feeds[0];

    if(!feed){

      setOffline();

      return;
    }

    const lat =
    parseFloat(feed.field1);

    const lng =
    parseFloat(feed.field2);

    const speed =
    feed.field3 || "0";

    if(
      isNaN(lat) ||
      isNaN(lng)
    ){

      setNoGPS();

      return;
    }

    document.getElementById("lat")
    .innerText =
    lat.toFixed(6);

    document.getElementById("lng")
    .innerText =
    lng.toFixed(6);

    document.getElementById("speed")
    .innerText =
    speed + " km/h";

    document.getElementById(
  "currentSpeed"
).innerText =
  speed + " km/h";

document.getElementById(
  "mapMode"
).innerText =
  "REALTIME";

document.getElementById(
  "totalPoints"
).innerText =
  realtimePoints.length;

document.getElementById(
  "totalDistance"
).innerText =
  calculateDistance(
    realtimePoints
  ) + " km";
  
    statusElement.innerText =
    "ONLINE";

    statusElement.style.color =
    "#22c55e";

    marker.setLatLng([lat,lng]);

    map.setView([lat,lng],17);

    realtimePoints.push([lat,lng]);

    if(realtimePoints.length > 100){

      realtimePoints.shift();
    }

    await drawRealRoute(
      realtimePoints
    );

  }catch(err){

    console.log(err);

    setOffline();
  }
}