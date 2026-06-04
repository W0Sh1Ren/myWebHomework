/**
 * edit_JS.js - 编辑新闻页
 * 功能：通过 URL 参数 ?id=xxx 获取要编辑的新闻
 * 预填充原标题和内容，提供修改表单
 */

// =================== 常量定义 ===================

/**
 * DEFAULT_AVATAR（常量）—— 用户没有设置头像时显示的默认头像图片地址
 * 这是一个网络图片 URL（统一资源定位符），指向一个默认头像
 * const：ES6 关键字，表示常量，一旦赋值后不可修改
 */
const DEFAULT_AVATAR = 'https://ts1.tc.mm.bing.net/th/id/R-C.5c5224bd34a0aee8c411509e0d154575?rik=4fXwdrQ3mRIlvw&riu=http%3a%2f%2fbpic.588ku.com%2felement_pic%2f01%2f55%2f09%2f4557474d965eb71.jpg&ehk=wlOkaUqmQA0OH26%2bPRQ4JBO3sk6Wv8ID%2flpRkImF23Y%3d&risl=&pid=ImgRaw&r=0';

/**
 * DEFAULT_BIO（常量）—— 用户没有填写个人简介时显示的默认文本
 * 字符串：用引号包裹的一串文字
 */
const DEFAULT_BIO = '这个人还没有简介哦~';

// =================== 工具函数 ===================

/**
 * avatarHtml - 生成用户头像的 HTML 图片标签字符串
 * 功能：根据传入的 user 对象，返回一段 <img> 的 HTML 代码
 *       如果 user 没有头像就用默认头像
 *
 * @param {Object} user - 用户对象，包含用户信息
 *   user.avatar {string|undefined} - 用户头像的图片 URL，可能为空/未定义
 * @returns {string} 一段 HTML 字符串，表示一个带样式的圆形头像图片标签
 *   返回值示例：'<img src="https://..." alt="" style="...">'
 */
function avatarHtml(user) {
  /* 如果 user.avatar 存在（有值），就用它；否则用 DEFAULT_AVATAR 常量 */
  const avatarUrl = user.avatar || DEFAULT_AVATAR;
  /**
   * 返回拼接好的 <img> 标签字符串
   * 拼接字符串：用加号（+）把多段文本连接在一起
   * 各样式说明：
   *   width:24px;height:24px     —— 图片宽高 24 像素
   *   border-radius:50%          —— 圆形裁切（圆角50%变为圆形）
   *   vertical-align:middle       —— 垂直居中对齐
   *   margin-right:4px            —— 右侧留 4 像素间距
   *   object-fit:cover            —— 图片按比例缩放填满容器（超出部分裁切）
   */
  return '<img src="' + avatarUrl + '" alt="" style="width:24px;height:24px;border-radius:50%;vertical-align:middle;margin-right:4px;object-fit:cover">';
} /* --- avatarHtml 函数结束 --- */

// =================== 登录与权限检查 ===================

/**
 * checkAuth - 检查用户是否已登录
 * 功能：从浏览器的 localStorage（本地存储）中读取当前登录用户信息
 *       如果没登录就跳转到登录页面
 * 专业术语解释：
 *   - localStorage：浏览器提供的永久存储空间，关闭网页后数据仍保留
 *   - JSON.parse：把 JSON 字符串（一种数据交换格式）转换成 JavaScript 对象
 *   - JSON 格式示例：'{"username":"张三","id":1}' → 解析后变成 {username:"张三", id:1}
 *
 * @returns {Object|null} 如果已登录返回用户对象；如果未登录返回 null
 *   用户对象包含 username（用户名）、id（用户ID）、avatar（头像）等字段
 */
function checkAuth() {
  /**
   * localStorage.getItem('currentUser')：从浏览器本地存储中取出 key 为 'currentUser' 的数据
   * 如果取不到（用户未登录），getItem 返回 null
   * 用 || 'null' 把 null 变成字符串 'null'，这样 JSON.parse 不会报错
   * JSON.parse(...) 把存储的 JSON 字符串解析回 JavaScript 对象
   * 最终 user 要么是用户对象，要么是 null
   */
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
  /* 如果没有用户（user 为 null 或 false），表示未登录 */
  if (!user) {
    window.location.href = 'login.html';  /* 浏览器跳转到登录页面 */
    return null;                           /* 返回 null，调用者知道未登录 */
  } /* --- 未登录处理结束 --- */
  return user;  /* 已登录，返回用户对象 */
} /* --- checkAuth 函数结束 --- */

/**
 * logout - 退出登录
 * 功能：弹出确认框询问用户是否确认退出
 *       如果用户点击"确定"，清除本地存储中的登录信息和当前用户数据，跳转到首页
 * 专业术语解释：
 *   - confirm()：浏览器弹出一个"确定/取消"对话框，点击确定返回 true，取消返回 false
 *   - localStorage.removeItem()：从浏览器本地存储中删除指定 key 的数据
 */
function logout() {
  /* confirm() 弹出确认对话框，如果用户点"确定"则执行大括号内的代码 */
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('currentUser');  /* 清除本地存储中的当前用户信息 */
    window.location.href = 'index.html';      /* 跳转到首页 index.html */
  } /* --- 确认退出处理结束 --- */
} /* --- logout 函数结束 --- */

// =================== 页面初始化 ===================

/**
 * user（变量）—— 当前登录的用户信息
 * 调用 checkAuth() 检查是否登录，返回值赋给 user
 * let/const 的区别：let 声明的变量可以重新赋值，const 不可以
 * 此处用 const 因为后面不会改变 user 的值
 */
const user = checkAuth();

/**
 * if (user) —— 如果用户已登录（user 不为 null）
 * 则动态渲染导航栏，将导航栏的 HTML 内容替换为包含用户信息的版本
 * document.getElementById('navLinks')：通过元素 id 获取页面上的 DOM 元素
 * .innerHTML：元素的内部 HTML 内容，给它赋值会改变页面显示的内容
 */
if (user) {
  /* 拼接导航栏的 HTML 字符串，赋值给 id 为 navLinks 的元素的 innerHTML */
  document.getElementById('navLinks').innerHTML =
    /* 首页链接 */
    '<a href="index.html">首页</a>' +
    /* 后台管理链接 */
    '<a href="dashboard.html">后台管理</a>' +
    /* 用户信息区域：调用 avatarHtml(user) 生成头像图片，显示用户名 */
    '<span style="color:rgba(255,255,255,.8)">' + avatarHtml(user) + '欢迎, ' + user.username + '</span>' +
    /* 个人资料链接 */
    '<a href="profile.html" style="color:rgba(255,255,255,.8);text-decoration:none">个人资料</a>' +
    /* 退出登录链接：href="javascript:logout()" 表示点击时执行 logout() 函数 */
    '<a href="javascript:logout()">退出</a>';
} /* --- 导航栏渲染结束 --- */

// =================== 获取新闻 ID ===================

/**
 * URLSearchParams —— 浏览器内置 API，用于解析 URL 中的查询参数
 * location.search：当前页面的 URL 中 "?" 及其后面的部分，例如 "?id=3"
 * .get('id')：获取名为 "id" 的参数值，返回字符串，如 "3"
 * parseInt()：把字符串转换为整数，例如 "3" → 3
 * id（变量）—— 要编辑的新闻的 ID（数字）
 */
const id = parseInt(new URLSearchParams(location.search).get('id'));

// =================== 查找要编辑的新闻 ===================

/**
 * news（变量）—— 找到的要编辑的新闻对象
 * 查找逻辑：
 *   1. localStorage.getItem('news') —— 从本地存储获取所有新闻的 JSON 字符串
 *      || '[]'：如果取不到（没有新闻数据），默认使用空数组字符串 '[]'
 *   2. JSON.parse(...) —— 把 JSON 字符串解析为 JavaScript 数组
 *   3. .find(n => ...) —— 数组的 find 方法，遍历数组，找到第一个符合条件的元素
 *      n => n.id === id && n.authorId === user.id 是一个箭头函数
 *      - 箭头函数：一种简洁的函数写法，n 是参数（代表数组中的每个新闻对象）
 *      - n.id === id：新闻的 id 必须等于 URL 中的 id
 *      - n.authorId === user.id：新闻的作者 ID 必须等于当前登录用户的 ID
 *    两者都满足才返回该新闻，确保只能编辑自己发布的新闻
 *    如果没找到，返回 undefined（未定义）
 */
const news = JSON.parse(localStorage.getItem('news') || '[]').find(n => n.id === id && n.authorId === user.id);

/**
 * 安全检查：如果找不到符合条件的新闻（不是自己发布的，或该 ID 不存在）
 * 则浏览器跳转到后台管理页面，不让用户继续编辑
 * 这是一种权限控制，防止用户通过修改 URL 参数编辑别人的文章
 */
if (!news) {
  window.location.href = 'dashboard.html';  /* 跳转到后台管理页面 */
} /* --- 权限检查结束 --- */

// =================== 预填充表单 ===================

/**
 * 将找到的新闻的原始标题和内容填入编辑表单
 * document.getElementById('title')：找到标题输入框元素
 * .value：表单元素的值（用户输入的内容）
 * 这里把 news.title（新闻原标题）赋给输入框，用户可以看到原来的标题
 */
document.getElementById('title').value = news.title;

/**
 * document.getElementById('content')：找到内容编辑区域（富文本编辑器）
 * .innerHTML：元素的内部 HTML 内容（可以包含加粗、图片等格式）
 * 这里把 news.content（新闻原内容 HTML）赋给编辑器
 * 用户可以看到原来的内容，并在此基础上修改
 */
document.getElementById('content').innerHTML = news.content;

// =================== 编辑提交处理 ===================

/**
 * handleEdit - 处理编辑表单的提交
 * 功能：当用户点击"保存修改"按钮时触发
 *       获取表单中新输入的标题和内容，更新 localStorage 中的数据，然后跳回后台管理页
 * 专业术语解释：
 *   - e.preventDefault()：阻止表单的默认提交行为（页面刷新），让我们用 JavaScript 自定义处理
 *   - .trim()：去掉字符串首尾的空白字符（空格、换行等）
 *
 * @param {Event} e - 事件对象，由浏览器自动传入，包含事件相关信息
 *   这里的 e 是表单提交事件（submit event）
 * @returns {void} 没有返回值
 */
function handleEdit(e) {
  /* 阻止表单默认提交行为，防止页面刷新 */
  e.preventDefault();

  /**
   * 获取用户输入的标题，并去掉首尾空格
   * .value：获取输入框的当前值
   * .trim()：去掉字符串两端的空格
   */
  const title = document.getElementById('title').value.trim();

  /**
   * 获取编辑器中的内容（含 HTML 标签），并去掉首尾空格
   * .innerHTML 获取的是富文本内容，可能包含 <p>、<b>、<img> 等标签
   * 注意：这里用 innerHTML 而不是 value，因为 content 是一个可编辑的 div（富文本编辑器），不是 textarea
   */
  const content = document.getElementById('content').innerHTML.trim();

  /**
   * 表单验证：检查标题和内容是否为空
   * !title：如果 title 为空字符串（长度为0），!title 为 true
   * !content：同理
   * 如果为空，显示错误提示信息，不执行保存操作
   */
  if (!title || !content) {
    /* 设置错误提示元素的文本内容 */
    document.getElementById('error').textContent = '请填写标题和内容';
    /* 让错误提示元素显示出来（原来是隐藏的） */
    document.getElementById('error').style.display = 'block';
    /* 提前返回，不执行后面的保存逻辑 */
    return;
  } /* --- 表单验证结束 --- */

  /**
   * 从 localStorage 中获取所有新闻数据
   * 注意：这里重新获取一次，因为其他操作可能已经修改了数据
   * 确保我们操作的是最新的数据
   * allNews（变量）—— 存储所有新闻的数组
   */
  let allNews = JSON.parse(localStorage.getItem('news') || '[]');

  /**
   * findIndex —— 数组方法，返回第一个满足条件的元素的索引（位置）
   * findIndex(n => n.id === id)：找到数组中 id 等于变量 id 的新闻
   *   如果找到，返回该元素在数组中的位置（从0开始计数）
   *   如果没找到，返回 -1
   * idx（变量）—— 要修改的新闻在数组中的索引位置
   */
  const idx = allNews.findIndex(n => n.id === id);

  /* 如果找到了该新闻（idx 不等于 -1），则更新它的标题和内容 */
  if (idx !== -1) {
    allNews[idx].title = title;    /* 更新新闻标题为表单中输入的新标题 */
    allNews[idx].content = content; /* 更新新闻内容为编辑器中的新内容 */
  } /* --- 新闻更新结束 --- */

  /**
   * 将更新后的新闻数组保存回 localStorage
   * JSON.stringify(allNews)：把 JavaScript 数组转换为 JSON 字符串
   * localStorage.setItem('news', ...)：以 'news' 为 key 存储到本地存储
   * 这样数据就持久化了，下次页面加载时能读取到更新后的数据
   */
  localStorage.setItem('news', JSON.stringify(allNews));

  /**
   * 跳转回后台管理页面
   * window.location.href：浏览器的当前地址，给它赋值会让页面跳转
   */
  window.location.href = 'dashboard.html';
} /* --- handleEdit 函数结束 --- */

// =================== 插入图片 ===================

/**
 * insertAtCursor - 在编辑器当前光标位置插入 HTML 内容
 * 功能：获取富文本编辑器元素，让编辑器获得焦点（光标闪烁），然后在光标位置插入指定的 HTML
 * 专业术语解释：
 *   - document.execCommand('insertHTML', ...)：浏览器提供的命令 API，用于在可编辑区域执行操作
 *     第一个参数 'insertHTML' 表示"插入 HTML"，第二个参数是是否显示 UI（通常为 false），
 *     第三个参数是要插入的 HTML 字符串
 *     ⚠️ 注意：此 API 已被标记为废弃，但在大多数浏览器中仍然可用
 *
 * @param {string} html - 要插入的 HTML 字符串
 *   例如：'<img src="..." style="...">' 或 '<p>新段落</p>'
 * @returns {void} 没有返回值
 */
function insertAtCursor(html) {
  /* 获取 id 为 'content' 的富文本编辑器 DOM 元素 */
  const editor = document.getElementById('content');
  /* 让编辑器获得焦点（光标定位到编辑器内，准备输入） */
  editor.focus();
  /**
   * 使用浏览器命令在光标位置插入 HTML
   * 参数说明：
   *   'insertHTML'：命令名称，表示插入 HTML
   *   false：是否显示用户界面（设为 false 表示不显示）
   *   html：要插入的 HTML 内容
   */
  document.execCommand('insertHTML', false, html);
} /* --- insertAtCursor 函数结束 --- */

/**
 * insertImageUrl - 通过 URL 插入网络图片
 * 功能：弹出对话框让用户输入图片的网址，验证 URL 格式后生成 <img> 标签并插入编辑器
 * 专业术语解释：
 *   - prompt()：浏览器弹出输入对话框，用户输入内容后返回字符串，点击取消返回 null
 *   - URL 协议：http:// 和 https:// 是网络协议，data: 是内嵌数据协议
 *
 * @returns {void} 没有返回值
 */
function insertImageUrl() {
  /**
   * prompt() 弹出输入框，提示用户输入图片 URL
   * 多行字符串：用 \n（换行符）可以在提示文字中换行
   * url（变量）—— 用户输入的 URL 字符串，如果用户点击取消则为 null
   */
  const url = prompt('请输入图片的 URL 地址：\n（支持 https:// 开头的网络图片）');

  /**
   * 如果用户没有输入（url 为 null 或空字符串），或者去除空格后仍为空
   * 则直接返回，不执行后续操作
   * 这里用 if (!url || !url.trim()) 而不是 if (!url || url.trim() === '') 是简写写法
   * 空字符串在条件判断中会被视为 false（假值）
   */
  if (!url || !url.trim()) return;

  /* trimmed（变量）—— 去掉首尾空格后的 URL 字符串 */
  const trimmed = url.trim();

  /**
   * 验证输入的 URL 是否以 http://、https:// 或 data: 开头
   * .startsWith()：字符串方法，检查字符串是否以指定子串开头
   * 三者都不满足则报错
   */
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:')) {
    /* 设置错误提示文本 */
    document.getElementById('error').textContent = '请输入有效的图片 URL';
    /* 显示错误提示元素 */
    document.getElementById('error').style.display = 'block';
    return;  /* 提前返回，不继续执行 */
  } /* --- URL 格式验证结束 --- */

  /**
   * 拼接 <img> 图片标签的 HTML 字符串
   * 各样式说明：
   *   max-width:100%     —— 图片最大宽度为容器宽度的100%（自适应）
   *   border-radius:4px  —— 4像素圆角
   *   margin:8px 0       —— 上下8像素间距
   * alt="图片"           —— 图片加载失败时显示的替代文本
   */
  const imgHtml = '<img src="' + trimmed + '" style="max-width:100%;border-radius:4px;margin:8px 0" alt="图片">';

  /* 调用 insertAtCursor 函数，在编辑器光标位置插入图片 */
  insertAtCursor(imgHtml);
} /* --- insertImageUrl 函数结束 --- */

/**
 * uploadImage - 上传本地图片文件并插入到编辑器
 * 功能：用户选择本地图片文件后：
 *       1. 检查文件大小是否超过 5MB
 *       2. 用 FileReader（文件读取器）读取文件内容
 *       3. 用 Canvas（画布）对图片进行压缩（缩小尺寸、降低质量）
 *       4. 将压缩后的图片以 Base64（一种文本编码方式）格式插入编辑器
 * 专业术语解释：
 *   - FileReader：浏览器 API，用于读取用户选择的文件内容
 *   - Canvas：HTML5 提供的"画布"元素，可在上面绘制和操作图片
 *   - Base64：把二进制数据（如图片）编码为纯文本字符串，可以直接嵌入 HTML
 *   - data:image/jpeg;base64,...：Base64 图片的 URL 格式
 *
 * @param {HTMLInputElement} input - 文件上传的 <input type="file"> 元素
 *   input.files：用户选择的文件列表（数组）
 *   input.files[0]：用户选择的第一个文件
 * @returns {void} 没有返回值
 */
function uploadImage(input) {
  /* 获取用户选择的第一个文件（input.files 是一个类数组对象） */
  const file = input.files[0];

  /* 如果没有选择文件，直接返回（什么也不做） */
  if (!file) return;

  /**
   * 检查文件大小
   * file.size：文件大小，单位是字节（Byte）
   * 5 * 1024 * 1024 = 5,242,880 字节 = 5MB（兆字节）
   * 1024 = 1KB（千字节），1024*1024 = 1MB
   */
  if (file.size > 5 * 1024 * 1024) {
    /* 超过大小限制，显示错误提示 */
    document.getElementById('error').textContent = '图片大小超过 5MB 限制';
    document.getElementById('error').style.display = 'block';
    input.value = '';  /* 清空文件选择框，让用户可以重新选择 */
    return;  /* 提前返回 */
  } /* --- 文件大小检查结束 --- */

  /**
   * 创建 FileReader 对象
   * FileReader（文件读取器）是浏览器提供的异步读取文件内容的 API
   * 它可以读取为 DataURL（Base64 编码的 URL）或文本等格式
   */
  const reader = new FileReader();

  /**
   * reader.onload —— 文件读取成功后的回调函数
   * 当 reader.readAsDataURL(file) 读取完成后自动触发
   * function(e) 中的 e 是事件对象，e.target.result 包含读取结果（Base64 字符串）
   * 这是一个"事件监听器"——告诉浏览器"读取完成后做这些事"
   */
  reader.onload = function(e) {
    /* 创建一个新的 Image（图片）对象，用于加载读取到的图片数据 */
    const img = new Image();

    /**
     * img.onload —— 图片加载成功后的回调函数
     * 当图片数据加载完成后自动触发
     * 在这里对图片进行压缩处理
     */
    img.onload = function() {
      /**
       * 创建 Canvas（画布）元素
       * Canvas 是 HTML5 提供的绘图容器，可以在这里绘制图片并导出为不同格式
       */
      const canvas = document.createElement('canvas');

      /* MAX_WIDTH（常量）—— 压缩后图片的最大宽度（单位：像素） */
      const MAX_WIDTH = 800;
      /* QUALITY（常量）—— JPEG 图片的压缩质量（0~1之间，0.7表示70%质量，文件较小） */
      const QUALITY = 0.7;

      /* width（变量）—— 图片原始宽度 */
      let width = img.width;
      /* height（变量）—— 图片原始高度 */
      let height = img.height;

      /**
       * 如果图片宽度超过最大宽度限制（800像素）
       * 则按比例缩小图片尺寸，保持宽高比不变
       * 例如：原图 1600x1200，等比缩小后变为 800x600
       * Math.round()：四舍五入取整，防止出现小数像素
       */
      if (width > MAX_WIDTH) {
        /* 新高度 = 原高度 × (最大宽度 ÷ 原宽度)，即等比缩放 */
        height = Math.round(height * MAX_WIDTH / width);
        width = MAX_WIDTH;  /* 宽度设为最大宽度 */
      } /* --- 图片等比缩放结束 --- */

      /* 设置 Canvas 的尺寸（像素） */
      canvas.width = width;
      canvas.height = height;

      /**
       * getContext('2d') —— 获取 Canvas 的 2D 绘图上下文
       * ctx（变量）—— 绘图上下文对象，所有绘图操作都通过它完成
       */
      const ctx = canvas.getContext('2d');

      /**
       * ctx.drawImage() —— 在 Canvas 上绘制图片
       * 参数说明：
       *   img：要绘制的图片对象
       *   0, 0：绘制起始位置的 x, y 坐标（左上角）
       *   width, height：绘制后的宽度和高度（压缩后的尺寸）
       */
      ctx.drawImage(img, 0, 0, width, height);

      /**
       * canvas.toDataURL('image/jpeg', QUALITY) —— 将 Canvas 内容导出为 Base64 编码的图片数据
       * 参数说明：
       *   'image/jpeg'：输出格式为 JPEG（有损压缩，文件较小）
       *   QUALITY (0.7)：JPEG 压缩质量，0.7 表示 70% 质量
       * 返回值是一个 Data URL，格式如：data:image/jpeg;base64,/9j/4AAQ...
       * compressedDataUrl（变量）—— 压缩后的图片 Data URL
       */
      const compressedDataUrl = canvas.toDataURL('image/jpeg', QUALITY);

      /**
       * 拼接压缩后的图片 <img> 标签
       * 注意：这里直接嵌入了大段的 Base64 字符串作为图片 src，会使 HTML 体积变大
       * 但对于小型图片来说，这是一种不需要上传服务器的便捷方式
       * file.name：原始文件名，作为 alt 属性的值
       */
      const imgHtml = '<img src="' + compressedDataUrl + '" style="max-width:100%;border-radius:4px;margin:8px 0" alt="' + file.name + '">';

      /* 调用 insertAtCursor 函数，在编辑器光标位置插入压缩后的图片 */
      insertAtCursor(imgHtml);
    }; /* --- 图片加载完成回调结束 --- */

    /* 将 FileReader 读取到的结果（Base64 字符串）设置为图片的 src，开始加载图片 */
    img.src = e.target.result;
  }; /* --- 文件读取完成回调结束 --- */

  /**
   * reader.onerror —— 文件读取失败后的回调函数
   * 当文件读取过程中发生错误时自动触发
   */
  reader.onerror = function() {
    /* 在页面上显示错误提示 */
    document.getElementById('error').textContent = '图片读取失败，请重试';
    document.getElementById('error').style.display = 'block';
  }; /* --- 文件读取错误回调结束 --- */

  /**
   * reader.readAsDataURL(file) —— 开始读取文件
   * 将文件读取为 Data URL（Base64 编码）格式
   * 这是一个异步操作（不会立即完成），读取完成后会触发 reader.onload
   */
  reader.readAsDataURL(file);

  /**
   * 清空文件选择框
   * 这样用户可以选择同一个文件再次上传（否则选择相同文件不会触发 change 事件）
   */
  input.value = '';
} /* --- uploadImage 函数结束 --- */

// =================== AI 帮写 ===================

/**
 * API_URL（常量）—— DeepSeek AI 聊天接口的 API 地址
 * 这是一个 RESTful API 端点（网络服务接口地址）
 * 用于向 AI 模型发送对话请求并获取回复
 * 专业术语解释：
 *   - API（应用程序编程接口）：不同软件系统之间的通信接口
 *   - DeepSeek：一家 AI 公司，提供大语言模型服务
 *   - v1/chat/completions：API 的版本号和具体功能路径，"v1"是版本1，"chat/completions"表示聊天补全
 */
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

/**
 * MODEL（常量）—— 使用的 AI 模型名称
 * 'deepseek-chat' 是 DeepSeek 提供的对话模型
 * 不同的模型有不同的能力和价格
 */
const MODEL = 'deepseek-chat';

/**
 * getApiKey - 获取 DeepSeek API 密钥
 * 功能：先从 localStorage 中查找是否已保存 API Key
 *       如果没有则通过 prompt() 弹出输入框让用户输入
 *       输入后自动保存到 localStorage 以便下次使用
 * 专业术语解释：
 *   - API Key（API 密钥）：调用 API 时的身份验证凭证，类似于密码
 *     每个开发者需要在 DeepSeek 官网注册获取
 *
 * @returns {string|null} 返回 API Key 字符串；如果用户取消输入则返回 null
 */
function getApiKey() {
  /* 尝试从 localStorage 中获取之前保存的 API Key */
  let key = localStorage.getItem('deepseek_api_key');

  /* 如果没有保存过 API Key（key 为 null 或 undefined） */
  if (!key) {
    /* 弹出输入框让用户输入 API Key */
    key = prompt('请输入你的 DeepSeek API Key：\n（输入一次后会自动保存，后续不再询问）');

    /**
     * 检查用户是否输入了内容（key 不是 null 且去除首尾空格后不为空）
     * if (key && key.trim()) —— key 存在且去空格后有内容
     */
    if (key && key.trim()) {
      /* 将用户输入的 API Key 保存到 localStorage（去除首尾空格） */
      localStorage.setItem('deepseek_api_key', key.trim());
      return key.trim();  /* 返回去除空格后的 API Key */
    } /* --- API Key 保存结束 --- */

    /* 用户点击了取消或输入为空，返回 null */
    return null;
  } /* --- 未找到已保存 Key 的处理结束 --- */

  /* 如果 localStorage 中已经有 API Key，直接返回 */
  return key;
} /* --- getApiKey 函数结束 --- */

/**
 * showAiStatus - 在页面上显示 AI 操作的状态信息
 * 功能：更新页面上的状态提示元素，显示处理进度或错误信息
 *
 * @param {string} msg - 要显示的消息文本
 * @param {boolean} isError - 是否为错误消息
 *   true：显示为错误样式（红色/警告色）
 *   false：显示为信息提示样式（蓝色/信息色）
 * @returns {void} 没有返回值
 */
function showAiStatus(msg, isError) {
  /* 获取页面中 id 为 'aiStatus' 的状态提示元素 */
  const el = document.getElementById('aiStatus');
  el.textContent = msg;          /* 设置元素的文本内容为传入的消息 */
  el.style.display = 'block';    /* 让元素显示出来（block 表示块级显示） */

  /**
   * 设置元素的 CSS 类名
   * 专业术语解释：
   *   - className：DOM 元素的 class 属性，用于应用 CSS 样式
   *   - 三元运算符 (条件 ? 值1 : 值2)：
   *     如果 isError 为 true，值为 'alert alert-error'（错误样式）
   *     如果 isError 为 false，值为 'alert alert-info'（信息样式）
   */
  el.className = 'alert ' + (isError ? 'alert-error' : 'alert-info');
} /* --- showAiStatus 函数结束 --- */

/**
 * generateByAI - 调用 DeepSeek AI 生成新闻内容
 * 功能：异步函数，获取用户已填写的新闻标题，调用 DeepSeek API
 *      让 AI 根据标题自动生成一篇完整的新闻报道，并插入到编辑器中
 * 专业术语解释：
 *   - async：异步关键字，标记函数为异步函数，可以内部使用 await
 *   - await：等待关键字，等待一个异步操作完成后继续执行
 *   - fetch API：浏览器内置的 HTTP 请求 API，用于向服务器发送请求
 *     类似于在浏览器地址栏输入网址访问，但由 JavaScript 控制
 *   - try/catch/finally：JavaScript 的错误处理机制
 *     try：尝试执行可能出错的代码
 *     catch：如果出错则执行这里的代码
 *     finally：无论是否出错都会执行这里的代码
 *   - HTTP 状态码：服务器响应状态，如 200=成功，401=未授权，500=服务器错误
 *   - JSON（JavaScript 对象表示法）：一种轻量级的数据交换格式
 *     用于前端和后端（或 API）之间传递数据
 *
 * @returns {Promise<void>} async 函数返回一个 Promise（异步操作对象）
 *   外部可以通过 await 等待该函数执行完毕
 */
async function generateByAI() {
  /* 获取"AI 帮写"按钮元素，用于后续禁用和修改文字 */
  const btn = document.getElementById('aiBtn');

  /* 获取当前标题输入框中的内容，并去除首尾空格 */
  const title = document.getElementById('title').value.trim();

  /**
   * 检查标题是否为空
   * 如果用户还没有填写标题，提示用户先写标题
   */
  if (!title) {
    showAiStatus('请先填写新闻标题，AI 会根据标题帮写内容', true);  /* 显示错误提示 */
    document.getElementById('title').focus();  /* 让标题输入框获得焦点（光标闪烁） */
    return;  /* 提前返回，不再继续执行 */
  } /* --- 标题检查结束 --- */

  /* 获取 API Key（可能从 localStorage 或用户输入） */
  const apiKey = getApiKey();

  /* 如果获取不到 API Key（用户取消输入等），提示用户 */
  if (!apiKey) {
    showAiStatus('需要 API Key 才能使用 AI 帮写功能', true);  /* 显示错误提示 */
    return;  /* 提前返回 */
  } /* --- API Key 检查结束 --- */

  /**
   * 禁用 AI 按钮，防止用户在请求过程中重复点击
   * disabled = true：按钮变为灰色不可点击状态
   */
  btn.disabled = true;
  btn.textContent = '生成中...';   /* 修改按钮文字，提示正在生成 */
  showAiStatus('正在生成新闻内容...', false);  /* 显示"正在生成"的提示 */

  /**
   * try 块：尝试执行可能出错的代码（如网络请求）
   * 如果网络请求失败或 API 返回错误，会在 catch 块中处理
   */
  try {
    /**
     * fetch() —— 发送 HTTP 请求到 API 服务器
     * await —— 等待服务器响应（网络请求可能需要几百毫秒到几秒）
     * 第一个参数 API_URL：请求的地址
     * 第二个参数：配置对象，包含请求方法、请求头和请求体
     * response（变量）—— 服务器的响应对象，包含状态码和响应数据
     */
    const response = await fetch(API_URL, {
      method: 'POST',  /* HTTP 请求方法，POST 表示向服务器发送数据（而 GET 是获取数据） */
      headers: {
        'Content-Type': 'application/json',  /* 告诉服务器，请求体是 JSON 格式 */
        'Authorization': 'Bearer ' + apiKey  /* 身份验证：Bearer 是认证类型，后面跟着 API Key */
      },
      /**
       * body —— 请求体内容，即发送给 API 的数据
       * JSON.stringify() —— 把 JavaScript 对象转换为 JSON 字符串
       */
      body: JSON.stringify({
        model: MODEL,  /* 使用的 AI 模型名称 */
        messages: [    /* 对话消息列表，按顺序排列 */
          {
            role: 'system', /* system 消息：给 AI 设定身份和规则 */
            content: '你是一个新闻编辑。根据用户提供的新闻标题，生成一篇完整的新闻报道。要求：内容真实客观、语言正式、段落分明、不少于300字。直接用正文回复，不要加标题。'
          },
          {
            role: 'user',   /* user 消息：用户的输入/问题 */
            content: '请根据以下标题生成一篇新闻内容：' + title  /* 拼接标题到提示词中 */
          }
        ],
        temperature: 0.7,  /* 温度参数（0~2），控制 AI 输出的随机性/创造性，0.7 是较平衡的取值 */
        max_tokens: 2000   /* 最大生成的 Token（词元）数量，限制回复长度 */
      })
    }); /* --- fetch 请求结束 --- */

    /**
     * 检查 HTTP 响应是否成功
     * response.ok —— 如果 HTTP 状态码在 200~299 之间（表示成功），则为 true
     * 如果失败（如 401 未授权、500 服务器错误），抛出一个错误
     * throw new Error(...)：手动抛出错误，会被下面的 catch 块捕获
     */
    if (!response.ok) {
      throw new Error('API 请求失败: ' + response.status + ' ' + response.statusText);
    } /* --- 响应状态检查结束 --- */

    /**
     * response.json() —— 从响应中提取 JSON 数据
     * await —— 等待 JSON 解析完成（数据可能较大）
     * data（变量）—— 解析后的 JavaScript 对象，包含 API 返回的所有数据
     * data 的结构示例：
     * {
     *   choices: [
     *     { message: { role: "assistant", content: "生成的新闻内容..." } }
     *   ]
     * }
     */
    const data = await response.json();

    /**
     * 从响应数据中提取 AI 生成的内容
     * data.choices[0]：第一个（也是唯一一个）AI 回复选项
     * .message.content：AI 消息中的正文内容
     * content（变量）—— AI 生成的新闻文本
     */
    const content = data.choices[0].message.content;

    /**
     * 在编辑器光标位置插入 AI 生成的内容
     * 注意：这与"清空并替换"不同，它保留编辑器中已有的内容
     * 只在光标处插入新内容，用户原来写的内容不会被覆盖
     */
    insertAtCursor(content);

    /* 显示成功提示 */
    showAiStatus('AI 帮写完成！', false);

  } catch (err) {
    /**
     * catch 块：当 try 块中的任何代码抛出错误时执行
     * err（变量）—— 捕获到的错误对象，包含错误信息
     * err.message：错误的具体描述文字
     * 可能的原因：网络断开、API Key 无效、服务器返回错误等
     */
    showAiStatus('AI 帮写失败：' + err.message, true);

  } finally {
    /**
     * finally 块：无论 try 成功还是 catch 捕获到错误，都会执行
     * 用于清理和恢复状态
     */
    btn.disabled = false;      /* 重新启用 AI 按钮 */
    btn.textContent = 'AI 帮写'; /* 恢复按钮文字为初始状态 */
  } /* --- try/catch/finally 结束 --- */
} /* --- generateByAI 函数结束 --- */
