const DEFAULT_AVATAR='https://ts1.tc.mm.bing.net/th/id/R-C.5c5224bd34a0aee8c411509e0d154575?rik=4fXwdrQ3mRIlvw&riu=http%3a%2f%2fbpic.588ku.com%2felement_pic%2f01%2f55%2f09%2f4557474d965eb71.jpg&ehk=wlOkaUqmQA0OH26%2bPRQ4JBO3sk6Wv8ID%2flpRkImF23Y%3d&risl=&pid=ImgRaw&r=0';
const DEFAULT_BIO='\u8fd9\u4e2a\u4eba\u8fd8\u6ca1\u6709\u7b80\u4ecb\u54e6~';
function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const errEl = document.getElementById('error');
  if (!username || !password) {
    errEl.textContent = '请填写用户名和密码';
    errEl.style.display = 'block';
    return;
  }
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    errEl.textContent = '用户名或密码错误';
    errEl.style.display = 'block';
    return;
  }
  localStorage.setItem('currentUser', JSON.stringify({ id: user.id, username: user.username, avatar: user.avatar || DEFAULT_AVATAR, bio: user.bio || DEFAULT_BIO }));
  window.location.href = 'dashboard.html';
}
