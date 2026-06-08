window.savePhoneNumber = async function () {
  const phoneNumber = document.getElementById('phoneNumberInput').value.trim();
  if (!phoneNumber) {
    return alert('Vui lòng nhập số điện thoại');
  }

  try {
    const res = await savePhone({ phoneNumber });
    if (res && res.message) {
      // show inline status instead of alert
      const statusEl = document.getElementById('savedPhoneStatus');
      if (statusEl) statusEl.innerText = 'Đã lưu: ' + phoneNumber;
      document.getElementById('phoneNumberInput').value = '';
    } else {
      alert('Lưu số điện thoại thất bại');
    }
  } catch (err) {
    console.error(err);
    alert('Lỗi khi gửi số điện thoại: ' + (err.message || err));
  }
};

window.clearSavedPhone = function () {
  const statusEl = document.getElementById('savedPhoneStatus');
  if (statusEl) statusEl.innerText = 'Chưa có số được lưu';
  // Optionally call backend to remove saved phone (not implemented)
};
