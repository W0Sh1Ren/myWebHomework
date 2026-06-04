const DEFAULT_AVATAR='https://ts1.tc.mm.bing.net/th/id/R-C.5c5224bd34a0aee8c411509e0d154575?rik=4fXwdrQ3mRIlvw&riu=http%3a%2f%2fbpic.588ku.com%2felement_pic%2f01%2f55%2f09%2f4557474d965eb71.jpg&ehk=wlOkaUqmQA0OH26%2bPRQ4JBO3sk6Wv8ID%2flpRkImF23Y%3d&risl=&pid=ImgRaw&r=0';
const DEFAULT_BIO='\u8fd9\u4e2a\u4eba\u8fd8\u6ca1\u6709\u7b80\u4ecb\u54e6~';
async function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const errEl = document.getElementById('error');
  if (!username || !password || !confirmPassword) {
    errEl.textContent = '请填写所有字段';
    errEl.style.display = 'block';
    return;
  }
  if (password.length < 6) {
    errEl.textContent = '密码长度至少6位';
    errEl.style.display = 'block';
    return;
  }
  if (password !== confirmPassword) {
    errEl.textContent = '两次密码输入不一致';
    errEl.style.display = 'block';
    return;
  }
  try {
    const res = await fetch('https://mynewswork.3454381311.workers.dev/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) { errEl.textContent = data.error; errEl.style.display = 'block'; return; }
    window.location.href = 'login.html';
  } catch (err) { errEl.textContent = '网络错误，请检查网络连接'; errEl.style.display = 'block'; }
}