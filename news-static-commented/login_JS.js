/**
 * login_JS.js - 用户登录页
 * 功能：提供用户名和密码的登录表单
 * 登录成功后保存用户信息到 localStorage
 */

/* ============================== 常量定义（程序运行中不会改变的值） ============================== */

/**
 * DEFAULT_AVATAR - 默认用户头像的图片地址（字符串常量）
 * 
 * 作用：当注册用户没有设置自己的头像时，使用这个默认头像图片
 * 
 * 专业术语解释：
 * - 常量（const）：用 const 声明的变量，一旦赋值后就不能再修改
 * - URL（统一资源定位符）：就是网页地址，用来定位互联网上的资源
 * 
 * 这个 URL 指向一个在线的默认头像图片，来自必应（bing）的图片服务器
 */
const DEFAULT_AVATAR = 'https://ts1.tc.mm.bing.net/th/id/R-C.5c5224bd34a0aee8c411509e0d154575?rik=4fXwdrQ3mRIlvw&riu=http%3a%2f%2fbpic.588ku.com%2felement_pic%2f01%2f55%2f09%2f4557474d965eb71.jpg&ehk=wlOkaUqmQA0OH26%2bPRQ4JBO3sk6Wv8ID%2flpRkImF23Y%3d&risl=&pid=ImgRaw&r=0';

/**
 * DEFAULT_BIO - 默认用户个人简介（字符串常量）
 * 
 * 作用：当注册用户没有填写个人简介时，显示这句默认文字
 * "bio" 是 "biography"（传记/简介）的缩写，在社交类网站中通常指用户的个人介绍
 */
const DEFAULT_BIO = '这个人还没有简介哦~';

/**
 * handleLogin - 处理登录表单提交的函数
 * 
 * 【功能说明】
 * 1. 阻止表单默认提交行为（不让页面自动刷新）
 * 2. 获取用户在表单中输入的用户名和密码
 * 3. 调用后端 API（/api/login）验证用户名和密码
 * 4. 登录成功后从服务端获取 token 和用户信息，存入 localStorage（键名为 currentUser）
 * 5. 页面跳转到用户后台管理页面 dashboard.html
 * 
 * 【参数说明】
 * @param {Event} e - 事件对象（Event Object）
 *   类型：Event（事件对象）
 *   作用：当表单提交时，浏览器会创建一个"事件对象"，其中包含了这次提交的相关信息
 * 
 * 【返回值】无（undefined）
 *   这个函数没有 return 语句返回值，它通过修改页面内容和跳转页面来完成功能
 * 
 * 【专业术语解释】
 * - 函数（function）：一段可以被重复调用的代码块，就像"食谱"一样，按步骤执行特定任务
 * - 参数（parameter）：函数运行时需要接收的外部数据
 * - 事件对象（Event）：浏览器自动创建的对象，记录了事件发生时的各种信息
 * - 表单提交（form submit）：用户点击登录按钮或按回车键时触发的动作
 * - async/await：JavaScript 中处理异步操作（如网络请求）的语法糖
 * - fetch API：浏览器内置的用于发送 HTTP 请求的接口
 */
async function handleLogin(e) {
  /**
   * e.preventDefault() - 阻止浏览器的"默认行为"
   * 
   * 默认行为：当表单（<form>）提交时，浏览器会自动刷新页面
   * 但我们希望在"不刷新页面"的情况下，先用 JavaScript 发送登录请求
   * 所以调用 preventDefault() 告诉浏览器："别刷新，让我自己处理！"
   */
  e.preventDefault();

  /**
   * document.getElementById('username') - 通过元素 ID 找到页面上的输入框
   * 
   * 专业术语解释：
   * - document：文档对象，代表整个 HTML 页面
   * - getElementById：根据元素的 id 属性值来查找对应的 HTML 元素
   * - .value：获取用户在该输入框中输入的文字内容
   * - .trim()：去掉字符串开头和结尾的空白字符（空格、制表符等）
   *   例如："  张三  " 经过 trim() 后变成 "张三"
   * 
   * username 变量：存储用户在"用户名输入框"中输入的内容（已去掉首尾空格）
   * 类型：string（字符串）
   */
  const username = document.getElementById('username').value.trim();

  /**
   * 获取"密码输入框"中的内容
   * 注意：这里没有调用 trim()，因为密码中的空格可能是密码的一部分
   * 
   * password 变量：存储用户在"密码输入框"中输入的内容
   * 类型：string（字符串）
   */
  const password = document.getElementById('password').value;

  /**
   * errEl 变量 - 存储"错误信息显示区域"的 DOM 元素对象
   * 
   * DOM（Document Object Model，文档对象模型）：
   * 浏览器把 HTML 页面解析成一棵"节点树"，页面上的每个标签都是树上的一个"节点"
   * 我们可以通过 JavaScript 来操作这些节点（修改内容、样式等）
   * 
   * errEl 拿到了页面上 id 为 "error" 的元素（通常是一个 <div> 标签）
   * 之后可以通过 errEl.textContent 来修改它显示的文字
   * 类型：HTMLElement（HTML 元素对象）
   */
  const errEl = document.getElementById('error');

  /**
   * if 条件判断语句 - 检查用户名或密码是否为空
   * 
   * 逻辑解释：
   * !username 表示 "如果 username 是空字符串"
   *   空字符串 "" 在 JavaScript 中被视为 false（假值），取反 ! 后变成 true
   *   假值（falsy value）包括：null、undefined、0、""、false、NaN
   * || 是"逻辑或"运算符，两边的条件只要有一个为 true，整体就为 true
   * 
   * 所以 !username || !password 的意思是：如果用户名为空或者密码为空
   */
  if (!username || !password) {
    /**
     * textContent 属性 - 设置 HTML 元素中显示的文本内容
     * 和 innerHTML 的区别：textContent 只设置纯文本，更安全
     */
    errEl.textContent = '请填写用户名和密码';

    /**
     * style.display = 'block' - 将元素的 CSS display 属性设置为 'block'
     * display 属性控制元素在页面上的显示方式：
     * - 'none'：元素隐藏，不占据页面空间
     * - 'block'：元素显示为块级元素（独占一行）
     * 
     * 默认情况下，错误信息区域是隐藏的（display: none）
     * 当出现错误时，将其改为 'block' 让用户看到错误信息
     */
    errEl.style.display = 'block';

    /**
     * return 语句 - 提前结束函数的执行
     * 当用户名或密码为空时，没有必要继续执行后面的登录验证逻辑
     * 所以用 return 立即退出 handleLogin 函数
     */
    return;
  } /* --- if (!username || !password) 结束 --- */

  /**
   * try/catch 语句 - 处理异步请求中可能出现的网络错误
   * 
   * 在 JavaScript 中，网络请求可能因为各种原因失败（断网、服务器宕机等）
   * try 块中放置可能出错的代码，catch 块中处理错误
   * 这样即使请求失败，页面也不会崩溃，而是显示友好的错误提示
   */
  try {

    /**
     * fetch() 函数 - 发送 HTTP 请求到后端 API
     * 
     * fetch 是浏览器内置的 API，用于发送网络请求（取代老旧的 XMLHttpRequest）
     * 第一个参数：请求的 URL（统一资源定位符），即后端 API 的地址
     * 第二个参数：一个配置对象，包含请求的方法、头部、请求体等信息
     * 
     * await 关键字 - 等待异步操作完成
     * 因为网络请求需要时间（可能几百毫秒），await 会让 JavaScript 等待
     * 服务器响应后再继续执行下一行代码
     * 
     * 配置对象详解：
     * - method: 'POST'     → HTTP 请求方法，POST 表示"提交数据"
     * - headers: {...}     → 请求头，告诉服务器我们发送的是 JSON 格式数据
     *   'Content-Type': 'application/json' 表示请求体是 JSON 格式
     * - body: JSON.stringify({ username, password })
     *   → 请求体，把用户名和密码转成 JSON 字符串发送给服务器
     *   例如：'{"username":"张三","password":"123456"}'
     * 
     * res 变量（response 的缩写）：
     * 存储服务器返回的响应对象
     * 类型：Response（响应对象）
     */
    const res = await fetch('https://nanhu-news-api.workers.dev/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    /**
     * res.json() - 将响应体解析为 JavaScript 对象
     * 
     * 服务器返回的响应体是一个 JSON 格式的字符串（如 '{"id":1,"username":"张三"}'）
     * res.json() 方法会把这个 JSON 字符串解析成一个 JavaScript 对象
     * 这样我们就可以通过 data.id、data.username 等方式访问数据
     * 
     * 这个操作也是异步的，所以需要 await
     * 
     * data 变量：存储解析后的服务器响应数据
     * 类型：Object（对象）
     */
    const data = await res.json();

    /**
     * if (!res.ok) - 检查 HTTP 响应状态码
     * 
     * res.ok 是 Response 对象的一个布尔值属性
     * - 如果 HTTP 状态码在 200-299 范围内，res.ok 为 true（请求成功）
     * - 否则 res.ok 为 false（请求失败，如 401 未授权、500 服务器错误）
     * 
     * !res.ok 表示"如果请求失败"
     * 
     * 当请求失败时，服务器会返回一个包含 error 字段的 JSON 对象
     * 例如：{"error": "用户名或密码错误"}
     * 我们把这个错误信息显示在页面上让用户看到
     */
    if (!res.ok) {
      errEl.textContent = data.error;       // 显示服务端返回的具体错误信息
      errEl.style.display = 'block';        // 让错误提示区域显示出来
      return;                               // 提前退出，不执行后面的保存逻辑
    }

    /**
     * 登录成功！执行以下操作：
     * 
     * localStorage.setItem(key, value) 详解：
     * - key：存储时的键名，之后用 getItem(key) 来获取
     * - value：要存储的值，必须是字符串
     * 
     * JSON.stringify() 详解：
     * - 将 JavaScript 对象或数组转换成 JSON 字符串
     * - 因为 localStorage 只能存字符串，所以需要先转换
     * 
     * 【存储的数据结构】
     * {
     *   id: data.id,                    // 用户的唯一标识（数字），由服务端分配
     *   username: data.username,        // 用户名
     *   token: data.token,              // 认证 Token（登录凭证），后续请求需要带上
     *   avatar: data.avatar || DEFAULT_AVATAR, // 头像URL，如果没设置就用默认头像
     *   bio: data.bio || DEFAULT_BIO    // 用户简介，如果没设置就用默认简介
     * }
     * 
     * 注意：
     * - 这里特意没有存储 password（密码），这是一个安全设计
     * - 即使 localStorage 被攻击者读取，也无法获取到密码
     * - token 是服务端返回的登录凭证，后续所有 API 请求都需要在
     *   Authorization 请求头中带上这个 token 来验证用户身份
     * - || 运算符在这里用于"提供默认值"：如果 data.avatar 不存在（undefined），就使用 DEFAULT_AVATAR
     */
    localStorage.setItem('currentUser', JSON.stringify({
      id: data.id,                               // 用户的唯一标识符（由服务端生成）
      username: data.username,                    // 用户名
      token: data.token,                          // 认证令牌（JWT Token），用于后续 API 鉴权
      avatar: data.avatar || DEFAULT_AVATAR,      // 头像URL（无则使用默认）
      bio: data.bio || DEFAULT_BIO                // 个人简介（无则使用默认）
    }));

    /**
     * window.location.href - 浏览器页面跳转
     * 
     * window.location 是浏览器地址栏相关的对象
     * .href 属性表示当前页面的完整 URL 地址
     * 给 href 赋新值，浏览器就会立即跳转到那个地址
     * 
     * 'dashboard.html' - 登录成功后要跳转到的页面
     * 这是一个相对路径，表示当前目录下的 dashboard.html 文件
     * 
     * 这行代码的效果等同于用户在浏览器地址栏输入 dashboard.html 并回车
     */
    window.location.href = 'dashboard.html';

  /**
   * catch (err) - 捕获并处理网络层面的错误
   * 
   * 这里的 err 是 Error 对象，包含错误的详细信息
   * 常见的网络错误：
   * - 断网（用户电脑没有连接互联网）
   * - DNS 解析失败（域名无法访问）
   * - 服务器完全无响应（服务宕机）
   * - 请求超时（服务器响应太慢）
   * 
   * 注意：HTTP 4xx/5xx 状态码不会触发 catch，那属于 res.ok 为 false 的情况
   * catch 只捕获网络层面的异常（如断网、DNS 错误等）
   * 
   * 显示"网络错误"而不是具体的错误信息，是为了避免暴露
   * 技术细节给普通用户
   */
  } catch (err) {
    errEl.textContent = '网络错误';           // 显示通用网络错误提示
    errEl.style.display = 'block';            // 让错误提示区域显示出来
  } /* --- try/catch 结束 --- */

} /* --- async function handleLogin(e) 结束 --- */
