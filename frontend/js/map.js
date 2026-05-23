// Initialize Leaflet map only if library loaded
let map;
let routeLine;
let tileLayer;
let debugOverlay;
function createMapDebugUI() {
  const el = document.getElementById('map');
  if (!el) return;
  const box = document.createElement('div');
  box.id = 'map-debug';
  box.innerHTML = `
    <div id="map-debug-info">Map: checking...</div>
    <button id="map-debug-toggle">Chỉ marker</button>
  `;
  el.appendChild(box);
  document.getElementById('map-debug-toggle').addEventListener('click', ()=>{
    if (tileLayer) {
      try { tileLayer.remove(); } catch(e){}
      el.classList.add('tiles-missing');
      document.getElementById('map-debug-info').innerText = 'Mode: marker-only';
    }
  });
}

if (typeof L !== 'undefined') {
  map = L.map("map").setView([21.0285, 105.8542], 13);
  tileLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "&copy; OpenStreetMap"
    }
  ).addTo(map);

  // If tiles fail to load (offline/network), remove layer and show placeholder
  tileLayer.on('tileerror', function () {
    try {
      tileLayer.remove();
    } catch (e) {}
    const el = document.getElementById('map');
    if (el) {
      el.classList.add('tiles-missing');
      // add message overlay if not present
      if (!document.getElementById('map-placeholder')) {
        const msg = document.createElement('div');
        msg.id = 'map-placeholder';
        msg.innerText = 'Tiles không thể tải — hiển thị vị trí mà không có bản đồ nền.';
        el.appendChild(msg);
      }
    }
  });

  // create debug UI
  createMapDebugUI();
  // update debug info periodically
  setInterval(()=>{
    try{
      const info = document.getElementById('map-debug-info');
      if (!info) return;
      const tiles = document.querySelectorAll('#map .leaflet-tile-pane img').length;
      info.innerText = `Tiles: ${tiles} | Size: ${Math.round(document.getElementById('map').clientWidth)}x${Math.round(document.getElementById('map').clientHeight)}`;
    }catch(e){}
  },1000);

  const marker = L.marker([21.0285, 105.8542]).addTo(map);

  routeLine = L.polyline([], {
    color: "red",
    weight: 5
  }).addTo(map);

} else {
  // graceful fallback: show message instead of throwing
  const el = document.getElementById('map');
  if (el) {
    el.innerHTML = '<div style="color:#cbd5e1;padding:20px">Bản đồ không thể tải (Leaflet chưa được tải). Vui lòng kiểm tra kết nối mạng.</div>';
  }
}