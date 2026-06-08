window.savePhoneNumber = async function () {
  const phoneNumber = document.getElementById('phoneNumberInput').value.trim();
  if (!phoneNumber) {
    return alert('Vui lòng nhập số điện thoại');
  }

  try {
    const res = await savePhone({ phoneNumber });
    if (res && res.message) {
      alert(res.message);
      document.getElementById('phoneNumberInput').value = '';
    } else {
      alert('Lưu số điện thoại thất bại');
    }
  } catch (err) {
    console.error(err);
    alert('Lỗi khi gửi số điện thoại: ' + (err.message || err));
  }
};
