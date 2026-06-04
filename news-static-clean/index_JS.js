const DEFAULT_AVATAR='https://ts1.tc.mm.bing.net/th/id/R-C.5c5224bd34a0aee8c411509e0d154575?rik=4fXwdrQ3mRIlvw&riu=http%3a%2f%2fbpic.588ku.com%2felement_pic%2f01%2f55%2f09%2f4557474d965eb71.jpg&ehk=wlOkaUqmQA0OH26%2bPRQ4JBO3sk6Wv8ID%2flpRkImF23Y%3d&risl=&pid=ImgRaw&r=0';
const DEFAULT_BIO='\u8fd9\u4e2a\u4eba\u8fd8\u6ca1\u6709\u7b80\u4ecb\u54e6~';
function avatarHtml(u){var a=u.avatar||DEFAULT_AVATAR;return'<img src="'+a+'" alt="" style="width:24px;height:24px;border-radius:50%;vertical-align:middle;margin-right:4px;object-fit:cover">'}
function loadNav() {
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  const links = document.getElementById('navLinks');
  if (user) {
    links.innerHTML = '<a href=\"index.html\">首页</a><a href=\"dashboard.html\">后台管理</a><span style=\"color:rgba(255,255,255,.8)\">' + avatarHtml(user) + '欢迎, ' + user.username + '</span><a href=\"profile.html\" style=\"color:rgba(255,255,255,.8);text-decoration:none\">个人资料</a><a href=\"javascript:logout()\">退出</a>';
  } else {
    links.innerHTML = '<a href=\"index.html\">首页</a><a href=\"login.html\">登录</a><a href=\"register.html\">注册</a>';
  }
}

function logout() {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  }
}

async function getNews() {
  const res = await fetch('https://nanhu-news-api.workers.dev/api/news');
  return res.ok ? await res.json() : [];
}

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

function getFirstImage(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const img = tmp.querySelector('img');
  return img ? img.src : null;
}

async function render() {
  loadNav();
  const allNews = (await getNews()).sort((a, b) => b.createdAt - a.createdAt);
  const list = document.getElementById('newsList');
  if (allNews.length === 0) {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    list.innerHTML = '<div class=\"empty-state\"><p>暂无新闻</p>' + (user ? '<a href=\"create.html\" class=\"btn btn-primary\">发布第一条新闻</a>' : '<p><a href=\"register.html\">注册</a>后即可发布新闻</p>') + '</div>';
    document.getElementById('pagination').innerHTML = '';
    return;
  }
  // 全部展示，滚动信息流
  list.innerHTML = allNews.map(n => {
    const plainText = stripHtml(n.content);
    const imgSrc = getFirstImage(n.content);
    const imgHtml = imgSrc
      ? '<div class=\"news-card-image\"><img src=\"' + imgSrc + '\" alt=\"新闻配图\" loading=\"lazy\"></div>'
      : '';
    return '<article class=\"news-card\" onclick="location.href=\'view.html?id=' + n.id + '\'" style="cursor:pointer">' +
      imgHtml +
      '<div class=\"news-card-body\">' +
      '<h2>' + n.title + '</h2>' +
      '<div class=\"news-meta\">作者: ' + n.authorName + ' | ' + new Date(n.createdAt).toLocaleString('zh-CN') + '</div>' +
      '<p class=\"news-summary\">' + plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '') + '</p>' +
      '<span class=\"btn btn-link\">阅读全文</span>' +
      '</div>' +
      '</article>';
  }).join('');
}

render();
