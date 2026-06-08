async function loadHistory() {

  try {

    // Support searching by date range (datetime) or by a single date.
    const startVal = document.getElementById("historyStart")?.value;
    const endVal = document.getElementById("historyEnd")?.value;
    const selectedDate = document.getElementById("historyDate")?.value;

    if (!startVal && !endVal && !selectedDate) {
      alert("Chọn ngày hoặc khoảng thời gian trước");
      return;
    }

    let startTime = null;
    let endTime = null;

    if (startVal || endVal) {
      if (startVal) startTime = new Date(startVal);
      if (endVal) endTime = new Date(endVal);
      // If only one bound provided, use same moment for the other bound
      if (!startTime && endTime) startTime = new Date(endTime.getTime());
      if (!endTime && startTime) endTime = new Date(startTime.getTime());
    } else {
      // Use whole-day range for selected date
      startTime = new Date(selectedDate + 'T00:00:00');
      endTime = new Date(selectedDate + 'T23:59:59');
    }

    // Lấy channel của thiết bị đang được tick chọn.
    // Nếu không có thiết bị nào được chọn, dùng channelID mặc định từ config.js
    const checkedBox = document.querySelector('input[type="checkbox"][data-channel]:checked');
    const activeChannel = checkedBox ? checkedBox.getAttribute('data-channel') : channelID;

    const response = await fetch(
      `https://api.thingspeak.com/channels/${activeChannel}/feeds.json?results=8000`
    );

    const data = await response.json();
    const feeds = data.feeds;

    historyMode = true;
    historyPoints = [];

    const historyBox = document.getElementById("historyBox");
    historyBox.innerHTML = "";

    feeds.forEach(feed => {

      const lat = parseFloat(feed.field1);
      const lng = parseFloat(feed.field2);
      const speed = feed.field3 || "0";

      if (isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) return;

      const feedDate = new Date(feed.created_at);

      // Filter by selected time range
      if (feedDate < startTime || feedDate > endTime) return;

        historyPoints.push([lat, lng]);

        // Format date and time as YYYY-MM-DD HH:MM:SS
        const yyyy = feedDate.getFullYear();
        const mo = String(feedDate.getMonth() + 1).padStart(2, '0');
        const dd = String(feedDate.getDate()).padStart(2, '0');
        const hh = String(feedDate.getHours()).padStart(2, '0');
        const mm = String(feedDate.getMinutes()).padStart(2, '0');
        const ss = String(feedDate.getSeconds()).padStart(2, '0');
        const dateTime = `${yyyy}-${mo}-${dd} ${hh}:${mm}:${ss}`;
        const item = document.createElement("div");
        item.className = "history-item";
        item.innerHTML = `
          <b>${dateTime}</b><br>
          Speed: ${speed} km/h<br>
          Lat: ${lat.toFixed(5)}<br>
          Lng: ${lng.toFixed(5)}
        `;

        item.onclick = () => {
          window.map.setView([lat, lng], 18);
          window.marker.setLatLng([lat, lng]);
        };

        historyBox.appendChild(item);
    });

    if (historyPoints.length === 0) {
      alert("Không có dữ liệu cho ngày này");
      historyMode = false;
      return;
    }

    await drawRealRoute(historyPoints);

    window.marker.setLatLng(historyPoints[historyPoints.length - 1]);
    window.map.fitBounds(window.routeLine.getBounds());

    statusElement.innerText = "HISTORY MODE";
    statusElement.style.color = "#facc15";

    document.getElementById("mapMode").innerText = "HISTORY";
    document.getElementById("totalPoints").innerText = historyPoints.length;
    document.getElementById("totalDistance").innerText =
      calculateDistance(historyPoints) + " km";

  } catch (err) {

    console.error(err);
    alert("Lỗi tải lịch sử");
  }
}
