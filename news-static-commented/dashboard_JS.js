/**
 * dashboard_JS.js - 后台管理页
 * 功能：以表格展示当前用户发布的新闻
 * 提供编辑和删除操作按钮
 */

// =============================================================================
// 常量定义
// =============================================================================

/**
 * DEFAULT_AVATAR（默认头像）
 * 
 * 【专业术语解释】
 *   常量（const）：一旦赋值后就不能再修改的变量，用 const 关键字声明。
 *   URL（统一资源定位符）：互联网上资源的地址，比如图片的网址。
 * 
 * 作用：当用户没有设置个人头像时，使用这个默认头像图片的网址。
 * 类型：字符串（string），用单引号 '' 包裹。
 */
const DEFAULT_AVATAR = 'https://ts1.tc.mm.bing.net/th/id/R-C.5c5224bd34a0aee8c411509e0d154575?rik=4fXwdrQ3mRIlvw&riu=http%3a%2f%2fbpic.588ku.com%2felement_pic%2f01%2f55%2f09%2f4557474d965eb71.jpg&ehk=wlOkaUqmQA0OH26%2bPRQ4JBO3sk6Wv8ID%2flpRkImF23Y%3d&risl=&pid=ImgRaw&r=0';

/**
 * DEFAULT_BIO（默认个人简介）
 * 
 * 作用：当用户没有填写个人简介时，使用这段默认文字。
 * 类型：字符串（string）。
 */
const DEFAULT_BIO = '这个人还没有简介哦~';

// =============================================================================
// 函数定义
// =============================================================================

/**
 * avatarHtml - 生成用户头像的 HTML 图片标签
 * 
 * 【功能说明】
 *   根据传入的用户信息，生成一个带有头像图片的 <img> 标签字符串。
 *   如果用户没有设置头像，则使用上面定义的 DEFAULT_AVATAR 默认头像。
 * 
 * 【参数】
 *   user（对象 Object）：用户信息对象，至少应包含 avatar 属性（字符串，头像图片网址）。
 *     例如：{ avatar: 'https://example.com/avatar.jpg', username: '张三' }
 * 
 * 【返回值】
 *   字符串（string）：一段 HTML 代码，表示一个带样式的 <img> 图片标签。
 *   可以直接在页面中使用 innerHTML 等方式插入到 DOM（文档对象模型）中。
 * 
 * 【专业术语解释】
 *   HTML（超文本标记语言）：用来描述网页结构和内容的标记语言。
 *   <img> 标签：HTML 中用来显示图片的元素。
 *   CSS 样式：通过 style 属性设置图片的宽度、高度、圆角等外观。
 *   模板字符串：用加号（+）拼接字符串的方式，将变量嵌入到字符串中。
 */
function avatarHtml(user) {
  // 使用逻辑或运算符（||）：如果 user.avatar 有值（不是 null/undefined/空字符串），
  // 就使用 user.avatar，否则使用 DEFAULT_AVATAR（默认头像网址）。
  // 这种写法称为"短路求值"——当左边为真时，不再执行右边的表达式。
  const avatarUrl = user.avatar || DEFAULT_AVATAR;

  // 返回一个 <img> 标签的字符串
  // width:24px  → 宽度 24 像素
  // height:24px → 高度 24 像素
  // border-radius:50% → 圆形（50%圆角）
  // vertical-align:middle → 垂直居中对齐
  // margin-right:4px → 右侧外边距 4 像素
  // object-fit:cover → 图片按比例裁剪，填满整个容器
  return '<img src="' + avatarUrl + '" alt="" style="width:24px;height:24px;border-radius:50%;vertical-align:middle;margin-right:4px;object-fit:cover">';
}
// ========== avatarHtml 函数结束 ==========

/**
 * checkAuth - 检查用户是否已登录
 * 
 * 【功能说明】
 *   从浏览器的 localStorage（本地存储）中读取当前登录用户的信息。
 *   如果用户未登录，则自动跳转到登录页面（login.html）。
 *   这是后台管理页面的"登录守卫"——防止未登录用户访问管理功能。
 * 
 * 【专业术语解释】
 *   localStorage（本地存储）：浏览器提供的一种存储机制，
 *     可以将数据以"键值对"的形式长久保存在浏览器中，
 *     即使关闭页面或重启浏览器，数据也不会丢失。
 *     每个网站有自己独立的 localStorage 空间。
 *   JSON.parse()：将 JSON 格式的字符串转换为 JavaScript 对象。
 *     JSON（JavaScript对象表示法）是一种轻量级的数据交换格式，
 *     常用于前后端数据传输。例如：
 *     JSON 字符串：'{"name":"张三","age":18}'
 *     转换后对象：{ name: '张三', age: 18 }
 *   localStorage.getItem(key)：从 localStorage 中根据键名（key）读取对应的值（value）。
 *     如果该键不存在，则返回 null。
 *   || 'null'：如果 getItem 返回 null（没有存储用户信息），
 *     则使用字符串 'null' 作为默认值，这样 JSON.parse 会将其解析为 null。
 *   window.location.href：浏览器地址栏的完整网址。
 *     给这个属性赋值会触发页面跳转。
 *   return null：结束函数执行并返回 null，表示"没有登录用户"。
 * 
 * 【返回值】
 *   - 如果用户已登录：返回用户对象（Object），包含用户信息（如 id、username 等）。
 *   - 如果用户未登录：返回 null，且页面会被重定向到 login.html。
 */
function checkAuth() {
  // 从 localStorage 中读取键名为 'currentUser' 的数据
  // localStorage.getItem('currentUser') 可能返回 null（没有该数据）
  // 用 || 'null' 做"兜底"：如果返回 null，就用字符串 'null' 替代
  // JSON.parse(...) 将 JSON 字符串解析为 JavaScript 对象或 null
  // 整行含义：从浏览器本地存储中获取当前登录的用户信息
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');

  // 条件判断：如果 user 是"假值"（即 null/undefined/0/空字符串等）
  // !user 的意思就是"user 不存在"或"user 是假值"
  // 【专业术语】"假值"（falsy value）：在布尔上下文中会被当作 false 的值
  if (!user) {
    // 将浏览器地址栏跳转到登录页面 login.html
    // 这是一次"客户端重定向"
    window.location.href = 'login.html';
    // 返回 null，表示"没有登录用户"
    // return 会立即结束函数的执行
    return null;
  }
  // 如果 user 存在（已登录），将用户对象返回给调用者
  return user;
}
// ========== checkAuth 函数结束 ==========

/**
 * loadNav - 加载页面顶部的导航栏
 * 
 * 【功能说明】
 *   根据用户是否登录，动态生成导航栏的 HTML 内容并显示在页面上。
 *   如果用户已登录：显示 首页、后台管理、欢迎信息（带头像）、个人资料、退出 链接。
 *   如果用户未登录：显示 首页、登录、注册 链接。
 * 
 * 【参数】
 *   无（不需要外部传入参数，函数内部会自行从 localStorage 读取用户信息）
 * 
 * 【返回值】
 *   无（undefined）。函数直接修改了页面的 DOM 内容，不需要返回值。
 * 
 * 【专业术语解释】
 *   document.getElementById('navLinks')：通过元素 id 获取页面上的某个 HTML 元素。
 *   .innerHTML：获取或设置元素的内部 HTML 内容。
 *     给 innerHTML 赋值会替换掉该元素原来的所有子元素。
 *   三元运算符（条件 ? 值1 : 值2）：
 *     如果"条件"为真，整个表达式返回"值1"；否则返回"值2"。
 *     相当于简写的 if...else 语句。
 *   箭头函数（() => {}）：ES6 引入的简洁函数写法。
 *     等会在 render 函数中会用到，这里 loadNav 中没有箭头函数。
 */
function loadNav() {
  // 从 localStorage 中读取当前登录用户的信息
  // 与 checkAuth() 中读取方式相同，但这里不检查登录状态，直接使用
  // 注意：loadNav() 可能会在用户未登录时也被调用（显示登录/注册链接）
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');

  // 通过元素的 id 找到导航栏容器（<nav> 中的某个元素）
  // 将其 innerHTML（内部 HTML）替换为根据登录状态生成的导航链接
  document.getElementById('navLinks').innerHTML = user
    // 情况一：用户已登录（user 不是 null）——显示完整导航
    // 注意：这里使用了字符串拼接（+ 运算符）来组合 HTML
    // 拼接内容包括普通文本、函数返回的头像 HTML、以及用户名和退出链接
    ? '<a href="index.html">首页</a>' +                    // 首页链接
      '<a href="dashboard.html">后台管理</a>' +             // 后台管理链接
      '<span style="color:rgba(255,255,255,.8)">' +        // 欢迎信息容器（半透明白色文字）
        avatarHtml(user) +                                 // 用户头像（<img> 标签）
        '欢迎, ' + user.username +                         // 欢迎文字 + 用户名
      '</span>' +
      '<a href="profile.html" style="color:rgba(255,255,255,.8);text-decoration:none">个人资料</a>' + // 个人资料链接
      '<a href="javascript:logout()">退出</a>'             // 退出链接（调用 JavaScript 的 logout 函数）
    // 情况二：用户未登录（user 是 null）——显示最简单的导航
    : '<a href="index.html">首页</a>' +                    // 首页链接
      '<a href="login.html">登录</a>' +                    // 登录页面链接
      '<a href="register.html">注册</a>';                  // 注册页面链接
}
// ========== loadNav 函数结束 ==========

/**
 * logout - 退出登录
 * 
 * 【功能说明】
 *   弹出确认对话框，询问用户是否确定退出。
 *   如果用户点击"确定"，则清除 localStorage 中存储的当前用户信息，
 *   然后将页面重定向到首页（index.html）。
 *   如果用户点击"取消"，则什么也不做。
 * 
 * 【参数】
 *   无
 * 
 * 【返回值】
 *   无（undefined）。但函数会触发页面跳转或弹窗交互。
 * 
 * 【专业术语解释】
 *   confirm('...')：浏览器内置的弹窗函数，显示一个"确定/取消"对话框。
 *     如果用户点击"确定"，返回 true；点击"取消"，返回 false。
 *   localStorage.removeItem(key)：从 localStorage 中移除指定键名的数据。
 *     调用后，'currentUser' 这条数据就彻底消失了。
 *   window.location.href = '...'：让浏览器跳转到指定页面。
 *   这一整个函数写在 href="javascript:logout()" 中，
 *     href="javascript:..." 的意思是"执行一段 JavaScript 代码"。
 *     这是一种让 <a> 链接执行 JS 代码而不是跳转 URL 的写法。
 */
function logout() {
  // 弹出确认对话框，如果用户点击"取消"（confirm 返回 false），
  // if 条件为假，函数立即结束，什么也不做
  if (confirm('确定要退出登录吗？')) {
    // 从 localStorage 中移除 'currentUser' 这条数据
    // 这样下次检查登录状态时就会认为未登录
    localStorage.removeItem('currentUser');
    // 跳转到首页（index.html）
    window.location.href = 'index.html';
  }
  // 如果用户点击取消，函数隐式返回，什么都不做
}
// ========== logout 函数结束 ==========

/**
 * render - 渲染后台管理页面（主渲染函数）
 * 
 * 【功能说明】
 *   这是后台管理页面的核心渲染函数，按顺序执行以下步骤：
 *   1. 检查用户登录状态（如果未登录，跳转并停止执行）。
 *   2. 加载导航栏（根据登录状态显示不同菜单）。
 *   3. 从 localStorage 获取所有新闻数据。
 *   4. 筛选出当前用户（通过 authorId 匹配）发布的新闻。
 *   5. 按创建时间倒序排列（最新的在最上面）。
 *   6. 如果没有任何新闻，显示"空状态"提示和"发布第一条新闻"的引导链接。
 *   7. 如果有新闻，以 HTML 表格形式展示每条新闻的标题、发布时间和操作按钮。
 * 
 * 【参数】
 *   无
 * 
 * 【返回值】
 *   无（undefined）。函数直接操作 DOM，修改页面内容。
 * 
 * 【专业术语解释】
 *   DOM（文档对象模型）：浏览器将 HTML 文档解析成的一个树形结构。
 *     JavaScript 可以通过 DOM API（如 getElementById）来读取和修改页面内容。
 *   filter()：数组的方法，创建一个新数组，只包含满足条件的元素。
 *     条件由传入的回调函数决定（返回 true 保留，false 移除）。
 *   sort()：数组的方法，对数组元素进行排序。
 *     传入的 (a, b) => b.createdAt - a.createdAt 是一个"比较函数"，
 *     如果返回正数，b 排在 a 前面；返回负数，a 排在 b 前面。
 *     这里用时间戳相减，结果正数表示 b 比 a 新，所以新的排在前面（倒序）。
 *   map()：数组的方法，遍历每个元素，将元素"映射"（转换）为新的值，
 *     返回一个由转换后值组成的新数组。
 *   join('')：数组的方法，将数组的所有元素拼接成一个字符串，
 *     参数 '' 表示元素之间不加任何分隔符（直接连在一起）。
 *   toLocaleString('zh-CN')：将日期对象转换为符合中文习惯的字符串格式，
 *     例如：'2026/6/4 下午3:30:00'。
 *   new Date(n.createdAt)：将数字（时间戳，毫秒数）转换为 JavaScript 的 Date 日期对象，
 *     然后才能调用 toLocaleString 等方法进行格式化。
 */
async function render() {
  // 步骤1：检查登录状态
  // 调用 checkAuth() 函数，如果未登录会跳转并返回 null
  // 如果返回 null，!user 为 true，函数立即结束（return）
  // 如果已登录，user 变量保存了当前用户的对象信息
  const user = checkAuth();
  // 如果 user 是 null（未登录），立刻停止执行后面的代码
  if (!user) return;
  // ========== 登录检查结束 ==========

  // 步骤2：加载导航栏
  // 调用 loadNav() 函数生成并显示导航栏的 HTML
  loadNav();
  // ========== 导航栏加载结束 ==========

  /**
   * 步骤3、4、5：获取数据 → 筛选 → 排序
   * 
   * 以下代码是"方法链"（method chaining）的写法：
   *   先 fetch 获取数据，然后 .filter(...)，然后 .sort(...)
   *   每个方法处理完后返回一个新值，下一个方法接着处理。
   * 
   * 【详细分解】：
   *   ① fetch('https://nanhu-news-api.workers.dev/api/news')
   *      发送 GET 请求从后端 API 获取所有新闻数据
   *   ② res.ok ? await res.json() : []
   *      如果响应正常，解析 JSON 为数组；否则返回空数组
   *   ③ .filter(n => n.authorId === user.id)
   *      过滤数组，只保留 authorId（作者ID）与当前用户 ID 相同的新闻
   *      n 代表数组中的每一个元素（一篇新闻对象）
   *   ④ .sort((a, b) => b.createdAt - a.createdAt)
   *      按 createdAt（创建时间，单位：毫秒时间戳）倒序排列
   *      最新的新闻排在最前面
   */
  const res = await fetch('https://nanhu-news-api.workers.dev/api/news');
  const allNews = (res.ok ? await res.json() : [])
    .filter(n => n.authorId === user.id)
    .sort((a, b) => b.createdAt - a.createdAt);
  // ========== 数据筛选排序结束 ==========

  // 步骤6：找到页面上用于显示后台管理内容的容器元素
  // 这个 <div> 或 <section> 元素在 HTML 中的 id 是 'dashboardContent'
  const el = document.getElementById('dashboardContent');

  // 步骤7：判断是否有新闻数据
  // allNews.length === 0 表示数组为空，当前用户没有发布过任何新闻
  if (allNews.length === 0) {
    // ---------- 情况一：没有新闻（空状态）----------
    // 设置容器的 innerHTML，显示一个"空状态提示"界面
    // 包含一段提示文字和一个引导用户去发布新闻的链接按钮
    el.innerHTML = '<div class="empty-state">' +         // 空状态容器（带有 CSS 样式类）
                     '<p>还没有发布过新闻</p>' +            // 提示文字段落
                     '<a href="create.html" class="btn btn-primary">发布第一条新闻</a>' +  // 引导按钮（带 CSS 类 btn 和 btn-primary）
                   '</div>';
    // 函数执行完毕，返回，不再执行后续的表格渲染代码
    return;
  }
  // ========== 空状态处理结束 ==========

  // ---------- 情况二：有新闻，生成管理表格 ----------
  // 使用 innerHTML 将表格 HTML 字符串插入到页面中
  // 整个 HTML 结构如下（用 + 拼接多个部分）：
  el.innerHTML =
    // 表格开始：<table> 带 CSS 类 "table"
    '<table class="table">' +
      // 表头行（<thead>）包含三列：标题、发布时间、操作
      '<thead>' +
        '<tr>' +
          '<th>标题</th>' +       // 第一列：新闻标题
          '<th>发布时间</th>' +   // 第二列：发布时间
          '<th>操作</th>' +       // 第三列：编辑/删除按钮
        '</tr>' +
      '</thead>' +
      // 表格主体（<tbody>）开始
      '<tbody>' +
        // 关键部分：使用 map() 方法将每条新闻数据转换为一行表格行（<tr>）
        // allNews.map(...) 遍历 allNews 数组中的每条新闻
        // n 代表数组中的当前元素（一篇新闻对象，包含 id、title、createdAt 等属性）
        // map() 返回一个新数组，其每个元素是下面拼接的 HTML 字符串
        allNews.map(n =>
          // 每一条新闻对应一个表格行 <tr>
          '<tr>' +
            // 第一列：新闻标题，点击标题可跳转到新闻详情页
            // view.html?id=' + n.id  → 在 URL 中附加新闻的 ID 作为查询参数
            // 【专业术语】查询参数（query string）：URL 中 ? 后面的 key=value 部分
            '<td><a href="view.html?id=' + n.id + '">' + n.title + '</a></td>' +
            // 第二列：发布时间
            // new Date(n.createdAt)：将时间戳（数字，单位毫秒）解析为 Date 对象
            // toLocaleString('zh-CN')：格式化为中文日期时间字符串
            '<td>' + new Date(n.createdAt).toLocaleString('zh-CN') + '</td>' +
            // 第三列：操作按钮（编辑链接 + 删除按钮）
            '<td>' +
              // 编辑按钮：跳转到编辑页面，URL 中携带新闻 ID
              // btn btn-sm：小号按钮的 CSS 样式类
              '<a href="edit.html?id=' + n.id + '" class="btn btn-sm">编辑</a> ' +
              // 删除按钮：调用 delNews 函数，传入当前新闻的 ID
              // btn btn-sm btn-danger：小号红色（危险操作）按钮的 CSS 样式类
              // onclick 是 HTML 的点击事件属性，当用户点击按钮时触发
              // 注意：这里 n.id 是数字，直接拼接在字符串中，如 onclick="delNews(3)"
              '<button class="btn btn-sm btn-danger" onclick="delNews(' + n.id + ')">删除</button>' +
            '</td>' +
          '</tr>'
        // .join('') 将 map 返回的数组中的所有字符串拼接成一个长字符串
        // join('') 的参数是空字符串，表示元素之间不插入任何字符
        ).join('') +
      // 表格主体结束
      '</tbody>' +
    // 表格结束
    '</table>';
}
// ========== render 函数结束 ==========

/**
 * delNews - 删除指定的新闻
 * 
 * 【功能说明】
 *   根据传入的新闻 ID，从 localStorage 的新闻列表中删除对应的新闻。
 *   删除前会弹出确认对话框让用户确认。
 *   删除完成后重新调用 render() 刷新页面显示。
 * 
 * 【参数】
 *   id（number 数字）：要删除的新闻的唯一标识符（ID）。
 *     例如：delNews(3) 表示删除 ID 为 3 的那篇新闻。
 *     注意：这里传入的 id 类型是数字（number），
 *     但在 localStorage 中存储时，id 可能是数字也可能被转为字符串，
 *     不过使用 !==（严格不等于）比较时，类型和值都必须不同才返回 true，
 *     这取决于存储时 id 的类型。不过在此代码中，id 是数字类型。
 * 
 * 【返回值】
 *   无（undefined）。函数直接操作 localStorage 和 DOM。
 * 
 * 【专业术语解释】
 *   严格不等运算符（!==）：不仅比较值是否不同，还比较类型是否不同。
 *     例如：3 !== '3' 为 true（数字 3 和 字符串 '3' 类型不同）。
 *   JSON.stringify()：与 JSON.parse() 相反的操作，
 *     将 JavaScript 对象或数组转换为 JSON 格式的字符串，
 *     因为 localStorage 只能存储字符串，不能直接存储对象。
 */
async function delNews(id) {
  // 弹出确认对话框，询问用户是否确定要删除
  // 如果用户点击"取消"（confirm 返回 false），则 !confirm(...) 为 true
  // 执行 return 立即结束函数，不执行删除操作
  if (!confirm('确定要删除这篇新闻吗？')) return;
  // ========== 用户确认通过 ==========

  // 从 localStorage 中获取当前登录用户的 token
  // 用于在请求头中传递 Bearer token 进行身份验证
  const user = JSON.parse(localStorage.getItem('currentUser'));

  // 调用后端 API 执行删除操作
  // fetch('.../api/news/' + id, { method: 'DELETE' }) 发送 DELETE 请求
  // 请求头中包含 Authorization: Bearer <token> 用于身份验证
  const res = await fetch('https://nanhu-news-api.workers.dev/api/news/' + id, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + (user ? user.token : '') }
  });
  // ========== 删除请求已发送 ==========

  // 检查响应状态：res.ok 为 true 表示删除成功
  // 如果成功，重新调用 render() 刷新页面显示
  // 如果失败，弹出提示告知用户
  if (res.ok) render(); else alert('删除失败');
  // ========== 页面已刷新或提示失败 ==========
}
// ========== delNews 函数结束 ==========

// =============================================================================
// 页面初始化
// =============================================================================

/**
 * 立即执行 render() 函数
 * 
 * 【作用】
 *   当 JavaScript 文件被 HTML 页面加载时，最后一行代码会立即调用 render() 函数，
 *   初始化后台管理页面的显示内容。
 *   这相当于"程序入口"——整个脚本的起点。
 * 
 * 【执行流程】
 *   render()
 *     ↓
 *   checkAuth()       → 检查是否登录，未登录则跳转
 *     ↓
 *   loadNav()         → 生成导航栏
 *     ↓
 *   读取/筛选/排序新闻 → 从 localStorage 获取当前用户的新闻
 *     ↓
 *   渲染表格或空状态  → 将数据显示在页面上
 * 
 * 【知识点】
 *   在 HTML 中引入 JavaScript 文件时（<script src="dashboard_JS.js">），
 *   浏览器会从上到下执行文件中的所有代码。
 *   函数定义（function xxx(){}）只是"声明"（告诉浏览器有这个函数），
 *   只有调用函数（如 render()）才会真正执行函数内部的代码。
 */
render();
// ========== 页面初始化完成 ==========
