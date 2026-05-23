async function postAPI(url, data) {
  const res = await fetch(CONFIG.API_BASE_URL + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.json();
}

async function getAPI(url) {
  const res = await fetch(CONFIG.API_BASE_URL + url);
  return res.json();
}