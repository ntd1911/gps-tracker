async function loadHistory() {

  try {

    const selectedDate =
      document.getElementById("historyDate").value;

    if (!selectedDate) {

      alert("Chọn ngày trước");

      return;
    }

    const response = await fetch(
      `https://api.thingspeak.com/channels/${channelID}/feeds.json?results=8000`
    );

    const data =
      await response.json();

    const feeds =
      data.feeds;

    historyMode = true;

    historyPoints = [];

    const historyBox =
      document.getElementById("historyBox");

    historyBox.innerHTML = "";

    feeds.forEach(feed => {

      const lat =
        parseFloat(feed.field1);

      const lng =
        parseFloat(feed.field2);

      const speed =
        feed.field3 || "0";

      if (
        isNaN(lat) ||
        isNaN(lng) ||
        lat === 0 ||
        lng === 0
      ) return;

      const feedDate =
        new Date(feed.created_at);

      const dateString =
        feedDate.toISOString().split("T")[0];

      if (dateString === selectedDate) {

        historyPoints.push([lat, lng]);

        const time =
          feedDate.toLocaleTimeString("vi-VN");

        const item =
          document.createElement("div");

        item.className =
          "history-item";

        item.innerHTML = `
          <b>${time}</b><br>
          Speed: ${speed} km/h<br>
          Lat: ${lat.toFixed(5)}<br>
          Lng: ${lng.toFixed(5)}
        `;

        item.onclick = () => {

          map.setView(
            [lat, lng],
            18
          );

          marker.setLatLng(
            [lat, lng]
          );
        };

        historyBox.appendChild(item);
      }
    });

    if (historyPoints.length === 0) {

      alert("Không có dữ liệu");

      return;
    }

    await drawRealRoute(historyPoints);

    marker.setLatLng(
      historyPoints[
        historyPoints.length - 1
      ]
    );

    map.fitBounds(
      routeLine.getBounds()
    );

    statusElement.innerText =
      "HISTORY MODE";
    document.getElementById(
  "mapMode"
).innerText =
  "HISTORY";

document.getElementById(
  "totalPoints"
).innerText =
  historyPoints.length;

document.getElementById(
  "totalDistance"
).innerText =
  calculateDistance(
    historyPoints
  ) + " km";

    statusElement.style.color =
      "#facc15";

  }

  catch(err) {

    console.log(err);

    alert("Lỗi tải lịch sử");
  }
}