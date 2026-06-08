// Manage user's Thingspeak devices

window.loadUserDevices = async function () {
  const listEl = document.getElementById('myDevicesList');
  listEl.innerHTML = 'Đang tải...';

  try {
    const devices = await getMyDevices();
    if (!Array.isArray(devices)) {
      listEl.innerHTML = devices && devices.message ? devices.message : 'Lỗi tải thiết bị';
      return;
    }
    renderDevices(devices || []);
  } catch (err) {
    console.error(err);
    listEl.innerHTML = 'Lỗi tải thiết bị';
  }
};

window.renderDevices = function (devices) {
  const listEl = document.getElementById('myDevicesList');
  listEl.innerHTML = '';
  if (!devices || devices.length === 0) {
    listEl.innerHTML = '<div>Chưa có thiết bị</div>';
    return;
  }

  devices.forEach(d => {
    const div = document.createElement('div');
    div.className = 'device-item';
    div.innerHTML = `
      <label><input type="checkbox" data-channel="${d.deviceId}" onchange="toggleDeviceDisplay(this)"> ${d.deviceName || d.deviceId}</label>
    `;
    listEl.appendChild(div);
  });
};

window.addMyDevice = async function () {
  const channel = document.getElementById('newDeviceChannel').value.trim();
  const name = document.getElementById('newDeviceName').value.trim();
  if (!channel) return alert('Nhập Thingspeak channel id');

  try {
    const res = await addDevice({ deviceId: channel, deviceName: name });
    if (res && res.message) {
      alert('Thiết bị đã được thêm');
      document.getElementById('newDeviceChannel').value = '';
      document.getElementById('newDeviceName').value = '';
      loadUserDevices();
    } else {
      alert('Không thể thêm thiết bị');
    }
  } catch (err) {
    console.error(err);
    alert('Lỗi thêm thiết bị');
  }
};

window.toggleDeviceDisplay = async function (checkbox) {
  // Dùng window.map để chắc chắn lấy đúng instance global
  const mapInstance = window.map;

  if (!mapInstance) {
    alert('Bản đồ chưa được khởi tạo, thử lại sau giây lát.');
    checkbox.checked = false;
    return;
  }

  const channel = checkbox.getAttribute('data-channel');

  if (checkbox.checked) {

    try {
      const url = `https://api.thingspeak.com/channels/${channel}/feeds.json?results=1`;
      const resp = await fetch(url);
      const data = await resp.json();

      if (data && data.feeds && data.feeds.length) {
        const feed = data.feeds[0];
        const lat = parseFloat(feed.field1 ?? feed.latitude ?? feed.lat);
        const lng = parseFloat(feed.field2 ?? feed.longitude ?? feed.lng ?? feed.lon);

        if (isFinite(lat) && isFinite(lng)) {
          const devMarker = L.circleMarker([lat, lng], {
            radius: 8,
            color: '#0b84ff',
            fillColor: '#0ea5e9',
            fillOpacity: 0.9
          }).addTo(mapInstance);

          devMarker.bindPopup(`<b>${channel}</b><br>Lat: ${lat.toFixed(5)}<br>Lng: ${lng.toFixed(5)}`);
          checkbox._marker = devMarker;

          setTimeout(() => {
            try {
              mapInstance.invalidateSize();
              mapInstance.setView([lat, lng], 16);
              devMarker.openPopup();

              // Vòng tròn highlight tạm thời
              const highlight = L.circle([lat, lng], {
                radius: 30,
                color: '#ff3b3b',
                weight: 2,
                fillOpacity: 0
              }).addTo(mapInstance);
              checkbox._highlight = highlight;
              setTimeout(() => {
                try {
                  if (checkbox._highlight) {
                    mapInstance.removeLayer(checkbox._highlight);
                    checkbox._highlight = null;
                  }
                } catch (e) {}
              }, 5000);
            } catch (e) {
              console.error(e);
            }
          }, 200);

        } else {
          alert('Thiết bị không có vị trí hợp lệ');
          checkbox.checked = false;
        }

      } else {
        alert('Không có feed từ Thingspeak');
        checkbox.checked = false;
      }

    } catch (err) {
      console.error(err);
      alert('Lỗi khi lấy feed');
      checkbox.checked = false;
    }

  } else {
    // Bỏ tick → xóa marker
    if (checkbox._marker) {
      mapInstance.removeLayer(checkbox._marker);
      checkbox._marker = null;
    }
    if (checkbox._highlight) {
      try { mapInstance.removeLayer(checkbox._highlight); } catch (e) {}
      checkbox._highlight = null;
    }
  }
};
