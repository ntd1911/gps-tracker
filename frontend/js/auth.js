// Simple auth UI handlers
function showLogin() {
  document.getElementById('authPage').style.display = 'flex';
  document.getElementById('loginSection').style.display = 'block';
  document.getElementById('registerSection').style.display = 'none';
  document.getElementById('appPage').style.display = 'none';
}

function showRegister() {
  document.getElementById('authPage').style.display = 'flex';
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('registerSection').style.display = 'block';
  document.getElementById('appPage').style.display = 'none';
}

function showAppPage() {
  document.getElementById('authPage').style.display = 'none';
  document.getElementById('appPage').style.display = 'block';
  const username = localStorage.getItem('username');
  if (username) {
    const currentUser = document.getElementById('currentUser');
    if (currentUser) currentUser.innerText = username;
  }
  // ensure map is initialized and invalidated after page becomes visible
  try {
    if (typeof initializeMap === 'function') initializeMap();
    setTimeout(() => {
      if (window.map && typeof window.map.invalidateSize === 'function') window.map.invalidateSize();
    }, 150);
  } catch (e) { console.error(e); }
}

window.register = async function () {
  const username = document.getElementById('regUsername').value;
  const password = document.getElementById('regPassword').value;
  if (!username || !password) return alert('Nhập username và password');
  const res = await registerUser({ username, password });
  if (res && res.message) {
    alert(res.message);
    showLogin();
  }
};

window.login = async function () {
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  if (!username || !password) return alert('Nhập username và password');

  const res = await loginUser({ username, password });
  if (res && res.token) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('userId', res.userId);
    localStorage.setItem('username', res.username);
    alert('Đăng nhập thành công');
    showAppPage();
    if (window.loadUserDevices) window.loadUserDevices();
  } else {
    alert(res.message || 'Đăng nhập thất bại');
  }
};

window.logout = function () {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('username');
  alert('Đã đăng xuất');
  if (window.renderDevices) window.renderDevices([]);
  showLogin();
};

window.initializeAuth = function () {
  if (localStorage.getItem('token')) {
    showAppPage();
    if (window.loadUserDevices) window.loadUserDevices();
  } else {
    showLogin();
  }
};
