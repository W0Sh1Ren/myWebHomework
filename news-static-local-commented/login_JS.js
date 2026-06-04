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
 * 3. 从 localStorage 中读取已注册的用户数据
 * 4. 验证用户名和密码是否与已注册数据匹配
 * 5. 登录成功后将用户信息存入 localStorage（键名为 currentUser）
 * 6. 页面跳转到用户后台管理页面 dashboard.html
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
 */
function handleLogin(e) {
  /**
   * e.preventDefault() - 阻止浏览器的"默认行为"
   * 
   * 默认行为：当表单（<form>）提交时，浏览器会自动刷新页面
   * 但我们希望在"不刷新页面"的情况下，先用 JavaScript 验证用户名和密码
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
   * JSON.parse(localStorage.getItem('users') || '[]')
   * 
   * 【专业术语详解 - localStorage】
   * localStorage（本地存储）：
   * - 浏览器提供的一种"持久化存储"机制
   * - 数据会一直保存在浏览器中，即使关闭页面甚至重启浏览器也不会丢失
   * - 只能存储字符串（string）类型的数据
   * - 每个网站有自己的独立存储空间，不能互相访问
   * 
   * 【专业术语详解 - JSON】
   * JSON（JavaScript Object Notation，JavaScript 对象表示法）：
   * - 一种轻量级的"数据交换格式"，长得和 JavaScript 的对象很像
   * - 因为 localStorage 只能存字符串，所以我们把复杂数据（如数组、对象）用 JSON.stringify 转成字符串保存
   * - 读取时再用 JSON.parse 把字符串转回原来的 JavaScript 数据格式
   * 
   * 【代码逻辑拆解 - 从内向外读】
   * 第1步：localStorage.getItem('users')
   *   → 从 localStorage 中获取键名为 'users' 的数据
   *   → 如果数据不存在，返回 null
   * 第2步：localStorage.getItem('users') || '[]'
   *   → 如果 getItem 返回了 null（没有用户数据），就使用空数组字符串 '[]'
   *   → 这样 JSON.parse 就不会报错了
   * 第3步：JSON.parse(...)
   *   → 把字符串解析成 JavaScript 数组（Array）
   * 
   * users 变量：存储所有已注册用户的数组
   * 每个元素是一个对象，包含 id、username、password 等属性
   * 类型：Array（数组）
   */
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  /**
   * Array.find() 方法 - 在数组中查找第一个满足条件的元素
   * 
   * 语法：array.find(回调函数)
   * 作用：遍历数组中的每一个元素，对每个元素执行回调函数
   *       如果回调函数返回 true，则 find 方法立即返回这个元素
   *       如果遍历完都没有找到，返回 undefined
   * 
   * 【箭头函数语法 u => ... 详解】
   * u => u.username === username && u.password === password
   * 等价于：
   * function(u) {
   *   return u.username === username && u.password === password;
   * }
   * 
   * 箭头函数（Arrow Function）是 ES6（ECMAScript 2015）引入的简写语法
   * - u 是参数，代表数组中的当前元素（这里是一个用户对象）
   * - => 后面是函数体
   * - 当函数体只有一条表达式时，会自动 return 该表达式的结果
   * 
   * 【查找逻辑】
   * u.username === username：当前遍历到的用户的用户名是否等于输入的用户名
   * u.password === password：当前遍历到的用户的密码是否等于输入的密码
   * &&：逻辑与运算符，两边都为 true 结果才为 true
   * 
   * user 变量：存储找到的用户对象
   * 如果找到了，user 就是该用户对象
   * 如果没找到，user 是 undefined
   * 类型：Object | undefined（对象或未定义）
   */
  const user = users.find(u => u.username === username && u.password === password);

  /**
   * if 条件判断 - 验证是否找到了匹配的用户
   * 
   * !user 的含义：
   * - 如果 user 是 undefined（没找到用户）
   * - 在 JavaScript 中，undefined 被视为"假值"（false）
   * - 取反 ! 后变成 true，表示"条件成立，进入 if 代码块"
   * 
   * 也就是说：如果没有找到匹配的用户，就执行下面的错误处理代码
   * 
   * 注意：这里提示的是"用户名或密码错误"
   * 出于安全考虑，不告诉用户是"用户名不存在"还是"密码错误"
   * 这样可以防止黑客通过错误提示来猜测哪些用户名已注册
   */
  if (!user) {
    errEl.textContent = '用户名或密码错误';
    errEl.style.display = 'block';
    return;
  } /* --- if (!user) 结束 --- */

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
   *   id: user.id,                    // 用户的唯一标识（数字）
   *   username: user.username,        // 用户名
   *   avatar: user.avatar || DEFAULT_AVATAR, // 头像URL，如果没设置就用默认头像
   *   bio: user.bio || DEFAULT_BIO    // 用户简介，如果没设置就用默认简介
   * }
   * 
   * 注意：
   * - 这里特意没有存储 password（密码），这是一个安全设计
   * - 即使 localStorage 被攻击者读取，也无法获取到密码
   * - || 运算符在这里用于"提供默认值"：如果 user.avatar 不存在（undefined），就使用 DEFAULT_AVATAR
   */
  localStorage.setItem('currentUser', JSON.stringify({
    id: user.id,                               // 用户的唯一标识符
    username: user.username,                    // 用户名
    avatar: user.avatar || DEFAULT_AVATAR,      // 头像URL（无则使用默认）
    bio: user.bio || DEFAULT_BIO                // 个人简介（无则使用默认）
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
} /* --- function handleLogin(e) 结束 --- */
