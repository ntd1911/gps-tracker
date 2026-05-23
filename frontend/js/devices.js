// Manage user's Thingspeak devices

window.loadUserDevices = async function () {
  const listEl = document.getElementById('myDevicesList');
  listEl.innerHTML = 'Loading...';

  try {
    const devices = await getMyDevices();
    if (!Array.isArray(devices)) {
      // API may return error object
      listEl.innerHTML = devices && devices.message ? devices.message : 'Error loading devices';
      return;
    }

    renderDevices(devices || []);
  } catch (err) {
    console.error(err);
    listEl.innerHTML = 'Error loading devices';
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
  const channel = checkbox.getAttribute('data-channel');
  if (checkbox.checked) {
    // ensure app/map visible
    if (typeof showAppPage === 'function') showAppPage();
    // fetch latest from thingspeak and add marker
    try {
      const url = `https://api.thingspeak.com/channels/${channel}/feeds.json?results=1`;
      const resp = await fetch(url);
      const data = await resp.json();
      if (data && data.feeds && data.feeds.length) {
        const feed = data.feeds[0];
        const lat = parseFloat(feed.field1 ?? feed.latitude ?? feed.lat);
        const lng = parseFloat(feed.field2 ?? feed.longitude ?? feed.lng ?? feed.lon);
        if (isFinite(lat) && isFinite(lng)) {
          // use circleMarker (SVG) as a fallback to avoid missing icon assets
          let marker;
          try {
            marker = L.circleMarker([lat, lng], { radius: 8, color: '#0b84ff', fillColor: '#0ea5e9', fillOpacity: 0.9 }).addTo(map);
          } catch (e) {
            // fallback to marker if circleMarker unavailable
            marker = L.marker([lat, lng]).addTo(map);
          }
          marker.bindPopup(`${channel}`);
          // store marker reference on checkbox
          checkbox._marker = marker;
          // ensure map redraws and centers on marker; zoom in for visibility
          setTimeout(()=>{
            try{
              if (map && typeof map.invalidateSize === 'function') map.invalidateSize();
              if (map && typeof map.setView === 'function') map.setView([lat, lng], 16);
              if (marker && typeof marker.openPopup === 'function') marker.openPopup();
              // add temporary highlight circle
              try{
                const h = L.circle([lat, lng], { radius: 30, color: '#ff3b3b', weight: 2 }).addTo(map);
                checkbox._highlight = h;
                setTimeout(()=>{ try{ if (checkbox._highlight) { map.removeLayer(checkbox._highlight); checkbox._highlight = null; } }catch(e){} }, 5000);
              }catch(e){}
            }catch(e){console.error(e)}
          }, 150);
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
    // remove marker
    if (checkbox._marker) {
      map.removeLayer(checkbox._marker);
      checkbox._marker = null;
    }
    if (checkbox._highlight) {
      try { map.removeLayer(checkbox._highlight); } catch(e){}
      checkbox._highlight = null;
    }
  }
};