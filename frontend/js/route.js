async function drawRealRoute(points){

  if(!showRoute) return;

  if(points.length < 2){

    routeLine.setLatLngs(points);

    return;
  }

  try{

    const sliced =
    points.slice(-80);

    const coords =
    sliced.map(p =>
      `${p[1]},${p[0]}`
    ).join(";");

    const url =
    `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

    const response =
    await fetch(url);

    const data =
    await response.json();

    if(
      data.routes &&
      data.routes.length > 0
    ){

      const routeCoords =
      data.routes[0]
      .geometry.coordinates;

      const latlngs =
      routeCoords.map(c => [
        c[1],
        c[0]
      ]);

      routeLine.setLatLngs(latlngs);

    }

  }catch(err){

    console.log(err);

    routeLine.setLatLngs(points);
  }
}

function clearRoute(){

  realtimePoints = [];

  historyPoints = [];

  routeLine.setLatLngs([]);
}