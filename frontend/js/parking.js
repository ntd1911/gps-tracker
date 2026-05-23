// Save parking using latest Thingspeak data (preferred)
window.saveCurrentLocation = async function () {
  if (typeof channelID === 'undefined' || !channelID) {
    alert('Không có channelID để lấy dữ liệu Thingspeak');
    return;
  }

  const tsUrl = `https://api.thingspeak.com/channels/${channelID}/feeds.json?results=1`;

  try {
    const resp = await fetch(tsUrl);
    if (!resp.ok) throw new Error('HTTP ' + resp.status);

    const data = await resp.json();

    let lat = NaN;
    let lng = NaN;

    if (data.feeds && data.feeds.length > 0) {
      const feed = data.feeds[0];
      // common mappings: field1/field2 or latitude/longitude
      lat = parseFloat(feed.field1 ?? feed.latitude ?? feed.lat ?? feed.latitude);
      lng = parseFloat(feed.field2 ?? feed.longitude ?? feed.lng ?? feed.lon ?? feed.longitude);
    } else {
      // fallback if API returns single object
      lat = parseFloat(data.field1 ?? data.latitude ?? data.lat);
      lng = parseFloat(data.field2 ?? data.longitude ?? data.lon ?? data.lng);
    }

    if (!isFinite(lat) || !isFinite(lng)) {
      alert('Không tìm thấy dữ liệu vị trí hợp lệ trong Thingspeak.');
      return;
    }

    const deviceId = channelID;
    const res = await saveParking({ deviceId, lat, lng });

    if (res && res.message) {
      alert('Lưu chỗ đỗ thành công (từ Thingspeak)');
    } else {
      alert('Lưu chỗ đỗ: phản hồi không như mong đợi');
    }
  } catch (err) {
    console.error(err);
    alert('Lỗi khi lấy dữ liệu Thingspeak: ' + err.message);
  }
};
