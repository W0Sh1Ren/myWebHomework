const DEFAULT_AVATAR='https://ts1.tc.mm.bing.net/th/id/R-C.5c5224bd34a0aee8c411509e0d154575?rik=4fXwdrQ3mRIlvw&riu=http%3a%2f%2fbpic.588ku.com%2felement_pic%2f01%2f55%2f09%2f4557474d965eb71.jpg&ehk=wlOkaUqmQA0OH26%2bPRQ4JBO3sk6Wv8ID%2flpRkImF23Y%3d&risl=&pid=ImgRaw&r=0';
const DEFAULT_BIO='\u8fd9\u4e2a\u4eba\u8fd8\u6ca1\u6709\u7b80\u4ecb\u54e6~';
function avatarHtml(u){var a=u.avatar||DEFAULT_AVATAR;return'<img src="'+a+'" alt="" style="width:24px;height:24px;border-radius:50%;vertical-align:middle;margin-right:4px;object-fit:cover">'}
function checkAuth() {
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (!user) { window.location.href = 'login.html'; return null; }
  return user;
}

function loadNav() {
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  document.getElementById('navLinks').innerHTML = user
    ? '<a href=\"index.html\">首页</a><a href=\"dashboard.html\">后台管理</a><span style=\"color:rgba(255,255,255,.8)\">' + avatarHtml(user) + '欢迎, ' + user.username + '</span><a href=\"profile.html\" style=\"color:rgba(255,255,255,.8);text-decoration:none\">个人资料</a><a href=\"javascript:logout()\">退出</a>'
    : '<a href=\"index.html\">首页</a><a href=\"login.html\">登录</a><a href=\"register.html\">注册</a>';
}

function logout() { if (confirm('确定要退出登录吗？')) { localStorage.removeItem('currentUser'); window.location.href = 'index.html'; } }

async function render() {
  const user = checkAuth();
  if (!user) return;
  loadNav();
  const res = await fetch('https://mynewswork.3454381311.workers.dev/api/news');
  const allNews = (res.ok ? await res.json() : []).filter(n => n.authorId === user.id).sort((a, b) => b.createdAt - a.createdAt);
  const el = document.getElementById('dashboardContent');
  if (allNews.length === 0) {
    el.innerHTML = '<div class=\"empty-state\"><p>还没有发布过新闻</p><a href=\"create.html\" class=\"btn btn-primary\">发布第一条新闻</a></div>';
    return;
  }
  el.innerHTML = '<table class=\"table\"><thead><tr><th>标题</th><th>发布时间</th><th>操作</th></tr></thead><tbody>' +
    allNews.map(n =>
      '<tr><td><a href=\"view.html?id=' + n.id + '\">' + n.title + '</a></td>' +
      '<td>' + new Date(n.createdAt).toLocaleString('zh-CN') + '</td>' +
      '<td><a href=\"edit.html?id=' + n.id + '\" class=\"btn btn-sm\">编辑</a> ' +
      '<button class=\"btn btn-sm btn-danger\" onclick=\"delNews(' + n.id + ')\">删除</button></td></tr>'
    ).join('') + '</tbody></table>';
}

async function delNews(id) {
  if (!confirm('确定要删除这篇新闻吗？')) return;
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const res = await fetch('https://mynewswork.3454381311.workers.dev/api/news/' + id, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + (user ? user.token : '') }
  });
  if (res.ok) render(); else alert('删除失败');
}

render();
