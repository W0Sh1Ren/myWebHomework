/**
 * view_JS.js - 新闻详情页
 * 功能：通过 URL 参数 ?id=xxx 获取新闻并显示完整内容
 * 支持作者直接跳转到编辑页面
 *
 * ========== 给零基础读者的说明 ==========
 * 这个文件是一个 JavaScript（简称 JS）脚本，运行在浏览器中。
 * 它负责"新闻详情页"的动态行为：从地址栏获取新闻 ID、
 * 从浏览器的本地存储中查找该新闻、然后把新闻内容渲染到网页上。
 * ======================================
 */

/**
 * DEFAULT_AVATAR —— 默认头像图片的 URL（统一资源定位符，即图片的网络地址）
 * 当用户没有设置自己的头像时，就使用这张图片作为替代。
 * const 是"常量"关键字，表示这个变量的值一旦定义就不能被修改。
 */
const DEFAULT_AVATAR = 'https://ts1.tc.mm.bing.net/th/id/R-C.5c5224bd34a0aee8c411509e0d154575?rik=4fXwdrQ3mRIlvw&riu=http%3a%2f%2fbpic.588ku.com%2felement_pic%2f01%2f55%2f09%2f4557474d965eb71.jpg&ehk=wlOkaUqmQA0OH26%2bPRQ4JBO3sk6Wv8ID%2flpRkImF23Y%3d&risl=&pid=ImgRaw&r=0';

/**
 * DEFAULT_BIO —— 默认的用户简介文字
 * 当用户没有填写个人简介时，显示这句话。
 */
const DEFAULT_BIO = '这个人还没有简介哦~';

/**
 * 函数: avatarHtml
 * 功能: 生成用户头像的 HTML <img> 图片标签字符串
 * 参数:
 *   - user : 对象 (Object)，包含用户信息，例如 { avatar: "...", username: "..." }
 *             如果 user.avatar 不存在（未设置），则使用 DEFAULT_AVATAR 作为备选
 * 返回值:
 *   - 字符串 (String)，一段 HTML 代码，例如：
 *     '<img src="头像地址" alt="" style="...">'
 * 专业术语解释:
 *   - HTML: 超文本标记语言，用来描述网页结构的代码
 *   - <img> 标签: 用来在网页上显示图片
 *   - style 属性: 给元素设置 CSS 样式（控制外观）
 *   - border-radius: 50% 让图片变成圆形
 *   - object-fit: cover 让图片按比例填充容器，多余部分裁掉
 */
function avatarHtml(user) {
  // 如果 user.avatar 有值就用它，否则用 DEFAULT_AVATAR
  // || 是"逻辑或"运算符：左边为真（存在）就用左边，否则用右边
  const avatarUrl = user.avatar || DEFAULT_AVATAR;

  // 返回拼接好的 <img> 标签字符串
  // 字符串用 + 号连接（字符串拼接）
  return '<img src="' + avatarUrl + '" alt="" style="width:24px;height:24px;border-radius:50%;vertical-align:middle;margin-right:4px;object-fit:cover">';
} /* avatarHtml 函数结束 */

/**
 * 函数: loadNav
 * 功能: 加载页面顶部的导航栏。
 *       检查用户是否已登录，如果已登录则显示"欢迎"和"退出"等链接；
 *       如果未登录则显示"登录"和"注册"链接。
 * 参数: 无
 * 返回值: 无（undefined）
 *
 * 专业术语解释:
 *   - localStorage: "本地存储"，浏览器提供的一种存储数据的方式，
 *     数据会一直保存在硬盘上，关闭网页再打开也不会丢失。
 *     可以把它理解成浏览器自带的一个小数据库。
 *   - JSON: JavaScript Object Notation（JS对象简谱），
 *     一种轻量级的数据交换格式，用文本表示结构化数据。
 *     JSON.parse() 将 JSON 字符串转换成 JS 中的对象或值。
 *     JSON.stringify() 的作用相反，把对象转成字符串。
 *   - document.getElementById(): 通过元素的 id 属性获取网页上的某个元素
 *   - innerHTML: 元素的内部 HTML 内容，给它赋值可以改变元素显示的内容
 *   - 三元运算符: 条件 ? 值1 : 值2，如果条件为真返回值1，否则返回值2
 */
function loadNav() {
  /*
   * localStorage.getItem('currentUser') —— 从本地存储中读取键名为 'currentUser' 的数据
   * 如果不存在（即用户未登录），getItem 返回 null，
   * 这里的 || 'null' 是为了让 JSON.parse 总能解析出合法的 JS 值：
   *   - 用户已登录 → 返回 JSON 字符串 → JSON.parse 解析为用户对象
   *   - 用户未登录 → 'null' → JSON.parse 解析为 null
   * 最终 user 变量要么是一个对象（已登录），要么是 null（未登录）。
   */
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');

  /*
   * 通过 id="navLinks" 找到导航栏容器，然后设置它的 innerHTML。
   * 这里再次用到了三元运算符 user ? ... : ...
   * 如果 user 不是 null（已登录），显示包含用户头像、用户名、退出等链接；
   * 如果 user 是 null（未登录），只显示首页、登录、注册链接。
   */
  document.getElementById('navLinks').innerHTML = user
    /*
     * 已登录状态下的导航栏 HTML：
     * - 首页链接
     * - 后台管理链接（dashboard.html）
     * - 欢迎信息（包含头像和用户名）
     * - 个人资料链接
     * - 退出按钮（调用 logout() 函数）
     * avatarHtml(user) 调用上面的函数生成头像图片标签
     * user.username 是当前登录用户的用户名
     * javascript:logout() 表示点击后执行 JS 的 logout 函数
     */
    ? '<a href="index.html">首页</a><a href="dashboard.html">后台管理</a><span style="color:rgba(255,255,255,.8)">' + avatarHtml(user) + '欢迎, ' + user.username + '</span><a href="profile.html" style="color:rgba(255,255,255,.8);text-decoration:none">个人资料</a><a href="javascript:logout()">退出</a>'
    /*
     * 未登录状态下的导航栏 HTML：
     * - 首页链接
     * - 登录页面链接（login.html）
     * - 注册页面链接（register.html）
     */
    : '<a href="index.html">首页</a><a href="login.html">登录</a><a href="register.html">注册</a>';
} /* loadNav 函数结束 */

/**
 * 函数: logout
 * 功能: 退出登录。弹出确认对话框，如果用户点击"确定"，
 *       则清除本地存储中的登录信息并跳转到首页。
 * 参数: 无
 * 返回值: 无（undefined）
 *
 * 专业术语解释:
 *   - confirm(): 浏览器内置函数，弹出一个"确定/取消"对话框，
 *     用户点击"确定"返回 true，点击"取消"返回 false
 *   - localStorage.removeItem(): 从本地存储中删除指定键名的数据
 *   - window.location.href: 浏览器的地址栏 URL，
 *     给它赋值会让页面跳转到新的地址
 */
function logout() {
  // 弹出确认框询问用户是否要退出
  if (confirm('确定要退出登录吗？')) {
    // 从本地存储中删除 'currentUser'，清除登录状态
    localStorage.removeItem('currentUser');
    // 将页面跳转到首页 index.html
    window.location.href = 'index.html';
  } /* if (confirm) 结束 */
} /* logout 函数结束 */

// 调用 loadNav() 函数，在页面加载时立即执行导航栏渲染
loadNav();

/**
 * 从当前页面的 URL 中提取新闻 ID
 *
 * 专业术语解释:
 *   - location.search: 当前 URL 中 "?" 及其后面的部分（查询字符串），
 *     例如 "?id=123&name=test"
 *   - URLSearchParams: 浏览器内置的 API（应用程序编程接口），
 *     专门用来解析 URL 中的查询参数
 *     .get('id') 表示获取名为 "id" 的参数的值
 *   - parseInt(): 将字符串转换为整数（Integer），
 *     例如 parseInt("123") 的结果是数字 123
 *
 * 例子: 如果用户访问的是 view.html?id=5
 *   location.search  = "?id=5"
 *   URLSearchParams 解析后 .get('id') 得到 "5"（字符串）
 *   parseInt("5")   得到 5（数字）
 */
const id = parseInt(new URLSearchParams(location.search).get('id'));

/**
 * 从后端 API 获取新闻数据
 *
 * 详细拆解：
 *   1. fetch('https://nanhu-news-api.workers.dev/api/news/' + id)
 *      发送 GET 请求获取指定 ID 的新闻
 *   2. res.ok —— 检查响应状态是否正常（状态码 200-299）
 *   3. res.json() —— 将响应体从 JSON 格式解析为 JavaScript 对象
 *   4. 如果请求失败（res.ok 为 false），news 设为 null
 *
 * 最终结果:
 *   - 如果找到对应 ID 的新闻，news 变量就是一个新闻对象
 *   - 如果没有找到或请求失败，news 变量就是 null
 */

// 获取页面上 id="newsDetail" 的元素，后续用来填充新闻详情内容
// document.getElementById() 是浏览器提供的 DOM（文档对象模型）操作方法
const el = document.getElementById('newsDetail');

// 使用 IIFE（立即执行函数表达式）来支持 async/await
// 因为顶级作用域不能直接使用 await
(async () => {
  const res = await fetch('https://nanhu-news-api.workers.dev/api/news/' + id);
  const news = res.ok ? await res.json() : null;

  /*
   * 条件判断：检查新闻是否存在
   * !news 表示"取反"——如果 news 是 null（不存在），!news 为 true
   * 如果新闻不存在，进入 if 分支，显示"新闻不存在"的提示
   * 否则进入 else 分支，显示新闻详情
   */
  if (!news) {
    /*
     * 新闻不存在时的处理：
     * 在 newsDetail 元素中插入一段提示 HTML
     * <h1> 是大标题标签
     * <p> 是段落标签
     * &laquo; 是 HTML 实体，显示为 « 符号（双左尖括号）
     * class="btn btn-link" 是 CSS 类名，用来控制样式
     */
    el.innerHTML = '<h1>新闻不存在</h1><p>请返回首页查看其他新闻</p><div class="news-footer"><a href="index.html" class="btn btn-link">&laquo; 返回首页</a></div>';
  } /* if (!news) 结束——新闻不存在分支结束 */
  else {
    /*
     * 新闻存在时的处理：显示新闻详情
     * 首先从本地存储中获取当前登录的用户信息
     * 用于判断"当前用户是否是本文作者"以决定是否显示编辑按钮
     */
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');

    /*
     * 渲染新闻详情 HTML
     *
     * 使用字符串拼接（+ 号连接多行字符串）构建完整的新闻详情内容，
     * 赋值给 el.innerHTML，浏览器会自动解析渲染。
     *
     * 各个部分的含义：
     *
     * 1. <h1> + news.title + </h1>
     *    —— 新闻标题，用一级标题显示
     *
     * 2. news-meta 区域：
     *    —— 显示作者名称和发布时间
     *    news.authorName: 新闻的作者名字
     *    new Date(news.createdAt).toLocaleString('zh-CN'):
     *       - new Date() 将时间戳/日期字符串转换为 Date 日期对象
     *       - toLocaleString('zh-CN') 按中国的时间格式显示，
     *         例如 "2026/6/4 下午3:30:00"
     *
     * 3. news-content 区域：
     *    —— 新闻正文内容
     *
     * 4. news-footer 区域：
     *    —— 底部操作区
     *    - "返回首页"链接始终显示
     *    - "编辑"按钮仅在当前用户是新闻作者时显示
     *      判断条件：user && user.id === news.authorId
     *      - user: 当前登录用户（如果未登录则为 null）
     *      - user.id: 当前登录用户的 ID
     *      - news.authorId: 新闻作者的 ID
     *      两者相等，说明当前用户就是作者，显示编辑按钮
     *      如果不等或未登录，则不显示（三元运算符返回空字符串 ''）
     */
    el.innerHTML =
      '<h1>' + news.title + '</h1>' +                                         /* 新闻标题 */
      '<div class="news-meta">作者: ' + news.authorName +                     /* 作者名 */
      ' | 发布时间: ' + new Date(news.createdAt).toLocaleString('zh-CN') +    /* 格式化后的发布时间 */
      '</div>' +
      '<div class="news-content">' + news.content + '</div>' +                /* 新闻正文 */
      '<div class="news-footer">' +                                           /* 底部区域开始 */
        '<a href="index.html" class="btn btn-link">&laquo; 返回首页</a>' +    /* 返回首页链接 */
        /*
         * 条件渲染编辑按钮：
         * user && user.id === news.authorId 的含义：
         *   1. 先判断 user 是否为真（即用户是否已登录）
         *   2. 如果已登录，再判断 user.id 是否等于 news.authorId
         *   3. 两个条件都满足 → 显示编辑按钮
         *   4. 任一条件不满足 → 显示空字符串（不显示按钮）
         * 编辑按钮链接到 edit.html?id=xxx，其中 xxx 是新闻的 ID
         */
        (user && user.id === news.authorId ? '<a href="edit.html?id=' + news.id + '" class="btn">编辑</a>' : '') +
      '</div>'; /* news-footer 结束 */
  } /* else 结束——新闻存在分支结束 */
})(); /* IIFE 结束 */
