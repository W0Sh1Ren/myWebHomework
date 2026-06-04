/**
 * create_JS.js - 发布新闻页
 * 功能：提供标题和内容的表单，供登录用户发布新新闻
 *       包含 AI 帮写新闻功能，调用 DeepSeek API
 */

// =================== 全局常量定义 ===================

/**
 * DEFAULT_AVATAR - 默认用户头像的 URL 地址
 * 
 * 专业术语解释：
 * - URL（统一资源定位符）：就是网址，用来定位网络上的资源
 * - const（常量关键字）：ES6 引入的关键字，声明一个不可重新赋值的变量
 *   一旦赋值后，不能再通过 = 改变它的值（但如果是对象，其内部属性可以变）
 * 
 * 这里保存的是默认头像图片的链接，当用户没有设置自己的头像时就用这个
 */
const DEFAULT_AVATAR = 'https://ts1.tc.mm.bing.net/th/id/R-C.5c5224bd34a0aee8c411509e0d154575?rik=4fXwdrQ3mRIlvw&riu=http%3a%2f%2fbpic.588ku.com%2felement_pic%2f01%2f55%2f09%2f4557474d965eb71.jpg&ehk=wlOkaUqmQA0OH26%2bPRQ4JBO3sk6Wv8ID%2flpRkImF23Y%3d&risl=&pid=ImgRaw&r=0';

/**
 * DEFAULT_BIO - 默认用户简介文本
 * bio 是 biography（个人简介）的缩写
 * 当用户没有填写个人简介时，页面显示这个默认文本
 */
const DEFAULT_BIO = '这个人还没有简介哦~';

// =================== 头像 HTML 生成函数 ===================

/**
 * avatarHtml - 生成用户头像的 HTML 代码
 * 
 * 功能说明：
 *   根据传入的用户对象，生成一个包含头像图片的 <img> 标签字符串
 *   如果用户没有设置头像，则使用上面定义的默认头像
 * 
 * @param {Object} user - 用户对象，包含用户的各种信息
 *   - user.avatar {string|undefined} 用户头像 URL，如果未设置则为 undefined
 *   - 该函数只使用了 avatar 属性，其他属性（如 username）不影响此函数
 * 
 * @returns {string} 一个完整的 <img> HTML 标签字符串
 *   例如：'<img src="https://example.com/avatar.jpg" alt="" style="...">'
 * 
 * 专业术语解释：
 * - HTML 标签：用来描述网页结构的标记语言，<img> 表示图片
 * - 字符串：用引号包裹的文本数据
 * - 函数：一段可重复调用的代码块，用 function 关键字定义
 * - ||（逻辑或运算符）：如果左边的值为 falsy（如 null/undefined/空字符串），
 *   则取右边的值作为结果
 */
function avatarHtml(user) {
  // 从用户对象中获取 avatar 属性，如果没有（undefined）则使用默认头像
  const avatarUrl = user.avatar || DEFAULT_AVATAR;

  // 拼接并返回完整的 <img> 图片标签字符串
  // style 属性中的样式作用：
  //   width:24px;height:24px       → 图片宽高各 24 像素
  //   border-radius:50%            → 圆形裁剪（圆角 50% 变成正圆）
  //   vertical-align:middle        → 垂直居中对齐（让图片和文字在同一行中间对齐）
  //   margin-right:4px             → 右侧外边距 4 像素（图片和文字之间留空）
  //   object-fit:cover             → 图片按比例填充容器（裁掉多余部分，防止变形）
  return '<img src="' + avatarUrl + '" alt="" style="width:24px;height:24px;border-radius:50%;vertical-align:middle;margin-right:4px;object-fit:cover">';
} /* end of avatarHtml */

// =================== 登录状态检查 ===================

/**
 * checkAuth - 检查用户是否已登录
 * 
 * 功能说明：
 *   从浏览器的 localStorage 中读取当前登录的用户信息
 *   如果没有找到用户信息（未登录），则跳转到登录页面
 * 
 * 专业术语解释：
 * - localStorage：浏览器的本地存储空间，可以把数据保存在用户电脑上
 *   即使关闭浏览器再打开，数据仍然存在（除非手动清除）
 *   就像一个小型数据库，只能在浏览器中访问
 * - JSON.parse()：将 JSON 字符串转换为 JavaScript 对象
 *   JSON（JavaScript Object Notation）是一种轻量级的数据交换格式
 *   例如：JSON.parse('{"name":"张三"}')  →  得到 {name: "张三"}
 *   localStorage 中只能存字符串，所以取出后需要用 JSON.parse 还原为对象
 * - getItem(key)：从 localStorage 中读取指定 key 对应的值
 *   key 就像储物柜的编号，getItem 就是根据编号取出里面的东西
 * - || 'null'：如果 getItem 返回 null（没有找到数据），
 *   则使用字符串 'null' 作为默认值，这样 JSON.parse 会将其解析为 null
 * - window.location.href：浏览器的地址栏 URL
 *   给这个属性赋值会让浏览器跳转到指定页面
 * 
 * @returns {Object|null} 如果已登录，返回包含用户信息的对象；
 *   如果未登录，返回 null（同时页面会跳转）
 */
function checkAuth() {
  // 从 localStorage 中读取 key 为 'currentUser' 的数据
  // localStorage.getItem('currentUser') 可能返回：
  //   - 一个 JSON 字符串（如 '{"id":1,"username":"admin"}'）
  //   - null（如果从未存储过）
  // || 'null' 的意思是：如果 getItem 返回 null，就用字符串 'null' 代替
  // JSON.parse 会把字符串 'null' 解析为 JavaScript 的 null 值
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');

  // 检查 user 是否为 null（即未登录）
  if (!user) {
    // 如果 !user 为 true（user 是 null、undefined 等 falsy 值）
    // 将浏览器地址跳转到 login.html（登录页面）
    window.location.href = 'login.html';
    return null;  // 函数结束，返回 null
  } /* end of if (!user) */

  // 如果 user 存在（已登录），返回用户对象
  return user;
} /* end of checkAuth */

// =================== 页面初始化 ===================

/**
 * 调用 checkAuth() 检查用户是否已登录
 * 将返回的用户对象赋值给全局变量 user
 * 
 * 如果是未登录状态，checkAuth 内部会跳转到登录页，
 * 所以这行之后的代码不会执行（页面已经跳走了）
 */
const user = checkAuth();

/**
 * 如果用户已登录，动态渲染导航栏的 HTML 内容
 * 
 * 专业术语解释：
 * - document.getElementById('id')：通过元素的 id 属性获取页面上的 HTML 元素
 *   就像用身份证号找人一样
 * - .innerHTML：获取或设置元素内部的 HTML 代码
 *   给它赋值时，浏览器会将字符串解析为 HTML 并显示在页面上
 * - 模板字符串（`` 反引号）：ES6 引入的字符串写法，
 *   可以用 ${变量名} 直接嵌入变量，不用像 '...' + 变量 + '...' 那样拼接
 *   但这里用的是普通的字符串拼接（+运算符）
 */
if (user) {
  // 找到 id 为 'navLinks' 的元素（导航链接容器）
  // 将其 innerHTML 设置为包含首页、后台管理、用户信息和退出链接的 HTML
  document.getElementById('navLinks').innerHTML =
    // 首页链接
    '<a href="index.html">首页</a>' +
    // 后台管理链接（需要登录才能访问）
    '<a href="dashboard.html">后台管理</a>' +
    // 用户信息区域：显示头像和欢迎语
    // avatarHtml(user) 返回用户头像的 <img> 标签
    // user.username 是当前登录用户的用户名
    '<span style="color:rgba(255,255,255,.8)">' + avatarHtml(user) + '欢迎, ' + user.username + '</span>' +
    // 个人资料链接（可跳转到个人资料编辑页面）
    '<a href="profile.html" style="color:rgba(255,255,255,.8);text-decoration:none">个人资料</a>' +
    // 退出登录链接（点击后调用 logout 函数）
    '<a href="javascript:logout()">退出</a>';
} /* end of if (user) */

// =================== 退出登录函数 ===================

/**
 * logout - 退出当前登录
 * 
 * 功能说明：
 *   1. 弹出确认对话框询问用户是否确定退出
 *   2. 如果用户点击"确定"：清除 localStorage 中的用户信息，跳转到首页
 *   3. 如果用户点击"取消"：什么也不做
 * 
 * 专业术语解释：
 * - confirm('消息')：浏览器内置的确认对话框函数
 *   弹出一个带有"确定"和"取消"按钮的窗口
 *   用户点击"确定"返回 true，点击"取消"返回 false
 * - localStorage.removeItem(key)：从 localStorage 中删除指定 key 的数据
 *   就像从储物柜中拿走东西
 * - window.location.href：浏览器的地址栏 URL
 *   给它赋值新地址后，浏览器会加载该页面
 */
function logout() {
  // 弹出确认框，询问用户是否确定退出
  if (confirm('确定要退出登录吗？')) {
    // 从 localStorage 中删除 'currentUser' 这条数据
    // 这样下次页面加载时 checkAuth() 就找不到用户了
    localStorage.removeItem('currentUser');
    // 跳转到首页（index.html）
    window.location.href = 'index.html';
  } /* end of if (confirm) */
} /* end of logout */

// =================== AI 帮写新闻 ===================

/**
 * 配置项：DeepSeek API
 * 
 * 专业术语解释：
 * - API（应用程序编程接口）：可以理解为一个"网络服务入口"
 *   我们向某个网址发送请求，API 就会返回我们需要的数据
 *   就像通过餐厅的窗口点餐，把需求递进去，厨房做好后把菜送出来
 * - DeepSeek：一个 AI 大语言模型，可以理解和生成文字
 * 
 * API_KEY 可以从 localStorage 读取（第一次使用时设置）
 * API_URL 是 DeepSeek 的接口地址
 */

/**
 * API_URL - DeepSeek AI 服务的接口地址
 * 
 * 这是 DeepSeek 提供的 API 端点（endpoint）
 * /v1/chat/completions 表示使用聊天补全功能
 * 这个地址接受我们发送的请求，返回 AI 生成的内容
 * 
 * 专业术语解释：
 * - HTTPS（超文本传输安全协议）：HTTP 的加密版本
 *   在网络上传输数据时会对内容进行加密，防止被窃听
 *   URL 开头的 https:// 表示这是一个加密连接
 * - API 端点：API 服务的具体地址，就像商店的具体门牌号
 */
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

/**
 * MODEL - 使用的 AI 模型名称
 * 
 * 'deepseek-chat' 是 DeepSeek 提供的聊天模型
 * 不同的模型有不同的能力和特点（如速度、质量、价格等）
 */
const MODEL = 'deepseek-chat';

/**
 * getApiKey - 获取 API Key（密钥）
 * 
 * 功能说明：
 *   1. 先从 localStorage 中查找是否保存了 API Key
 *   2. 如果有保存，直接使用（不用每次都输入）
 *   3. 如果没有保存，弹窗让用户输入
 *   4. 用户输入后保存到 localStorage，方便下次使用
 * 
 * 专业术语解释：
 * - API Key（API 密钥）：访问 API 服务的"密码"或"令牌"
 *   用来证明你有权限使用这个服务，就像会员卡一样
 *   每个 DeepSeek 用户都有自己的 API Key
 * - prompt()：浏览器内置的输入对话框函数
 *   弹出一个窗口让用户输入文本，用户输入的内容会作为返回值
 *   如果用户点击"取消"，则返回 null
 * - .trim()：去除字符串两端的空白字符（空格、制表符、换行符等）
 *   防止用户不小心在输入前后加了空格
 * 
 * @returns {string|null} 如果用户输入了有效的 API Key，返回该 Key 的字符串；
 *   如果用户取消输入或输入为空，返回 null
 */
function getApiKey() {
  // 从 localStorage 中读取之前保存的 API Key
  // key 是 "钥匙" 的意思，在这里指 API 密钥
  let key = localStorage.getItem('deepseek_api_key');

  // 检查是否没有保存过 API Key（!key 表示 key 为 null 或 undefined）
  if (!key) {
    // 弹窗提示用户输入 DeepSeek API Key
    // prompt() 的第一个参数是提示文字，第二个参数是输入框默认值（这里没传）
    key = prompt('请输入你的 DeepSeek API Key：\n（输入一次后会自动保存，后续不再询问）');

    // 检查用户是否输入了内容（不为 null 且去除空格后不为空字符串）
    // &&（逻辑与运算符）：两边都为 true 才返回 true
    if (key && key.trim()) {
      // 将用户输入的 API Key 保存到 localStorage
      // key.trim() 去除首尾空格后保存
      localStorage.setItem('deepseek_api_key', key.trim());
      // 返回去除空格后的 API Key
      return key.trim();
    } /* end of if (key && key.trim()) */

    // 如果用户取消输入（key 为 null）或输入了空白内容
    // 返回 null 表示没有获取到有效的 API Key
    return null;
  } /* end of if (!key) */

  // 如果 localStorage 中已保存了 API Key，直接返回
  // 这样用户就不需要每次都输入了
  return key;
} /* end of getApiKey */

/**
 * showAiStatus - 在页面上显示 AI 操作的状态信息
 * 
 * 功能说明：
 *   在页面上的一个专门区域（id 为 aiStatus 的元素）中显示文本消息
 *   消息可以是普通信息（蓝色）或错误信息（红色）
 * 
 * 专业术语解释：
 * - DOM 元素：网页上的每个组成部分都是一个"DOM 元素"
 *   比如按钮、文本框、段落等都是 DOM 元素
 *   document.getElementById() 就是用来获取这些元素的方法
 * - className：DOM 元素的 class 属性
 *   通过修改 className 可以改变元素的样式
 *   CSS 中定义了 .alert-info（蓝色）和 .alert-error（红色）两种样式
 * - textContent：元素中显示的纯文本内容（不包含 HTML 标签）
 *   和 innerHTML 的区别：textContent 只显示纯文本，不会解析 HTML
 * - style.display：控制元素的显示/隐藏
 *   'block' 表示显示为块级元素（可见），'none' 表示隐藏
 * 
 * @param {string} msg - 要显示的状态消息文本
 * @param {boolean} isError - 是否为错误消息
 *   true 表示错误（红色样式），false 表示普通信息（蓝色样式）
 */
function showAiStatus(msg, isError) {
  // 获取页面上 id 为 'aiStatus' 的元素（状态消息显示区域）
  const el = document.getElementById('aiStatus');

  // 设置该元素的文本内容为传入的消息文本
  el.textContent = msg;

  // 将元素的 display 样式设为 'block'，使其在页面上可见
  // 因为默认可能是 display:none（隐藏状态）
  el.style.display = 'block';

  // 设置元素的 class 名称以应用不同的样式
  // 如果 isError 为 true，使用 'alert alert-error'（红色错误样式）
  // 如果 isError 为 false，使用 'alert alert-info'（蓝色信息样式）
  // 三元运算符：条件 ? 值1 : 值2  →  条件成立返回值1，否则返回值2
  el.className = 'alert ' + (isError ? 'alert-error' : 'alert-info');
} /* end of showAiStatus */

/**
 * generateByAI - 调用 DeepSeek API 帮写新闻内容
 * 
 * 功能说明：
 *   1. 获取用户已经填写的新闻标题
 *   2. 获取 DeepSeek 的 API Key（如果没有则提示用户输入）
 *   3. 调用 DeepSeek 的 API，将标题发送给 AI 作为提示词
 *   4. AI 返回完整的新闻内容，然后将内容插入到文本编辑器中
 * 
 * 专业术语解释：
 * - async/await：处理异步操作的关键字
 *   async 声明一个函数是异步的（里面可能包含需要等待的操作）
 *   await 等待一个异步操作完成（比如等待网络请求返回结果）
 *   可以理解为：async 说"这个函数需要等待"，await 说"在这里等着"（但不会阻塞页面）
 * - fetch API：浏览器内置的发起网络请求的方法
 *   用于向服务器发送 HTTP 请求并获取响应
 *   功能类似于在浏览器地址栏输入网址访问，但可以在 JavaScript 中控制
 *   fetch 返回一个 Promise（承诺），用 await 等待它完成
 * - Promise（承诺）：JavaScript 中处理异步操作的对象
 *   就像在餐厅点餐后拿到"取餐号"，等餐做好了凭号取餐
 *   pending（等待中）→ fulfilled（完成）或 rejected（失败）
 * - HTTP 方法：POST 表示向服务器提交数据
 *   就像填写表单后点击"提交"按钮
 *   对比 GET（获取数据，就像点击链接查看页面）
 * - HTTP 状态码：服务器返回的响应状态
 *   200 表示成功，404 表示找不到资源，500 表示服务器内部错误
 * - try/catch/finally：JavaScript 的错误处理机制
 *   try 块中放可能出错的代码
 *   catch 块在出错时执行，用于处理错误
 *   finally 块不管是否出错都会执行（通常用于清理工作）
 * - JSON.stringify()：将 JavaScript 对象转换为 JSON 字符串
 *   和 JSON.parse() 相反
 *   例如：JSON.stringify({name:"张三"})  →  '{"name":"张三"}'
 * - HTTP 请求头（Headers）：发送 HTTP 请求时附带的额外信息
 *   就像寄快递时填写的寄件人和收件人信息
 *   Content-Type 告诉服务器数据的格式
 *   Authorization 告诉服务器"我是谁"（身份验证）
 * 
 * 使用的 API 格式：OpenAI 兼容接口格式
 * 这意味着 DeepSeek 的 API 和 OpenAI 的 ChatGPT API 使用相同的请求格式
 */
async function generateByAI() {
  // 获取页面上的 "AI 帮写" 按钮元素，后续需要修改按钮状态
  const btn = document.getElementById('aiBtn');
  // 获取标题输入框（id 为 'title'）中用户输入的值
  // .value 表示输入框中的文字内容
  // .trim() 去除首尾空格
  const title = document.getElementById('title').value.trim();

  // 检查标题是否已填写（如果 title 为空字符串，!title 为 true）
  if (!title) {
    // 在状态区域显示提示消息：请先填写标题
    // 第二个参数 true 表示这是错误/警告消息（红色样式）
    showAiStatus('请先填写新闻标题，AI 会根据标题帮写内容', true);
    // 将输入焦点移动到标题输入框，方便用户直接输入
    // .focus() 方法让元素获得焦点（光标闪烁）
    document.getElementById('title').focus();
    // 提前结束函数，不再继续执行后面的代码
    return;
  } /* end of if (!title) */

  // 调用 getApiKey() 获取 API Key
  // 如果用户之前没有保存过，会弹窗让用户输入
  const apiKey = getApiKey();

  // 检查是否成功获取到 API Key
  if (!apiKey) {
    // 如果没有 API Key，显示错误提示
    // 第二个参数 true 表示这是错误消息
    showAiStatus('需要 API Key 才能使用 AI 帮写功能', true);
    // 提前结束函数
    return;
  } /* end of if (!apiKey) */

  // ===== 设置按钮为加载状态 =====
  // 禁用按钮（disabled = true），防止用户在 AI 生成过程中重复点击
  btn.disabled = true;
  // 修改按钮文本为"生成中..."，给用户视觉反馈
  btn.textContent = '生成中...';
  // 在状态区域显示"正在生成新闻内容..."（普通信息，不是错误）
  showAiStatus('正在生成新闻内容...', false);

  // try 块：尝试执行可能出错的代码
  try {
    /**
     * 调用 DeepSeek API
     * 
     * fetch() 函数向 API_URL 发送一个网络请求
     * 第一个参数是请求地址（API_URL）
     * 第二个参数是一个配置对象，包含请求的各种设置
     * 
     * await 关键字：程序执行到这里会"暂停"，等待网络请求返回结果
     * 这期间页面不会卡死，用户仍然可以操作页面（因为这是异步的）
     * 当服务器返回响应后，await 表达式的结果就是服务器返回的 Response 对象
     */
    const response = await fetch(API_URL, {
      // 请求方法：POST（提交数据，让服务器处理并返回结果）
      method: 'POST',
      // 请求头（Headers）：告诉服务器如何解析我们的请求
      headers: {
        // Content-Type：请求体（body）的数据格式
        // 'application/json' 表示数据是 JSON 格式的
        'Content-Type': 'application/json',
        // Authorization：身份验证信息
        // 'Bearer' 是一种认证方式，后面跟着 API Key
        // 服务器通过这个 Key 识别是谁在调用 API
        'Authorization': 'Bearer ' + apiKey
      },
      // 请求体（body）：发送给服务器的实际数据
      // JSON.stringify() 将 JavaScript 对象转换为 JSON 字符串
      body: JSON.stringify({
        // model：指定要使用的 AI 模型
        model: MODEL,
        // messages：发送给 AI 的消息列表
        // 这是一个数组，包含多条消息
        messages: [
          {
            // role: 'system' 表示系统消息
            // 系统消息用来设定 AI 的角色和行为方式
            // 相当于告诉 AI："你是 xxx，你要做 xxx"
            role: 'system',
            // content：系统消息的具体内容
            // 这里告诉 AI："你是一个新闻编辑..."
            content: '你是一个新闻编辑。根据用户提供的新闻标题，生成一篇完整的新闻报道。要求：内容真实客观、语言正式、段落分明、不少于300字。直接用正文回复，不要加标题。'
          },
          {
            // role: 'user' 表示用户消息
            // 这是用户（我们）发送给 AI 的具体请求
            role: 'user',
            // 用户消息的内容：请根据新闻标题生成内容
            // 标题来自用户在页面上输入的内容
            content: '请根据以下标题生成一篇新闻内容：' + title
          }
        ],
        // temperature：控制 AI 输出的"创造力"程度
        // 取值范围 0~2，值越大输出越有创意/随机
        // 0.7 是一个平衡值，既有一定创意又不会太离谱
        temperature: 0.7,
        // max_tokens：限制 AI 输出的最大长度
        // tokens 是 AI 处理文本的基本单位（一个词或部分词）
        // 2000 tokens 大约相当于 1500 个汉字
        max_tokens: 2000
      })
    });

    // 检查 HTTP 响应状态是否正常
    // response.ok 在状态码为 200-299 时为 true，否则为 false
    // 如果 !response.ok（状态码不是成功范围），说明请求失败了
    if (!response.ok) {
      // 抛出一个错误（Error 对象），包含失败信息
      // response.status 是 HTTP 状态码（如 401、403、500）
      // response.statusText 是对应的状态文本（如 Unauthorized）
      // throw 关键字会立即停止 try 块的后续代码，进入 catch 块
      throw new Error('API 请求失败: ' + response.status + ' ' + response.statusText);
    } /* end of if (!response.ok) */

    // 解析服务器返回的响应体为 JavaScript 对象
    // response.json() 是一个异步方法，它将响应体的 JSON 字符串解析为 JS 对象
    // 可以理解为：服务器返回了一段 JSON 文本，.json() 把它变成我们可以操作的 JS 对象
    // await 等待解析完成
    const data = await response.json();

    /**
     * 从 API 返回的数据中提取 AI 生成的文本内容
     * 
     * API 返回的数据结构（OpenAI 兼容格式）：
     * {
     *   choices: [        // 选项数组（通常只有一个元素）
     *     {
     *       message: {    // AI 返回的消息
     *         role: 'assistant',  // assistant 表示是 AI 的回复
     *         content: '这里是 AI 生成的新闻内容...'  // 实际内容
     *       }
     *     }
     *   ]
     * }
     * 
     * data.choices[0]  → 第一个（也是唯一一个）选项
     * .message         → AI 回复的消息对象
     * .content         → 消息的具体文本内容
     */
    const content = data.choices[0].message.content;

    // 在编辑器的光标位置插入 AI 生成的内容
    // 注意：是"插入"而不是"替换"，所以不会覆盖用户已有的内容
    insertAtCursor(content);
    // 显示成功消息
    showAiStatus('AI 帮写完成！', false);

  } catch (err) {
    /**
     * catch 块：如果 try 块中的任何代码抛出了错误（throw），
     * 程序会立即跳到这里执行
     * 
     * err（Error 对象）包含了错误的详细信息
     * err.message 是错误描述文本
     */
    // 显示错误消息（isError 为 true，红色样式）
    showAiStatus('AI 帮写失败：' + err.message, true);

  } finally {
    /**
     * finally 块：无论 try 块成功还是失败，这里的代码都会执行
     * 
     * 作用：恢复按钮的原始状态
     * 这样 AI 生成完成后（成功或失败），按钮都可以再次点击
     */
    // 启用按钮（解除禁用），允许用户再次点击
    btn.disabled = false;
    // 恢复按钮的原始文本
    btn.textContent = 'AI 帮写';
  } /* end of try-catch-finally */
} /* end of generateByAI */

// =================== 插入图片 ===================

/**
 * insertAtCursor - 在编辑器光标位置插入 HTML
 * 
 * 功能说明：
 *   使用浏览器内置的 execCommand 方法，
 *   在 contenteditable 编辑器（可编辑区域）的光标位置插入指定的 HTML 代码
 * 
 * 专业术语解释：
 * - contenteditable：HTML 的一个属性，让元素变得可编辑
 *   用户可以直接在页面上编辑内容，就像在 Word 中打字一样
 *   这里 id 为 'content' 的元素就是一个可编辑区域
 * - execCommand：浏览器提供的一个方法，用来执行一些编辑命令
 *   比如加粗、插入图片、插入文字等
 *   不过这个方法已经比较"老旧"，浏览器可能会在未来移除它
 *   'insertHTML' 命令可以在光标位置插入 HTML 代码
 * - focus()：让元素获得焦点，光标会出现在该元素中
 *   用户就可以直接在这个位置输入文字
 * 
 * @param {string} html - 要插入的 HTML 代码字符串
 *   例如：'<img src="..." style="...">' 或 '<p>一段文字</p>'
 */
function insertAtCursor(html) {
  // 获取 id 为 'content' 的编辑器元素
  const editor = document.getElementById('content');
  // 让编辑器获得焦点（光标出现在编辑器中）
  editor.focus();
  /**
   * 执行浏览器命令 'insertHTML'，在光标位置插入 HTML
   * 
   * document.execCommand 的三个参数：
   *   第一个参数 'insertHTML'：命令名称，表示插入 HTML
   *   第二个参数 false：是否显示用户界面（通常设为 false）
   *   第三个参数 html：要插入的 HTML 内容
   * 
   * 效果：就像用户在编辑器中粘贴了一段内容
   */
  document.execCommand('insertHTML', false, html);
} /* end of insertAtCursor */

/**
 * insertImageUrl - 通过 URL 插入网络图片
 * 
 * 功能说明：
 *   1. 弹出输入框让用户输入网络图片的 URL 地址
 *   2. 验证用户输入的是否是有效的 URL 格式
 *   3. 如果验证通过，生成图片的 HTML 标签并插入到编辑器光标位置
 * 
 * 专业术语解释：
 * - data: 开头的 URL：Data URL，将图片数据直接嵌入到 URL 中
 *   格式如：data:image/png;base64,iVBOR...（非常长）
 *   不需要额外的网络请求，图片数据就在 URL 字符串中
 */
function insertImageUrl() {
  // 弹窗让用户输入图片的 URL
  // prompt() 返回用户输入的字符串，如果用户点"取消"则返回 null
  const url = prompt('请输入图片的 URL 地址：\n（支持 https:// 开头的网络图片）');

  // 如果用户取消输入（url 为 null）或输入为空字符串，不执行后续操作
  // !url：用户取消输入时 url = null，!null = true
  // !url.trim()：用户输入了空白字符时也会退出
  if (!url || !url.trim()) return;

  // 去除 URL 两端的空白字符
  const trimmed = url.trim();

  // 验证 URL 前缀是否合法
  // 检查 URL 是否以 http://、https:// 或 data: 开头
  // 三种都不满足时，进入 if 块
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:')) {
    // 显示错误提示：请输入有效的图片 URL
    showAiStatus('请输入有效的图片 URL（以 http:// 或 https:// 开头）', true);
    // 结束函数，不执行插入操作
    return;
  } /* end of if (URL 格式验证) */

  // 构建图片的 HTML 标签字符串
  // <img> 标签的属性：
  //   src="..."：图片的 URL 地址
  //   style="max-width:100%;border-radius:4px;margin:8px 0"：样式
  //     max-width:100%  → 图片宽度不超过容器宽度，防止溢出
  //     border-radius:4px  → 图片圆角 4 像素（四个角变圆润）
  //     margin:8px 0  → 上下外边距 8 像素，左右为 0（上下留白）
  //   alt="图片"  → 图片加载失败时显示的替代文字
  const imgHtml = '<img src="' + trimmed + '" style="max-width:100%;border-radius:4px;margin:8px 0" alt="图片">';

  // 调用 insertAtCursor() 在编辑器的光标位置插入图片
  insertAtCursor(imgHtml);
  // 显示操作成功信息
  showAiStatus('网络图片已插入到光标位置', false);
} /* end of insertImageUrl */

/**
 * uploadImage - 上传本地图片并插入到编辑器
 * 
 * 功能说明：
 *   1. 用户通过文件选择器选择一张本地图片
 *   2. 检查文件大小是否超过 5MB 限制
 *   3. 使用 FileReader 读取图片文件
 *   4. 使用 Canvas 将图片按比例压缩（最大宽度 800px，JPEG 质量 0.7）
 *   5. 将压缩后的图片转为 base64 格式
 *   6. 生成图片的 HTML 标签并插入到编辑器光标位置
 * 
 * 专业术语解释：
 * - FileReader：浏览器内置的文件读取器
 *   可以读取用户选中的文件内容
 *   .readAsDataURL() 将文件读取为 Data URL（base64 编码的字符串）
 * - Canvas（画布）：HTML5 提供的一个绘图区域
 *   可以在上面绘制图形、处理图片等
 *   getContext('2d') 获取 2D 绘图上下文（相当于画笔）
 * - base64：一种将二进制数据编码为文本的方式
 *   图片文件是二进制数据，转换为 base64 后可以直接嵌入到 HTML 中
 *   缺点是数据体积会比原来大约 1/3
 * - toDataURL()：将 Canvas 中的内容导出为图片的 Data URL
 *   'image/jpeg' 指定导出为 JPEG 格式
 *   第二个参数 0.7 是图片质量（0~1，值越高质量越好，文件越大）
 * - 事件（Event）：用户操作时浏览器触发的信号
 *   比如点击、输入、选择文件等都会触发事件
 *   .onload 事件在文件读取完成时触发
 *   .onerror 事件在文件读取失败时触发
 * 
 * @param {HTMLInputElement} input - 文件选择输入框的 DOM 元素
 *   用户通过这个元素选择要上传的图片文件
 *   input.files[0] 就是用户选择的第一个文件
 */
function uploadImage(input) {
  // 获取用户选择的第一个文件
  // input.files 是一个 File 对象数组（用户可能选多个文件）
  // files[0] 表示第一个（也是我们只处理的一个）
  const file = input.files[0];

  // 如果用户没有选择文件（file 为 undefined 或 null），则直接返回
  if (!file) return;

  // ===== 检查文件大小 =====
  // file.size 的单位是字节（byte）
  // 5 * 1024 * 1024 = 5,242,880 字节 ≈ 5MB
  // 1024 字节 = 1KB，1024KB = 1MB
  if (file.size > 5 * 1024 * 1024) {
    // 如果文件超过 5MB，显示错误提示
    showAiStatus('图片大小超过 5MB 限制，请压缩后再上传', true);
    // 清空文件选择输入框的值（这样用户之前选的文件就取消了）
    input.value = '';
    // 结束函数
    return;
  } /* end of if (file.size > 5MB) */

  /**
   * 创建 FileReader 对象来读取文件内容
   * FileReader 是浏览器提供的一个工具，可以读取用户电脑上的文件
   */
  const reader = new FileReader();

  /**
   * reader.onload：文件读取完成后触发的回调函数
   * 这个函数会在文件读取成功后被自动调用
   * 
   * 专业术语解释：
   * - 回调函数（callback）：作为参数传递给另一个函数的函数
   *   可以理解为"等你做完了，记得调用这个函数"
   *   这里的意思是"等文件读取完成后，执行这个函数"
   * - 匿名函数：没有名字的函数，这里 function(e) {...} 就是匿名函数
   *   e（Event 对象）包含了事件的相关信息
   */
  reader.onload = function(e) {
    // e.target 是触发事件的对象，也就是 reader 本身
    // e.target.result 是文件读取的结果（Data URL 格式的字符串）
    // 这个字符串以 data:image/... 开头，后面跟着 base64 编码的数据

    // 创建一个 Image 对象（图片对象），用于在内存中加载图片
    const img = new Image();

    /**
     * img.onload：图片加载完成后触发的回调函数
     * Image 对象的 src 属性设置后，会开始异步加载图片
     * 加载完成后才执行这个函数
     */
    img.onload = function() {
      // ===== 用 Canvas 压缩图片 =====

      // 创建一个 Canvas 元素（画布），用于绘制和导出压缩后的图片
      const canvas = document.createElement('canvas');

      // 定义压缩参数
      const MAX_WIDTH = 800;    // 图片最大宽度 800 像素
      const QUALITY = 0.7;      // JPEG 压缩质量 0.7（范围 0~1）

      // 获取原始图片的宽度和高度
      let width = img.width;
      let height = img.height;

      // 如果图片宽度超过最大宽度，按比例缩小尺寸
      // 保持宽高比不变，防止图片变形
      if (width > MAX_WIDTH) {
        // 等比例计算缩小后的高度
        // 计算公式：新高度 = 原高度 × (最大宽度 ÷ 原宽度)
        // Math.round() 四舍五入取整，保证高度是整数
        height = Math.round(height * MAX_WIDTH / width);
        // 宽度设为最大宽度
        width = MAX_WIDTH;
      } /* end of if (width > MAX_WIDTH) */

      // 设置 Canvas 的尺寸（和压缩后的图片尺寸一致）
      canvas.width = width;
      canvas.height = height;

      // 获取 Canvas 的 2D 绘图上下文
      // ctx 是绘图上下文的缩写，就像拿到的"画笔"
      const ctx = canvas.getContext('2d');

      /**
       * 在 Canvas 上绘制图片
       * drawImage() 的参数：
       *   参数1：要绘制的图片对象（img）
       *   参数2,3：在 Canvas 上绘制的位置（x, y 坐标），从左上角 (0,0) 开始
       *   参数4,5：绘制后的宽度和高度（就是压缩后的尺寸）
       * 
       * 由于 Canvas 的尺寸已设为压缩后的尺寸，
       * 图片会被自动缩放到 Canvas 的大小
       */
      ctx.drawImage(img, 0, 0, width, height);

      /**
       * 将 Canvas 中的内容导出为图片的 Data URL
       * 
       * canvas.toDataURL() 的参数：
       *   第一个参数 'image/jpeg'：导出格式为 JPEG
       *     JPEG 是一种有损压缩格式，文件比 PNG 小很多
       *   第二个参数 QUALITY (0.7)：图片质量，范围 0~1
       *     0.7 表示 70% 质量，在文件大小和画质中取得平衡
       * 
       * 返回值是一个 Data URL 字符串，格式为：
       * data:image/jpeg;base64,/9j/4AAQSkZJRg...
       * 这个字符串可以直接作为 <img> 标签的 src 属性值
       */
      const compressedDataUrl = canvas.toDataURL('image/jpeg', QUALITY);

      // 构建图片的 HTML 标签字符串
      // 使用压缩后的 base64 数据作为图片来源
      // alt 属性使用原始文件名（file.name）
      const imgHtml = '<img src="' + compressedDataUrl + '" style="max-width:100%;border-radius:4px;margin:8px 0" alt="' + file.name + '">';

      // 在编辑器的光标位置插入压缩后的图片
      insertAtCursor(imgHtml);
      // 显示成功消息，提示用户图片已压缩并插入
      showAiStatus('本地图片已压缩插入（' + file.name + '）', false);
    }; /* end of img.onload */

    /**
     * 设置 Image 对象的图片来源
     * 当 src 属性被赋值后，浏览器会开始加载图片
     * e.target.result 是 FileReader 读取到的 Data URL
     * 图片加载完成后会触发上面定义的 img.onload 回调函数
     */
    img.src = e.target.result;
  }; /* end of reader.onload */

  /**
   * reader.onerror：文件读取失败时触发的回调函数
   * 如果用户取消了读取、文件损坏等原因导致读取失败，
   * 浏览器会调用这个函数
   */
  reader.onerror = function() {
    // 显示读取失败的提示信息
    showAiStatus('图片读取失败，请重试', true);
  }; /* end of reader.onerror */

  /**
   * 开始读取文件内容
   * reader.readAsDataURL(file) 将文件读取为 Data URL 格式
   * 
   * 参数 file：要读取的文件对象
   * 读取完成后会自动触发上面定义的 reader.onload 回调函数
   * 读取过程中用户可以做其他事情（异步操作，不会卡住页面）
   */
  reader.readAsDataURL(file);

  // 清空文件选择输入框的值
  // 这样用户下次选择同一张图片时，change 事件仍然会触发
  // 如果不清空，选择同样的文件不会触发 change 事件
  input.value = '';
} /* end of uploadImage */

// =================== 发布新闻 ===================

/**
 * handleCreate - 处理新闻发布
 * 
 * 功能说明：
 *   1. 阻止表单的默认提交行为（防止页面刷新）
 *   2. 获取用户输入的标题和内容
 *   3. 验证标题和内容是否为空
 *   4. 从 localStorage 中读取已有的新闻列表
 *   5. 将新新闻添加到列表中
 *   6. 保存更新后的新闻列表回 localStorage
 *   7. 跳转到后台管理页面
 * 
 * 专业术语解释：
 * - e.preventDefault()：阻止元素的默认行为
 *   表单的默认行为是提交并刷新页面，但我们要用 AJAX/JS 来处理
 *   所以要阻止这个默认行为
 * - .innerHTML：获取元素内部的所有 HTML 内容（包括标签）
 *   和 textContent 不同，innerHTML 会返回 HTML 标签
 *   比如 <p>你好</p> 用 innerHTML 得到 '<p>你好</p>'
 *   用 textContent 得到 '你好'
 * - Date.now()：返回当前时间的毫秒数
 *   从 1970年1月1日 00:00:00 UTC 到现在的毫秒数
 *   这个值是唯一的且递增的，所以常用来生成唯一 ID
 *   Date 是 JavaScript 内置的日期处理对象
 * 
 * 数据流说明：
 *   用户填写表单 → 验证数据 → 存储到 localStorage → 跳转到管理页
 * 
 * 每条新闻的数据结构：
 * {
 *   id: 数字,           // 唯一标识（时间戳）
 *   title: 字符串,      // 新闻标题
 *   content: 字符串,    // 新闻内容（HTML 格式）
 *   authorId: 数字,     // 作者的 ID
 *   authorName: 字符串, // 作者的用户名
 *   createdAt: 数字     // 发布时间（时间戳）
 * }
 * 
 * @param {Event} e - 表单提交事件对象
 *   e 是事件对象，包含了事件的相关信息
 *   比如哪个元素触发了事件、事件类型等
 */
async function handleCreate(e) {
  // 阻止表单的默认提交行为
  // 如果不阻止，页面会刷新，导致我们的 JavaScript 逻辑失效
  e.preventDefault();

  // 获取新闻标题输入框的值，去除首尾空格
  const title = document.getElementById('title').value.trim();

  // 获取新闻编辑器中的 HTML 内容，去除首尾空格
  // 注意这里用 innerHTML 而不是 value（因为编辑器是 contenteditable 元素，不是 input）
  // contenteditable 元素的内容用 innerHTML 获取
  const content = document.getElementById('content').innerHTML.trim();

  // ===== 验证输入不为空 =====
  if (!title || !content) {
    // 如果标题或内容为空，获取错误提示元素
    // id 为 'error' 的元素是页面上的错误消息显示区域
    document.getElementById('error').textContent = '请填写标题和内容';
    // 将错误提示元素设为可见
    document.getElementById('error').style.display = 'block';
    // 结束函数，不执行保存操作
    return;
  } /* end of if (!title || !content) */

  // ===== 调用后端 API 发布新闻 =====
  /**
   * 不再将新闻保存到 localStorage，而是通过后端 API 提交
   * 
   * 从 localStorage 中读取当前登录用户的信息（包含 token 用于身份验证）
   * API 地址：https://nanhu-news-api.workers.dev/api/news
   * HTTP 方法：POST（向服务器提交新资源）
   * 请求头：
   *   Content-Type: application/json  —— 告诉服务器请求体是 JSON 格式
   *   Authorization: Bearer <token>   —— Bearer 身份验证，token 来自登录时保存的用户信息
   * 请求体：包含新闻标题和内容的 JSON 对象
   * 
   * 如果服务器返回成功（res.ok 为 true，HTTP 状态码 200~299），跳转到后台管理页面
   * 如果失败，从响应 JSON 中获取 error 信息并弹窗提示
   */
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const res = await fetch('https://nanhu-news-api.workers.dev/api/news', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + (user ? user.token : '')
    },
    body: JSON.stringify({ title: title, content: content })
  });

  // ===== 处理响应结果 =====
  if (res.ok) {
    // 发布成功，跳转到后台管理页面
    window.location.href = 'dashboard.html';
  } else {
    // 发布失败，从响应中读取错误信息并弹窗提示用户
    const d = await res.json();
    alert(d.error || '发布失败');
  }
} /* end of handleCreate */
