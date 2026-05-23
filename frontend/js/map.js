// Lazy initialize Leaflet map when needed (avoids creating map in hidden container)
let map;
let routeLine;
let tileLayer;

function createMapDebugUI() {
  const el = document.getElementById('map');
  if (!el) return;
  // avoid duplicating
  if (document.getElementById('map-debug')) return;
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
      const info = document.getElementById('map-debug-info');
      if (info) info.innerText = 'Mode: marker-only';
    }
  });
}

function initializeMap() {
  if (map) return map;
  const el = document.getElementById('map');
  if (!el) return null;
  if (typeof L === 'undefined') {
    el.innerHTML = '<div style="color:#cbd5e1;padding:20px">Bản đồ không thể tải (Leaflet chưa được tải). Vui lòng kiểm tra kết nối mạng.</div>';
    return null;
  }

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

  // create debug UI and start updater
  createMapDebugUI();
  setInterval(()=>{
    try{
      const info = document.getElementById('map-debug-info');
      if (!info) return;
      const tiles = document.querySelectorAll('#map .leaflet-tile-pane img').length;
      info.innerText = `Tiles: ${tiles} | Size: ${Math.round(document.getElementById('map').clientWidth)}x${Math.round(document.getElementById('map').clientHeight)}`;
    }catch(e){}
  },1000);

  // initial marker and polyline
  const marker = L.marker([21.0285, 105.8542]).addTo(map);
  routeLine = L.polyline([], { color: "red", weight: 5 }).addTo(map);

  // expose map globally
  window.map = map;
  return map;
}

window.initializeMap = initializeMap;