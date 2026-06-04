/**
 * register_JS.js - 用户注册页
 * 功能：提供用户名、密码、确认密码的注册表单
 * 数据存储：使用 localStorage 模拟数据库
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
 *   它负责：验证输入 → 检查用户名是否被占用 → 保存到 localStorage → 跳转页面。
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
 *   它直接操作页面（显示错误信息）和 localStorage（保存用户数据）。
 */
function handleRegister(e) {
  /* ─────────────────────────────────────────────────────
   * 第1步：阻止表单的默认提交行为
   * ───────────────────────────────────────────────────── */
  // e.preventDefault() —— 告诉浏览器"不要刷新页面，让我自己来处理"。
  // 表单的默认行为是：将数据发送到服务器并刷新页面。但我们用的是
  // localStorage（本地存储），不需要与服务器通信，所以阻止默认行为。
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
    // 也就是说：一旦发现有空字段，就不执行保存用户数据了
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
   * 第6步：从 localStorage 中读取已有的用户数据
   * ───────────────────────────────────────────────────── */

  /**
   * localStorage.getItem('users')
   *   从 localStorage 中获取键（key）为 'users' 的数据。
   *   这里的 'users' 就像仓库里的一个抽屉标签，
   *   我们为它分配一个唯一的名字，方便以后存取。
   *   如果之前没有存过任何用户数据，getItem 会返回 null。
   * 
   * || '[]'
   *   ||（逻辑或）在这里的作用是"提供默认值"。
   *   如果 localStorage.getItem('users') 返回 null（没有数据），
   *   就用 '[]'（一个空数组的 JSON 字符串）替代。
   *   这样可以确保后面的 JSON.parse 永远不会收到 null，
   *   避免程序报错崩溃。
   * 
   * JSON.parse(...)
   *   把 JSON 格式的字符串解析成真正的 JavaScript 数组。
   *   localStorage 只能存字符串，所以存的时候我们用 JSON.stringify
   *   把数组转成字符串，取的时候就用 JSON.parse 把字符串转回数组。
   * 
   * 【数据类型推导】
   *   users 是一个数组（Array），里面每个元素是一个"用户对象"。
   *   例如：[{ id: 1, username: "张三", password: "123456" }]
   */
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  // ↑ 变量 users：存储所有已注册用户的数组

  /* ─────────────────────────────────────────────────────
   * 第7步：检查用户名是否已被注册
   * ───────────────────────────────────────────────────── */

  /**
   * users.find(u => u.username === username)
   * 
   * 【Array.find(回调函数)】
   *   find 是 JavaScript 数组的一个方法。
   *   它遍历数组中的每一个元素，对每个元素执行回调函数，
   *   如果回调函数返回 true，find 就返回那个元素并停止查找。
   *   如果所有元素都不满足条件，find 返回 undefined。
   * 
   * 【参数 u】
   *   u 是 find 的回调函数的参数，代表数组中的当前元素。
   *   这里每个元素 u 是一个用户对象 { id, username, password, ... }。
   *   你也可以写成 user，但为了简洁习惯写成 u。
   * 
   * 【回调函数 u => u.username === username】
   *   这是一个箭头函数。
   *   如果当前用户对象 u 的 username 属性等于用户输入的 username，
   *   就返回 true（找到了匹配的用户）。
   * 
   * 【整个表达式的含义】
   *   在 users 数组中查找 username（数据库中的用户名）
   *   等于 username（用户当前输入的用户名）的用户。
   *   如果找到了，说明该用户名已被注册。
   */
  if (users.find(u => u.username === username)) {
    // ↓ 如果找到了相同的用户名，说明已被注册

    errEl.textContent = '用户名已存在';
    errEl.style.display = 'block';
    return;  // 提前结束函数

  // ↓ 结束：if (users.find(u => u.username === username)) 的代码块
  }

  /* ─────────────────────────────────────────────────────
   * 第8步：将新用户保存到 localStorage
   * ───────────────────────────────────────────────────── */

  /**
   * users.push({...})
   *   push 是数组的方法，作用是在数组末尾"追加"一个新元素。
   *   类比：往一个排队队伍的末尾加一个人。
   * 
   * 【新用户对象】
   *   id: Date.now()
   *     Date.now() 返回当前时间的"毫秒时间戳"。
   *     时间戳是从 1970年1月1日00:00:00 UTC 到现在的毫秒数。
   *     例如：1717500000000
   *     用时间戳做 ID 的好处是：两次调用 Date.now() 几乎不可能得到
   *     相同的值（因为时间在流逝），所以可以用作唯一标识。
   *     注意：严格来说这不绝对唯一（同一毫秒内可能重复），
   *     但对于这个简单的示例来说已经足够了。
   *   
   *   username: username
   *     这是 ES6 的"属性简写"语法。
   *     如果属性名和变量名相同，可以只写一次。
   *     相当于 username: username（变量 username 的值赋给属性 username）。
   *   
   *   password: password（同上，简写）
   *   
 *   createdAt: Date.now()
   *     记录用户的注册时间（时间戳格式）。
   *     以后可以用来显示"注册于 X 天前"之类信息。
   *   
   *   avatar: DEFAULT_AVATAR
   *     使用前面定义的默认头像 URL。
   *   
   *   bio: DEFAULT_BIO
   *     使用前面定义的默认个人简介文字。
   */
  users.push({
    id: Date.now(),       // ↓ 唯一标识：用当前时间戳生成
    username,             // ↓ 用户名（简写属性）
    password,             // ↓ 密码（简写属性）
    createdAt: Date.now(),// ↓ 注册时间戳
    avatar: DEFAULT_AVATAR, // ↓ 默认头像 URL
    bio: DEFAULT_BIO      // ↓ 默认个人简介
  });
  // ↑ 结束：users.push(...)

  /**
   * localStorage.setItem('users', JSON.stringify(users))
   * 
   * 【JSON.stringify(users)】
   *   将 users 数组（JavaScript 对象）转换成 JSON 字符串。
   *   例如：[{id:1, username:"张三"}] 变成 '[{"id":1,"username":"张三"}]'
   *   这一步是必须的，因为 localStorage 只能存储字符串。
   * 
   * 【localStorage.setItem('users', ...)】
   *   将转换后的 JSON 字符串存入 localStorage，键为 'users'。
   *   这相当于把数据"覆盖"写回仓库——旧的 'users' 数据会被替换。
   *   因为我们在上面已经用 push 添加了新用户，所以现在 users 数组
   *   包含了旧用户 + 新用户，setItem 会把完整的数据存回去。
   */
  localStorage.setItem('users', JSON.stringify(users));
  // ↑ 结束：将更新后的用户列表保存到 localStorage

  /* ─────────────────────────────────────────────────────
   * 第9步：跳转到登录页面
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
   */
  window.location.href = 'login.html';
  // ↑ 结束：页面跳转到 login.html

// ↓ 结束：handleRegister 函数
}
