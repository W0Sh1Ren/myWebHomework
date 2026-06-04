const DEFAULT_AVATAR='https://ts1.tc.mm.bing.net/th/id/R-C.5c5224bd34a0aee8c411509e0d154575?rik=4fXwdrQ3mRIlvw&riu=http%3a%2f%2fbpic.588ku.com%2felement_pic%2f01%2f55%2f09%2f4557474d965eb71.jpg&ehk=wlOkaUqmQA0OH26%2bPRQ4JBO3sk6Wv8ID%2flpRkImF23Y%3d&risl=&pid=ImgRaw&r=0';
const DEFAULT_BIO='\u8fd9\u4e2a\u4eba\u8fd8\u6ca1\u6709\u7b80\u4ecb\u54e6~';
function avatarHtml(u){var a=u.avatar||DEFAULT_AVATAR;return'<img src="'+a+'" alt="" style="width:24px;height:24px;border-radius:50%;vertical-align:middle;margin-right:4px;object-fit:cover">'}
function loadNav() {
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  document.getElementById('navLinks').innerHTML = user
    ? '<a href=\"index.html\">首页</a><a href=\"dashboard.html\">后台管理</a><span style=\"color:rgba(255,255,255,.8)\">' + avatarHtml(user) + '欢迎, ' + user.username + '</span><a href=\"profile.html\" style=\"color:rgba(255,255,255,.8);text-decoration:none\">个人资料</a><a href=\"javascript:logout()\">退出</a>'
    : '<a href=\"index.html\">首页</a><a href=\"login.html\">登录</a><a href=\"register.html\">注册</a>';
}

function logout() { if (confirm('确定要退出登录吗？')) { localStorage.removeItem('currentUser'); window.location.href = 'index.html'; } }

loadNav();

const id = parseInt(new URLSearchParams(location.search).get('id'));
const el = document.getElementById('newsDetail');

(async () => {
  const res = await fetch('https://mynewswork.3454381311.workers.dev/api/news/' + id);
  const news = res.ok ? await res.json() : null;

  if (!news) {
    el.innerHTML = '<h1>新闻不存在</h1><p>请返回首页查看其他新闻</p><div class=\"news-footer\"><a href=\"index.html\" class=\"btn btn-link\">&laquo; 返回首页</a></div>';
  } else {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    el.innerHTML = '<h1>' + news.title + '</h1><div class="news-meta">作者: ' + news.authorName + ' | 发布时间: ' + new Date(news.createdAt).toLocaleString('zh-CN') + '</div><div class="news-content">' + news.content + '</div><div class="news-footer"><a href="index.html" class="btn btn-link">&laquo; 返回首页</a>' + (user && user.id === news.authorId ? '<a href="edit.html?id=' + news.id + '" class="btn">编辑</a>' : '') + '</div>';
  }
})();
