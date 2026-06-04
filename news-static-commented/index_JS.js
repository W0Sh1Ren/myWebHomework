/**
 * index_JS.js - 首页（新闻列表）
 * 功能：显示所有已发布的新闻，支持分页浏览
 * 
 * ─────────────────────────────────────────────────────────────
 * 下面这个文件是一个"纯前端"的新闻网站首页逻辑。
 * 它没有后端服务器，所有数据都保存在浏览器的 localStorage 里。
 * 如果你对某些专业术语（如 JSON.parse、localStorage）不太熟悉，
 * 每处都做了详细解释。
 * ─────────────────────────────────────────────────────────────
 */

/* ========== 全局常量 ========== */
/* 「常量」就是「永远不会被重新赋值的变量」，用 const 声明。
   与 let（可重新赋值）不同，const 一但赋值就不能再改。      */

/**
 * DEFAULT_AVATAR —— 默认头像图片的 URL（网络链接）
 * 当某个用户没有上传自己的头像时，就用这张图代替。
 * 它的值是一个完整的图片网址，浏览器会去这个地址下载图片。
 */
const DEFAULT_AVATAR = 'https://ts1.tc.mm.bing.net/th/id/R-C.5c5224bd34a0aee8c411509e0d154575?rik=4fXwdrQ3mRIlvw&riu=http%3a%2f%2fbpic.588ku.com%2felement_pic%2f01%2f55%2f09%2f4557474d965eb71.jpg&ehk=wlOkaUqmQA0OH26%2bPRQ4JBO3sk6Wv8ID%2flpRkImF23Y%3d&risl=&pid=ImgRaw&r=0';

/**
 * DEFAULT_BIO —— 默认个人简介文本
 * 当用户没有填写个人简介时，显示这句提示。
 */
const DEFAULT_BIO = '这个人还没有简介哦~';

/**
 * avatarHtml —— 生成用户头像的 HTML 片段
 * 
 * 【什么是 HTML？】
 * HTML 是网页的"骨架"，浏览器把它解析成你看到的页面。
 * 比如 <img> 标签就是一张图片，<div> 就是一个区块。
 * 这个函数做的就是：拼接出一段 <img> 标签的 HTML 字符串。
 * 
 * @param {Object} user - 用户对象，至少要包含 .avatar 属性
 *   - user.avatar {string|undefined} 用户头像 URL，可能没有这个字段
 * @returns {string} 一段 HTML 字符串，浏览器渲染后就是一个圆形头像
 */
function avatarHtml(user) {
  // 如果用户有头像就用用户的，否则用默认头像
  // 「||」是"或"运算符：左边为假（null/undefined/空字符串）时取右边
  const avatarUrl = user.avatar || DEFAULT_AVATAR;

  // 返回一个 <img> 标签字符串
  // 各 style 样式的作用：
  //   width:24px;height:24px        → 图片宽高 24 像素
  //   border-radius:50%             → 把方形图片切成圆形
  //   vertical-align:middle         → 和旁边的文字垂直对齐
  //   margin-right:4px              → 右侧留 4 像素间距
  //   object-fit:cover              → 保持比例裁剪，不压变形
  return '<img src="' + avatarUrl + '" alt="" style="width:24px;height:24px;border-radius:50%;vertical-align:middle;margin-right:4px;object-fit:cover">';
} /* —— avatarHtml 函数结束 —— */

/**
 * loadNav —— 加载顶部导航栏
 * 
 * 【什么是 localStorage？】
 * localStorage 是浏览器自带的一个"小仓库"，
 * 你可以用 key-value（键-值对）的形式往里面存数据。
 * 就算你关掉浏览器再打开，数据也还在。
 * 它只能存字符串，所以存对象时要先用 JSON.stringify 转成字符串。
 * 
 * 这个函数根据用户是否登录，显示不同的导航菜单项。
 * 
 * @returns {undefined} 没有返回值，只操作 DOM（修改页面内容）
 */
function loadNav() {
  /**
   * JSON.parse —— 把 JSON 字符串还原成 JavaScript 对象
   * 【什么是 JSON？】
   * JSON（JavaScript Object Notation）是一种轻量级的数据交换格式。
   * 它看起来就像 JavaScript 的对象，但本质是字符串。
   * 
   * localStorage.getItem('currentUser')
   *   → 从 localStorage 里取出 key 为 'currentUser' 的值
   *   → 如果不存在，返回 null
   * 
   * 「|| 'null'」→ 如果 getItem 返回 null，就取字符串 'null'
   *   这样 JSON.parse 就能正常解析，而不会报错
   * 
   * 整句话的意思是：
   *   从浏览器仓库里取出 "当前登录的用户信息"，
   *   如果有，从 JSON 字符串变成对象；如果没有，就得到 null。
   */
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');

  // document.getElementById('navLinks')
  //   → 找到 HTML 中 id="navLinks" 的元素
  //   → 这个元素是导航栏里的一个容器（通常是一个 <div> 或 <nav>）
  const links = document.getElementById('navLinks');

  // if (user) —— 如果 user 不是 null/undefined/0/''/false，就为真
  //   也就是说：如果当前有用户登录，就走这个分支
  if (user) {
    // ===== 已登录状态 =====
    // 拼接导航栏的 HTML，内联了用户头像和欢迎语
    // innerHTML 属性：把一段 HTML 字符串插入到元素内部，
    // 浏览器会把它解析成真实的 DOM 节点。
    links.innerHTML = 
      '<a href="index.html">首页</a>' +                                    // 首页链接
      '<a href="dashboard.html">后台管理</a>' +                             // 后台管理链接（只有登录才能看到）
      '<span style="color:rgba(255,255,255,.8)">' +                        // 一段白色半透明文字
        avatarHtml(user) +                                                 // 用户头像（函数返回的 <img> 标签）
        '欢迎, ' + user.username +                                         // 用户名，如 "欢迎, 张三"
      '</span>' +
      '<a href="profile.html" style="color:rgba(255,255,255,.8);text-decoration:none">个人资料</a>' +  // 个人资料页链接
      '<a href="javascript:logout()">退出</a>';                            // 点击执行 logout() 函数
  } else {
    // ===== 未登录状态 =====
    // 只显示首页、登录、注册三个链接
    links.innerHTML = 
      '<a href="index.html">首页</a>' +    // 首页链接
      '<a href="login.html">登录</a>' +    // 登录页链接
      '<a href="register.html">注册</a>';  // 注册页链接
  } /* —— if (user) 条件结束 —— */
} /* —— loadNav 函数结束 —— */

/**
 * logout —— 退出登录
 * 
 * 【函数是什么？】
 * 函数就是把一段代码包起来，取个名字，方便以后重复使用。
 * 比如这里定义了 logout，其他地方就可以写 logout() 来调用它。
 * 
 * 这个函数的功能：
 *   1. 弹出确认框问用户"真的要退出吗？"
 *   2. 如果用户点了"确定"，就清除 localStorage 里的用户信息
 *   3. 然后跳转到首页
 * 
 * @param {void} 不需要参数
 * @returns {undefined} 没有返回值
 */
function logout() {
  // confirm() 是浏览器自带的函数，会弹出一个「确定/取消」对话框
  // 如果用户点「确定」，返回 true；点「取消」，返回 false
  if (confirm('确定要退出登录吗？')) {
    /**
     * localStorage.removeItem('currentUser')
     * 从浏览器的仓库中删除 key 为 'currentUser' 的数据
     * 这样页面刷新后，getItem 就取不到用户信息了
     * 用户就像"没登录"一样。
     */
    localStorage.removeItem('currentUser');

    /**
     * window.location.href —— 浏览器地址栏的网址
     * 给它赋一个新值，浏览器就会跳转到那个页面。
     * 这里跳回首页 index.html。
     */
    window.location.href = 'index.html';
  } /* —— if (confirm(...)) 条件结束 —— */
} /* —— logout 函数结束 —— */

/**
 * getNews —— 从 localStorage 获取所有新闻数据
 * 
 * 【什么叫"获取所有新闻"？】
 * 在这个项目中，新闻数据被保存在浏览器的 localStorage 里，
 * key 是 'news'，value 是一个 JSON 数组字符串。
 * 这个函数做的就是：
 *   1. 从 localStorage 取出 'news' 的值
 *   2. 用 JSON.parse 把 JSON 字符串转成 JavaScript 数组
 *   3. 如果没有数据，就返回空数组 []
 * 
 * @param {void} 不需要传参
 * @returns {Array} 新闻对象数组。每个新闻对象包含：
 *   - id         {string}   新闻唯一标识
 *   - title      {string}   新闻标题
 *   - content    {string}   新闻内容（HTML 格式）
 *   - authorName {string}   作者用户名
 *   - createdAt  {number}   发布时间（Unix 时间戳，毫秒）
 */
function getNews() {
  /**
   * 拆解分析：
   *   localStorage.getItem('news')        → 取字符串，如 '[{...},{...}]'
   *   || '[]'                              → 如果没取到（null），就默认 '[]'
   *   JSON.parse(...)                      → 把 JSON 字符串转成真正的数组
   * 
   * 一句话：从浏览器仓库里拿到新闻数据，转成数组返回。
   * 如果没有新闻，就返回一个空数组 []。
   */
  return JSON.parse(localStorage.getItem('news') || '[]');
} /* —— getNews 函数结束 —— */

/**
 * stripHtml —— 去除 HTML 标签，只保留纯文本
 * 
 * 【为什么需要这个函数？】
 * 新闻内容是以 HTML 格式存储的，里面有 <p>、<img> 等各种标签。
 * 在列表页（首页）我们只需要显示一段文字摘要，
 * 不需要 HTML 标签，所以要去掉它们。
 * 
 * @param {string} html - 可能包含 HTML 标签的原始字符串
 * @returns {string} 纯文本内容，所有标签都被移除
 * 
 * 【实现原理（零基础版）】
 * 浏览器本身就能解析 HTML。我们利用这一点：
 * 1. 创建一个 <div> 元素（仅存在于内存中，不在页面上显示）
 * 2. 把 HTML 字符串放进去
 * 3. 浏览器会自动解析标签，然后我们取纯文本部分
 * 4. textContent 或 innerText 属性就是"去掉标签后的文字"
 */
function stripHtml(html) {
  // document.createElement('div')
  // → 在 JavaScript 内存中创建一个 <div> 元素
  // → 注意：它还没被插入到网页上，只是一个"隐形的容器"
  const tmp = document.createElement('div');

  // 把传入的 HTML 字符串赋值给 innerHTML
  // 浏览器会自动解析里面的标签
  tmp.innerHTML = html;

  /**
   * tmp.textContent —— 获取元素下的所有文本内容，去掉所有 HTML 标签
   * tmp.innerText   —— 类似 textContent，但兼容性更好（老浏览器）
   * || ''            —— 如果两者都没有，返回空字符串
   * 
   * 例如：html = "<p>你好<b>世界</b></p>"
   * 返回：     "你好世界"
   */
  return tmp.textContent || tmp.innerText || '';
} /* —— stripHtml 函数结束 —— */

/**
 * getFirstImage —— 从 HTML 内容里提取第一张图片的 URL
 * 
 * 【为什么需要这个函数？】
 * 新闻内容里可能包含图片。在首页卡片中，
 * 我们想把第一张图提取出来作为"封面图"展示。
 * 
 * @param {string} html - 新闻内容的 HTML 字符串
 * @returns {string|null} 
 *   - 如果找到图片，返回图片的 src 属性值（即图片网址）
 *   - 如果没找到，返回 null
 * 
 * 【实现原理】
 * 和 stripHtml 类似，先把 HTML 解析到内存中的 <div> 里，
 * 然后用 querySelector('img') 找到第一个 <img> 标签，
 * 读取它的 src 属性（图片地址）。
 */
function getFirstImage(html) {
  // 创建临时容器 <div>，用于解析 HTML
  const tmp = document.createElement('div');

  // 把 HTML 放进去，浏览器会自动解析出里面的 DOM 节点
  tmp.innerHTML = html;

  /**
   * tmp.querySelector('img')
   * → 在 tmp 这个容器里查找第一个 <img> 标签
   * → 如果找到，返回这个 img 元素对象
   * → 如果没找到，返回 null
   * 
   * 「querySelector」是"查询选择器"的意思，
   * 它接受一个 CSS 选择器字符串，返回匹配的第一个元素。
   * 这里 'img' 就是标签选择器，匹配 <img> 标签。
   */
  const img = tmp.querySelector('img');

  // 如果 img 存在（不是 null），就返回 img.src（图片地址）
  // 否则返回 null
  // 「三元运算符」：条件 ? 值1 : 值2
  //   如果条件为真，取值1；为假，取值2
  return img ? img.src : null;
} /* —— getFirstImage 函数结束 —— */

/**
 * render —— 渲染新闻列表（核心函数）
 * 
 * 【什么是"渲染"？】
 * 渲染（render）就是把数据变成页面上的内容。
 * 这里我们把新闻数组中的每条新闻转成一张"新闻卡片"，
 * 插入到 HTML 的 #newsList 容器中。
 * 
 * 这个函数做了以下几件事：
 *   1. 刷新导航栏（loadNav）
 *   2. 从 localStorage 读取所有新闻
 *   3. 按发布时间从新到旧排序
 *   4. 如果没有新闻，显示"暂无新闻"提示
 *   5. 如果有新闻，为每一条生成卡片 HTML
 *   6. 将卡片 HTML 整体插入页面
 * 
 * @param {void} 不需要参数
 * @returns {undefined} 没有返回值，只修改 DOM
 */
function render() {
  // ===== 第一步：刷新导航栏 =====
  // 调用 loadNav()，根据登录状态重新生成导航栏内容
  loadNav();  // 先刷新导航栏

  // ===== 第二步：获取并排序新闻 =====
  /**
   * getNews() —— 从 localStorage 拿到新闻数组
   * .sort(...) —— 数组的排序方法
   * 
   * sort 接受一个比较函数 (a, b) => b.createdAt - a.createdAt
   * 【什么是箭头函数？】
   * (参数) => 表达式  是 ES6 引入的简写形式
   * 等价于：function(参数) { return 表达式; }
   * 
   * createdAt 是新闻发布时的"时间戳"（毫秒数）
   * 时间戳越大表示时间越晚。
   * b.createdAt - a.createdAt > 0 时 b 排前面
   * 所以结果就是"最新发布的排最前面"。
   */
  const allNews = getNews().sort((a, b) => b.createdAt - a.createdAt);

  // 找到页面上 id="newsList" 的元素
  // 这个元素是新闻卡片的容器，通常是一个 <div> 或 <section>
  const list = document.getElementById('newsList');

  // ===== 第三步：判断是否有新闻 =====
  // 数组的 length 属性表示元素个数。等于 0 就是没有新闻。
  if (allNews.length === 0) {
    // ——— 没有新闻时的处理 ———

    // 再次获取当前登录用户信息
    // 因为我们要判断：是让用户"注册"还是"发布第一条新闻"
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');

    // 拼接空状态提示的 HTML
    // 如果已登录 → 显示「发布第一条新闻」按钮
    // 如果未登录 → 显示「注册」链接
    list.innerHTML = 
      '<div class="empty-state">' +              // 空状态容器
        '<p>暂无新闻</p>' +                       // 提示文字
        // 下面这一行是三元表达式：如果 user 存在，显示发布按钮；否则显示注册提示
        (user 
          ? '<a href="create.html" class="btn btn-primary">发布第一条新闻</a>' 
          : '<p><a href="register.html">注册</a>后即可发布新闻</p>') + 
      '</div>';

    // 把分页区域清空（因为没有新闻，不需要分页）
    // document.getElementById('pagination') 获取分页容器
    // .innerHTML = '' 表示把里面的内容设为空字符串
    document.getElementById('pagination').innerHTML = '';

    // 结束函数，后面的代码不再执行
    return;
  } /* —— if (allNews.length === 0) 条件结束 —— */

  // ===== 第四步：生成新闻卡片 HTML =====
  /**
   * allNews.map(...) —— 数组的 map 方法
   * 【什么是 map？】
   * map 会遍历数组的每个元素，对每个元素执行一次函数，
   * 然后把所有函数的返回值收集起来，组成一个新数组。
   * 
   * 这里我们把每条新闻 n 转成一段 HTML 字符串（一张卡片）。
   * 
   * .join('') —— 把数组中的所有字符串拼接成一个长字符串
   * 因为 map 返回的是数组 ['<article>...</article>', '<article>...</article>', ...]
   * join('') 把它们拼成一个完整的字符串，中间没有分隔符。
   */
  list.innerHTML = allNews.map(n => {
    // ——— 对每一条新闻 n 的处理 ———

    // stripHtml(n.content)：去掉新闻内容的 HTML 标签，得到纯文本
    const plainText = stripHtml(n.content);

    // getFirstImage(n.content)：提取新闻内容的第一张图片 URL
    const imgSrc = getFirstImage(n.content);

    // 如果有图片（imgSrc 不是 null 也不是 undefined），就生成图片区域的 HTML
    // 否则是一个空字符串（不显示图片）
    // 【loading="lazy"】是浏览器的"懒加载"功能
    // 图片只在即将出现在屏幕时才开始加载，可以节约流量、提高速度
    const imgHtml = imgSrc
      ? '<div class="news-card-image"><img src="' + imgSrc + '" alt="新闻配图" loading="lazy"></div>'
      : '';

    // ===== 返回整张新闻卡片的 HTML 字符串 =====
    return (
      // <article> 是一个语义标签，表示一篇独立的内容
      // onclick 是点击事件：点击卡片跳转到 view.html?id=新闻ID
      // style="cursor:pointer" 让鼠标变成手型，提示可点击
      '<article class="news-card" onclick="location.href=\'view.html?id=' + n.id + '\'" style="cursor:pointer">' +
        
        // 图片部分（如果有图的话显示，没有就不显示）
        imgHtml +
        
        // 卡片正文区域
        '<div class="news-card-body">' +
          
          // 新闻标题，放在 <h2> 标签里（二级标题）
          '<h2>' + n.title + '</h2>' +
          
          // 元信息行：作者名 + 发布时间
          // 【new Date(n.createdAt)】把时间戳转成 Date 对象
          // 【.toLocaleString('zh-CN')】按中国格式显示日期时间
          // 例如："作者: 张三 | 2025/6/4 14:30:00"
          '<div class="news-meta">作者: ' + n.authorName + ' | ' + new Date(n.createdAt).toLocaleString('zh-CN') + '</div>' +
          
          // 摘要：取纯文本的前 200 个字符
          // 如果原文超过 200 字，后面加 "..." 表示被截断了
          // 【substring(0, 200)】从索引 0 取到索引 200（不含 200）
          '<p class="news-summary">' + 
            plainText.substring(0, 200) + 
            (plainText.length > 200 ? '...' : '') + 
          '</p>' +
          
          // "阅读全文" 按钮，是一个链接风格的按钮
          '<span class="btn btn-link">阅读全文</span>' +
        
        '</div>' +  /* —— .news-card-body 结束 —— */
      
      '</article>'  /* —— .news-card 结束 —— */
    );
  }).join('');  /* —— allNews.map 遍历结束，并用 join 拼接所有卡片 —— */

  /* 注意：原始代码中分页部分没有实现（只有新闻列表），
     所以这里没有分页逻辑。 */
} /* —— render 函数结束 —— */

/**
 * 页面加载时立即执行
 * 
 * 【页面加载执行】
 * 当浏览器解析到这一行时，就会调用 render() 函数。
 * 因为 render() 要操作 DOM（如 getElementById），
 * 所以这段代码必须放在 HTML 文件的底部，或者用 DOMContentLoaded 事件。
 * 
 * 在这个项目中，index_JS.js 在 HTML 文件底部通过 <script> 加载，
 * 所以执行时页面上的所有元素都已经准备好了。
 */
render();
