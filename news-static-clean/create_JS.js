const DEFAULT_AVATAR='https://ts1.tc.mm.bing.net/th/id/R-C.5c5224bd34a0aee8c411509e0d154575?rik=4fXwdrQ3mRIlvw&riu=http%3a%2f%2fbpic.588ku.com%2felement_pic%2f01%2f55%2f09%2f4557474d965eb71.jpg&ehk=wlOkaUqmQA0OH26%2bPRQ4JBO3sk6Wv8ID%2flpRkImF23Y%3d&risl=&pid=ImgRaw&r=0';
const DEFAULT_BIO='\u8fd9\u4e2a\u4eba\u8fd8\u6ca1\u6709\u7b80\u4ecb\u54e6~';
function avatarHtml(u){var a=u.avatar||DEFAULT_AVATAR;return'<img src="'+a+'" alt="" style="width:24px;height:24px;border-radius:50%;vertical-align:middle;margin-right:4px;object-fit:cover">'}
function checkAuth() {
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  if (!user) { window.location.href = 'login.html'; return null; }
  return user;
}

function logout() { if (confirm('确定要退出登录吗？')) { localStorage.removeItem('currentUser'); window.location.href = 'index.html'; } }

const user = checkAuth();
if (user) {
  document.getElementById('navLinks').innerHTML =
    '<a href=\"index.html\">首页</a><a href=\"dashboard.html\">后台管理</a>' +
    '<span style=\"color:rgba(255,255,255,.8)\">' + avatarHtml(user) + '欢迎, ' + user.username + '</span>' +
    '<a href=\"profile.html\" style=\"color:rgba(255,255,255,.8);text-decoration:none\">个人资料</a>' +
    '<a href=\"javascript:logout()\">退出</a>';
}

const API_URL = 'https://api.deepseek.com/v1/chat/completions';
const MODEL = 'deepseek-chat';

function getApiKey() {
  let key = localStorage.getItem('deepseek_api_key');
  if (!key) {
    key = prompt('请输入你的 DeepSeek API Key：\n（输入一次后会自动保存）');
    if (key && key.trim()) { localStorage.setItem('deepseek_api_key', key.trim()); return key.trim(); }
    return null;
  }
  return key;
}

function showAiStatus(msg, isError) {
  const el = document.getElementById('aiStatus');
  el.textContent = msg; el.style.display = 'block';
  el.className = 'alert ' + (isError ? 'alert-error' : 'alert-info');
}

async function generateByAI() {
  const btn = document.getElementById('aiBtn');
  const title = document.getElementById('title').value.trim();
  if (!title) { showAiStatus('请先填写新闻标题', true); document.getElementById('title').focus(); return; }
  const apiKey = getApiKey();
  if (!apiKey) { showAiStatus('需要 API Key', true); return; }
  btn.disabled = true; btn.textContent = '生成中...';
  showAiStatus('正在生成新闻内容...', false);
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + apiKey },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: '你是一个新闻编辑。根据标题生成一篇完整的新闻报道。要求内容真实客观、语言正式、段落分明、不少于300字。直接用正文回复，不要加标题。' },
          { role: 'user', content: '请根据以下标题生成新闻内容：' + title }
        ],
        temperature: 0.7, max_tokens: 2000
      })
    });
    if (!res.ok) throw new Error('请求失败: ' + res.status);
    const data = await res.json();
    const content = data.choices[0].message.content;
    // 在光标位置插入 AI 生成的内容，不覆盖已有内容
    insertAtCursor(content);
    showAiStatus('AI 帮写完成！', false);
  } catch (err) { showAiStatus('帮写出错: ' + err.message, true); }
  finally { btn.disabled = false; btn.textContent = 'AI 帮写'; }
}

function insertAtCursor(html) {
  const editor = document.getElementById('content');
  editor.focus();
  document.execCommand('insertHTML', false, html);
}

function insertImageUrl() {
  const url = prompt('请输入图片 URL 地址：');
  if (!url || !url.trim()) return;
  const trimmed = url.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:')) {
    showAiStatus('请输入有效的图片 URL', true);
    return;
  }
  const imgHtml = '<img src="' + trimmed + '" style="max-width:100%;border-radius:4px;margin:8px 0" alt="图片">';
  insertAtCursor(imgHtml);
  showAiStatus('图片已插入', false);
}

function uploadImage(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    showAiStatus('图片超过 5MB', true);
    input.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 800, QUALITY = 0.7;
      let width = img.width, height = img.height;
      if (width > MAX_WIDTH) {
        height = Math.round(height * MAX_WIDTH / width);
        width = MAX_WIDTH;
      }
      canvas.width = width; canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL('image/jpeg', QUALITY);
      const imgHtml = '<img src="' + compressed + '" style="max-width:100%;border-radius:4px;margin:8px 0" alt="图片">';
      insertAtCursor(imgHtml);
      showAiStatus('图片已压缩插入', false);
    };
    img.src = e.target.result;
  };
  reader.onerror = function() { showAiStatus('图片读取失败', true); };
  reader.readAsDataURL(file);
  input.value = '';
}

async function handleCreate(e) {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').innerHTML.trim();
  if (!title || !content) {
    document.getElementById('error').textContent = '请填写标题和内容';
    document.getElementById('error').style.display = 'block';
    return;
  }
  // 调用后端 API 发布新闻
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const res = await fetch('https://mynewswork.3454381311.workers.dev/api/news', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (user ? user.token : '') },
    body: JSON.stringify({ title: title, content: content })
  });
  if (res.ok) { window.location.href = 'dashboard.html'; }
  else { const d = await res.json(); alert(d.error || '发布失败'); }
}
