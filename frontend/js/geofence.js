// Geofence save helper
async function saveGeofenceAPI(payload) {
  return postAPI('/geofence/save', payload);
}

window.saveGeofence = async function () {
  const deviceIdInput = document.getElementById('geofenceDeviceId');
  const radiusInput = document.getElementById('geofenceRadius');
  const enabledInput = document.getElementById('geofenceEnabled');
  const deviceId = deviceIdInput ? deviceIdInput.value.trim() : channelID;
  const radius = radiusInput ? parseInt(radiusInput.value, 10) : 100;
  const enabled = enabledInput ? enabledInput.checked : true;
  const lat = parseFloat(document.getElementById('lat').innerText);
  const lng = parseFloat(document.getElementById('lng').innerText);

  if (!deviceId) {
    return alert('Nhập channel ID của thiết bị để lưu geofence');
  }

  if (!isFinite(lat) || !isFinite(lng)) {
    return alert('Vị trí GPS hiện tại không hợp lệ. Vui lòng đợi GPS cập nhật.');
  }

  if (!radius || radius <= 0) {
    return alert('Chọn bán kính hợp lệ.');
  }

  try {
    const response = await saveGeofenceAPI({
      deviceId,
      lat,
      lng,
      radius,
      enabled
    });

    if (response && response.success) {
      alert('Đã lưu geofence thành công');
    } else {
      alert(response && response.message ? response.message : 'Lưu geofence thất bại');
    }
  } catch (err) {
    console.error(err);
    alert('Lỗi khi lưu geofence');
  }
};
