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

// Save parking helper
async function saveParking(payload) {
  return postAPI('/parking/save', payload);
}

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: 'Bearer ' + token } : {};
}

async function postAuth(url, data) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, getAuthHeaders());
  const res = await fetch(CONFIG.API_BASE_URL + url, {
    method: 'POST',
    headers,
    body: JSON.stringify(data)
  });
  return res.json();
}

async function getAuth(url) {
  const headers = getAuthHeaders();
  const res = await fetch(CONFIG.API_BASE_URL + url, { headers });
  return res.json();
}

// Auth
async function registerUser(payload) {
  return postAPI('/auth/register', payload);
}

async function loginUser(payload) {
  return postAPI('/auth/login', payload);
}

// Devices
async function addDevice(payload) {
  return postAuth('/device/add', payload);
}

async function getMyDevices() {
  return getAuth('/device/me');
}