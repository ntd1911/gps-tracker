if (window.initializeAuth) {
  window.initializeAuth();
}

loadGPS();
setInterval(loadGPS,15000);