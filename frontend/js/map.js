// Các biến global — được expose ra window để các file khác dùng được
let map;
let marker;
let routeLine;
let tileLayer;

function initializeMap() {

  // Nếu map đã tồn tại, chỉ cần invalidateSize để vẽ lại đúng kích thước
  if (map) {
    setTimeout(() => {
      map.invalidateSize();
    }, 300);
    return map;
  }

  map = L.map("map").setView([21.0285, 105.8542], 13);

  tileLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "&copy; OpenStreetMap contributors"
    }
  ).addTo(map);

  tileLayer.on("tileerror", () => {
    console.warn("Tile load error");
  });

  marker = L.marker([21.0285, 105.8542]).addTo(map);

  routeLine = L.polyline([], {
    color: "red",
    weight: 5
  }).addTo(map);

  // Expose ra window để các file khác (devices.js, history.js, gps.js...) truy cập được
  window.map      = map;
  window.marker   = marker;
  window.routeLine = routeLine;

  setTimeout(() => {
    map.invalidateSize();
  }, 300);

  return map;
}

// KHÔNG gọi initializeMap() ở đây nữa.
// Việc khởi tạo map được thực hiện bởi showAppPage() trong auth.js
// để đảm bảo #appPage đang hiển thị (display:block) trước khi Leaflet tính kích thước.
