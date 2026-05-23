// =========================
// BACK TO REALTIME
// =========================
window.backToRealtime =
async function () {

  historyMode = false;

  historyPoints = [];

  document.getElementById(
    "historyBox"
  ).innerHTML = "";

  routeLine.setLatLngs([]);

  realtimePoints = [];

  statusElement.innerText =
    "REALTIME";

  statusElement.style.color =
    "#22c55e";

  await loadGPS();
};

// =========================
// CLEAR ROUTE
// =========================
window.clearRoute =
function () {

  realtimePoints = [];

  historyPoints = [];

  routeLine.setLatLngs([]);
};