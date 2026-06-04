/**
 * register_JS.js - 用户注册页
 * 功能：提供用户名、密码、确认密码的注册表单
 * 数据存储：使用后端 API 将用户数据保存在服务器
 * 
 * ─── 专业术语解释（面向零基础读者）────────────────────────────
 * 
 * 【localStorage】
 *   浏览器提供的一个"本地存储"功能，类似于一个放在你电脑硬盘上的小仓库。
 *   你可以用 setItem(键, 值) 往里面存东西，用 getItem(键) 从里面取东西。
 *   即使你把浏览器关掉再打开，里面的数据依然存在（除非手动清除）。
 *   注意：它只能存储"字符串"类型的数据（所以存对象前要先转成字符串）。
 * 
 * 【JSON】
 *   JavaScript Object Notation（JavaScript 对象表示法）的缩写。
 *   它是一种"文本格式"，用来在不同系统之间传递数据。
 *   例如：{"name":"张三","age":18} 就是一个 JSON 格式的字符串。
 * 
 * 【JSON.parse(...)】
 *   把 JSON 格式的"字符串"转换回 JavaScript 的"对象/数组"。
 *   类比：把一段描述文字的纸条（字符串）还原成真实的物体（对象）。
 *   例如：JSON.parse('[{"id":1}]') 的结果是 [{id: 1}]（真正的数组）。
 * 
 * 【JSON.stringify(...)】
 *   和 JSON.parse 相反——把 JavaScript 的"对象/数组"转换成"字符串"。
 *   类比：把一个真实的物体（对象）用文字描述下来（变成字符串）。
 *   例如：JSON.stringify({name:"张三"}) 的结果是 '{"name":"张三"}'。
 *   为什么需要它？因为 localStorage 只能存字符串，不能直接存对象。
 * 
 * 【fetch API】
 *   浏览器内置的用于发送 HTTP 请求的接口。
 *   它可以向服务器发送请求（如 GET、POST），并获取服务器的响应。
 *   比老旧的 XMLHttpRequest（XHR）更现代、更易用。
 * 
 * 【async/await】
 *   JavaScript 中处理异步操作（如网络请求）的语法。
 *   async 用来声明一个异步函数，await 用来等待一个异步操作完成。
 *   简单理解：await 让 JavaScript "等着"网络请求回来再继续执行。
 *   类比：你在网上买了东西，await 就像"等快递到了再拆箱"。
 * 
 * 【箭头函数 (=>)】
 *   ES6（2015年）引入的一种更简洁的函数写法。
 *   传统写法：function(u) { return u.username === username; }
 *   箭头函数：u => u.username === username
 *   两者的作用完全一样，箭头函数只是写起来更短。
 *   如果箭头函数只有一行，可以省略 return 和大括号。
 * 
 * 【addEventListener】
 *   给 HTML 元素"绑定"一个事件监听器。
 *   第一个参数是事件类型（如 'submit' 表示"提交"事件），
 *   第二个参数是事件发生时执行的函数。
 *   类比：你在门上装了一个门铃（监听器），有人按门铃（事件发生）时，
 *        门铃就会响（函数执行）。
 * 
 * 【e.preventDefault()】
 *   e 是事件对象（Event），它包含了事件的相关信息。
 *   preventDefault() 的意思是"阻止默认行为"。
 *   例如：表单的默认行为是提交页面并刷新——但我们想用 JavaScript 自己
 *   处理数据，不需要页面刷新，所以调用这个方法阻止默认行为。
 * 
 * 【window.location.href】
 *   window 代表浏览器窗口，location 代表地址栏，href 代表当前网址。
 *   给 href 赋值 = 让浏览器跳转到新页面。
 *   例如：window.location.href = 'login.html' 相当于用户在地址栏
 *   输入 login.html 并按了回车。
 * ────────────────────────────────────────────────────────────
 */

/**
 * DEFAULT_AVATAR - 新用户的默认头像 URL
 * 
 * 什么是 URL？
 *   URL（Uniform Resource Locator，统一资源定位符）就是网址。
 *   这个网址指向一张默认的卡通人物头像图片。
 * 
 * 为什么用 const？
 *   const 声明一个"常量"——一旦赋值就不能再改变。
 *   这里的默认头像地址在整个程序运行期间不应被修改，所以用 const。
 * 
 * 为什么不用 let 或 var？
 *   let 用于"变量"（值可以改变），var 是旧式声明（不推荐使用）。
 *   对于不会改变的值，用 const 更安全、语义更清晰。
 */
const DEFAULT_AVATAR = 'https://ts1.tc.mm.bing.net/th/id/R-C.5c5224bd34a0aee8c411509e0d154575?rik=4fXwdrQ3mRIlvw&riu=http%3a%2f%2fbpic.588ku.com%2felement_pic%2f01%2f55%2f09%2f4557474d965eb71.jpg&ehk=wlOkaUqmQA0OH26%2bPRQ4JBO3sk6Wv8ID%2flpRkImF23Y%3d&risl=&pid=ImgRaw&r=0';

/**
 * DEFAULT_BIO - 新用户的默认个人简介
 * 
 * bio 是 biography（个人简介）的缩写，就是用户在个人主页上
 * 展示的一段自我介绍文字。新用户注册时还没有填写简介，
 * 所以先给一个默认文字占位。
 */
const DEFAULT_BIO = '这个人还没有简介哦~';

/**
 * handleRegister - 处理注册表单提交
 * 
 * 【功能】
 *   当用户点击注册按钮时，这个函数会被调用。
 *   它负责：验证输入 → 调用后端 API 注册 → 跳转到登录页面。
 *   用户数据保存在服务器端，不再使用 localStorage。
 * 
 * 【参数】
 *   e (Event) - 事件对象。
 *     当表单的 'submit'（提交）事件被触发时，浏览器会自动创建一个
 *     事件对象，其中包含了此次事件的各种信息。
 *     这个对象会作为第一个参数自动传入 handleRegister 函数。
 *     注意：这个参数不是我们手动传的，是 addEventListener 自动传的。
 * 
 * 【返回值】
 *   无（undefined）。函数执行完毕后不返回任何值。
 *   它直接操作页面（显示错误信息）和调用后端 API（注册用户）。
 */
async function handleRegister(e) {
  /* ─────────────────────────────────────────────────────
   * 第1步：阻止表单的默认提交行为
   * ───────────────────────────────────────────────────── */
  // e.preventDefault() —— 告诉浏览器"不要刷新页面，让我自己来处理"。
  // 表单的默认行为是：将数据发送到服务器并刷新页面。但我们用的是
  // JavaScript 异步请求，不需要页面刷新，所以阻止默认行为。
  e.preventDefault();
  // ↑ 结束：阻止表单默认提交行为

  /* ─────────────────────────────────────────────────────
   * 第2步：获取用户在表单中输入的值
   * ───────────────────────────────────────────────────── */

  /**
   * document.getElementById('username')
   *   document 代表整个 HTML 文档。
   *   getElementById 是"通过 id 获取元素"的意思。
   *   它会返回 id="username" 的那个 HTML 元素（一个 <input> 输入框）。
   * 
   * .value
   *   获取输入框里当前用户输入的文字。
   *   如果你的 HTML 是 <input type="text" id="username">，
   *   那么 .value 就是用户在里面打的内容。
   * 
   * .trim()
   *   去掉字符串开头和结尾的空格（空白字符）。
   *   如果用户输入了 "  张三  "，trim() 会把它变成 "张三"。
   *   这是为了避免用户不小心多打了空格导致验证失败。
   */
  const username = document.getElementById('username').value.trim();
  // ↑ 变量 username：存储用户输入的用户名（已去除首尾空格）

  /**
   * 获取密码输入框的值。
   * 注意：这里没有调用 .trim()，因为密码中可能包含空格（虽然少见），
   * 但我们通常认为密码中的空格也是密码的一部分，不应去掉。
   */
  const password = document.getElementById('password').value;
  // ↑ 变量 password：存储用户输入的密码（保留原样，不去空格）

  /**
   * 获取确认密码输入框的值。
   * confirmPassword 用于让用户再次输入一次密码，以确认他没有打错。
   * 后面会与 password 比较是否一致。
   */
  const confirmPassword = document.getElementById('confirmPassword').value;
  // ↑ 变量 confirmPassword：存储用户第二次输入的密码

  /**
   * errEl —— error element（错误元素）的缩写
   * 获取 id="error" 的 HTML 元素。
   * 这个元素通常是一个 <div> 或 <span>，初始时是隐藏的（display: none），
   * 当有错误时，我们会修改它的 textContent（文字内容）并将它显示出来。
   */
  const errEl = document.getElementById('error');
  // ↑ 变量 errEl：用于显示错误信息的 HTML 元素

  /* ─────────────────────────────────────────────────────
   * 第3步：验证字段是否填写完整
   * ───────────────────────────────────────────────────── */

  /**
   * if (!username || !password || !confirmPassword)
   * 
   * 【逻辑运算符 ||（逻辑或）】
   *   A || B 的意思是：如果 A 为真，结果是 A；否则结果是 B。
   *   多个 || 连起来：只要其中有一个为真，整个条件就为真。
   * 
   * 【!（逻辑非/取反）】
   *   !username 的意思是"如果 username 是空值则为 true"。
   *   在 JavaScript 中，以下值被视为"假值"（falsy）：
   *     - ""（空字符串）、0、null、undefined、NaN、false
   *   如果一个字符串为空（""），!"" 就等于 true。
   * 
   * 【条件组合的含义】
   *   如果 username 为空 或者 password 为空 或者 confirmPassword 为空，
   *   就进入下面的代码块执行错误提示。
   */
  if (!username || !password || !confirmPassword) {
    // ↓ 如果用户没有填写完整，执行此代码块

    // 设置错误提示元素的文字内容为"请填写所有字段"
    errEl.textContent = '请填写所有字段';

    // 将错误提示元素的 display 样式设为 'block'，让它显示出来
    // 默认它是隐藏的（display: none），设置为 block 后就可见了
    errEl.style.display = 'block';

    // return 语句：提前结束函数的执行，不再继续执行后续代码
    // 也就是说：一旦发现有空字段，就不执行注册请求了
    return;

  // ↓ 结束：if (!username || !password || !confirmPassword) 的代码块
  }

  /* ─────────────────────────────────────────────────────
   * 第4步：验证密码长度
   * ───────────────────────────────────────────────────── */

  /**
   * password.length —— 获取密码字符串的长度
   * 例如："abc".length 的结果是 3。
   * 
   * if (password.length < 6)
   * 如果密码长度小于 6 个字符，就提示用户密码太短。
   */
  if (password.length < 6) {
    // ↓ 密码太短，执行此代码块

    errEl.textContent = '密码长度至少6位';
    errEl.style.display = 'block';
    return;  // 提前结束函数

  // ↓ 结束：if (password.length < 6) 的代码块
  }

  /* ─────────────────────────────────────────────────────
   * 第5步：验证两次密码输入是否一致
   * ───────────────────────────────────────────────────── */

  /**
   * password !== confirmPassword
   * !== 是"严格不等于"运算符，判断左右两边的值是否不相等。
   * 如果 password 的值和 confirmPassword 的值不相同，
   * 就说明用户两次输入的不一致。
   */
  if (password !== confirmPassword) {
    // ↓ 两次密码不一致，执行此代码块

    errEl.textContent = '两次密码输入不一致';
    errEl.style.display = 'block';
    return;  // 提前结束函数

  // ↓ 结束：if (password !== confirmPassword) 的代码块
  }

  /* ─────────────────────────────────────────────────────
   * 第6步：调用后端 API 完成注册
   * ───────────────────────────────────────────────────── */

  /**
   * try/catch 语句
   * 
   * 网络请求可能会因为断网、服务器宕机等原因失败。
   * try 块中放可能出错的代码，如果出错，catch 块会捕获错误。
   * 这样即使用户的网络断了，页面也不会崩溃，而是显示友好的错误提示。
   */
  try {

    /**
     * fetch() 函数 - 发送 HTTP 请求到后端 API
     * 
     * fetch 是浏览器内置的网络请求 API，用来代替老旧的 XMLHttpRequest。
     * 它返回一个 Promise（承诺）对象，表示"将来会有的结果"。
     * 
     * 第一个参数：请求的 URL
     *   这里指向注册 API：https://nanhu-news-api.workers.dev/api/register
     * 
     * 第二个参数：请求配置对象
     *   - method: 'POST'           → HTTP 方法，POST 表示"提交/创建"数据
     *   - headers: { 'Content-Type': 'application/json' }
     *                              → 告诉服务器："我发的是 JSON 格式的数据"
     *   - body: JSON.stringify({ username, password })
     *                              → 把用户名和密码转成 JSON 字符串作为请求体
     *                              例如：'{"username":"张三","password":"123456"}'
     * 
     * await 关键字
     *   因为网络请求是"异步"的（需要时间等待服务器响应），
     *   await 让 JavaScript 暂停执行，等服务器返回结果后再继续。
     *   类比：你点了外卖，await 就是等着外卖送到再拆开吃。
     * 
     * res 变量：服务器返回的响应（Response）对象
     */
    const res = await fetch('https://nanhu-news-api.workers.dev/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    /**
     * res.json() - 读取响应体中的 JSON 数据
     * 
     * 服务器返回的响应体通常是一个 JSON 字符串，
     * 例如成功时返回：'{"message":"注册成功"}'
     * 失败时返回：'{"error":"用户名已存在"}'
     * 
     * res.json() 会把这个字符串解析成 JavaScript 对象，
     * 这样我们就可以用 data.message 或 data.error 来访问了。
     * 
     * 注意：这个操作也是异步的，需要 await。
     * 
     * data 变量：存储解析后的服务器响应数据
     */
    const data = await res.json();

    /**
     * if (!res.ok) - 检查服务器是否返回了"失败"状态
     * 
     * res.ok 是 Response 对象的一个属性：
     * - 如果 HTTP 状态码是 200-299（成功），res.ok = true
     * - 如果 HTTP 状态码是 400、500 等（失败），res.ok = false
     * 
     * 常见的注册失败情况：
     * - 400 Bad Request：请求数据格式错误
     * - 409 Conflict：用户名已被注册
     * - 500 Internal Server Error：服务器内部错误
     * 
     * 服务器会在响应体中返回 error 字段说明具体原因，
     * 我们把它显示在页面上让用户知道。
     */
    if (!res.ok) {
      // ↓ 注册失败，显示服务器返回的错误信息
      errEl.textContent = data.error;    // 例如："用户名已存在"
      errEl.style.display = 'block';     // 让错误提示显示出来
      return;                            // 提前退出，不再继续执行

    // ↓ 结束：if (!res.ok) 的代码块
    }

  /* ─────────────────────────────────────────────────────
   * 第7步：注册成功，跳转到登录页面
   * ───────────────────────────────────────────────────── */

    /**
     * window.location.href = 'login.html'
     * 
     * window 是浏览器窗口的全局对象。
     * location 是 window 的一个属性，代表当前页面的地址栏信息。
     * href 是 location 的一个属性，代表当前页面的完整 URL。
     * 
     * 给 href 赋值一个 URL，浏览器就会立即导航到那个页面。
     * 效果等同于用户在地址栏输入 login.html 并按回车。
     * 
     * 注册成功后为什么要跳转到登录页？
     *   因为注册流程通常是：注册 → 跳转到登录页 → 用户用刚注册的
     *   账号密码登录。这是一种常见的用户体验设计模式。
     * 
     * 注意：注册成功后台自动返回登录页，不保存 token（用户还没登录），
     * 用户需要在登录页输入账号密码进行登录。
     */
    window.location.href = 'login.html';
    // ↑ 结束：页面跳转到 login.html

  /**
   * catch (err) - 捕获网络层面的错误
   * 
   * 这里的 err 是 Error（错误）对象，包含了错误详情。
   * 
   * 哪些情况会触发 catch？
   * - 用户断网了（网络连接不可用）
   * - DNS 解析失败（域名打不开）
   * - 服务器完全无响应（宕机了）
   * - 请求超时（服务器太慢）
   * 
   * 注意：HTTP 4xx、5xx 状态码（如 409 用户名已存在）不会触发 catch，
   * 那属于服务器正常返回了响应（res.ok = false），在 if (!res.ok) 中处理。
   * 
   * 只显示"网络错误"而不显示具体技术细节，是出于用户体验和安全考虑。
   */
  } catch (err) {
    // ↓ 网络请求失败，显示通用的网络错误提示
    errEl.textContent = '网络错误，请检查网络连接';
    errEl.style.display = 'block';
    // ↑ 让用户知道是网络出了问题，而不是他的操作有问题
  }

// ↓ 结束：handleRegister 函数
}
