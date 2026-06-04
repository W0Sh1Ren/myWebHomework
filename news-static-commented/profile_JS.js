/**
 * profile_JS.js - 个人资料编辑页
 * 功能：修改用户名、头像（裁剪+压缩）、简介和密码
 * 数据保存到 localStorage 的 users 数组中
 *
 * ─── 术语解释（零基础） ───
 *   • localStorage：浏览器的"本地存储"，就像一个小仓库，网页可以把数据（如用户名、
 *     密码）存到里面，关了浏览器再打开数据还在。每个网站有自己的独立仓库。
 *   • JSON：一种通用的数据格式，就像用中英文对照表格来写信息。
 *     JSON 使用 { "键": "值" } 的形式组织数据。
 *   • JSON.parse(...)：把 JSON 格式的字符串（文本）转换成 JavaScript 能直接使用
 *     的对象。例如 JSON.parse('{"name":"张三"}') 会得到一个 {name: '张三'} 的对象。
 *   • JSON.stringify(...)：反过来，把 JavaScript 对象转换成 JSON 格式的字符串，
 *     这样才能存到 localStorage 里（因为 localStorage 只能存文本）。
 *   • getElementById("xxx")：在 HTML 中找到 id="xxx" 的那个元素，
 *     就像通过学号在班级里找到某个学生。
 *   • addEventListener：给 HTML 元素"绑定"一个事件监听器，告诉浏览器：
 *     "当用户做了某个操作（比如点击、拖动、滚轮）时，请执行这个函数"。
 *   • 箭头函数 () => { ... }：ES6 新语法，是 function() { ... } 的一种简写形式，
 *     除了写法更简洁外，它内部的 this 指向也和普通函数有所不同。
 *   • Canvas：HTML5 提供的一个"画布"元素（<canvas>），可以在上面用 JavaScript
 *     绘制图形、图片、文字等，就像一块电子画板。
 *   • getContext('2d')：从 Canvas 元素获取"2D 绘图上下文"——也就是得到一套
 *     可以在画布上画图的"画笔工具"。
 *   • arc(圆心x, 圆心y, 半径, 起始角度, 结束角度)：在 Canvas 上画一段圆弧，
 *     角度用弧度制（Math.PI = 180°），Math.PI * 2 = 360° 就是一个完整的圆。
 *   • closePath()：把当前路径的终点和起点用直线连起来，闭合图形。
 *   • clip()：裁剪——设定一个"剪切区域"，此后所有绘制操作只显示在这个区域内，
 *     区域外的部分会被隐藏（就像用剪纸模板遮住不想显示的部分）。
 *   • drawImage(图片, sx, sy, sw, sh, dx, dy, dw, dh)：在 Canvas 上绘制图片。
 *     前4个参数（sx,sy,sw,sh）表示从原图的哪个位置裁剪一个矩形区域；
 *     后4个参数（dx,dy,dw,dh）表示把这个区域画到画布的哪个位置并缩放到多大。
 *   • toDataURL('image/jpeg', 0.7)：把 Canvas 画布上的内容导出为一张图片，
 *     返回的是一个 base64 编码的"数据 URL"字符串（以 data:image/jpeg;base64,... 开头），
 *     可以直接作为 <img> 的 src 显示。0.7 是 JPEG 压缩质量（0~1，越高越清晰）。
 *   • confirm("文本")：弹出一个带"确定"和"取消"按钮的对话框，用户点"确定"返回 true。
 *   • e.preventDefault()：阻止事件的默认行为。例如鼠标滚轮默认会让页面滚动，
 *     在图片缩放时我们不希望页面滚动，所以调用此方法阻止。
 *   • 触摸事件（touchstart / touchmove / touchend）：移动端触屏操作的三个核心事件，
 *     分别对应手指按下、手指移动、手指抬起。e.touches 数组存储了所有触摸点的信息。
 *   • e.clientX / e.clientY：鼠标/触摸点相对于浏览器视口（可见区域）左上角的坐标，
 *     单位是像素（px）。
 *   • getBoundingClientRect()：获取一个 HTML 元素相对于浏览器视口的位置和尺寸信息，
 *     返回一个对象，包含 left, top, right, bottom, width, height 等属性。
 *   • dataset：HTML5 的自定义数据属性机制。HTML 中 data-xxx="值" 对应的属性，
 *     在 JavaScript 中可以通过 element.dataset.xxx 来读写。例如
 *     <input data-preview="..."> 在 JS 中就是 avatarInput.dataset.preview。
 *   • naturalWidth / naturalHeight：图片本身的原始宽度和高度（单位：像素），
 *     不受 CSS 或 HTML 属性缩放的影响。
 *   • Math.max(a, b)：返回 a 和 b 中较大的那个。
 *   • Math.min(a, b)：返回 a 和 b 中较小的那个。
 *   • trim()：去掉字符串开头和结尾的空白字符（空格、制表符、换行符等）。
 */

// ===================================================================
// 常量定义（常量：一旦赋值就不能再修改的变量，用 const 声明）
// ===================================================================

/**
 * DEFAULT_AVATAR：默认头像图片的 URL 地址。
 * 当用户没有设置自定义头像时，使用这个默认图片。
 * 这里用的是必应图床的一个外链图片链接。
 */
const DEFAULT_AVATAR = 'https://ts1.tc.mm.bing.net/th/id/R-C.5c5224bd34a0aee8c411509e0d154575?rik=4fXwdrQ3mRIlvw&riu=http%3a%2f%2fbpic.588ku.com%2felement_pic%2f01%2f55%2f09%2f4557474d965eb71.jpg&ehk=wlOkaUqmQA0OH26%2bPRQ4JBO3sk6Wv8ID%2flpRkImF23Y%3d&risl=&pid=ImgRaw&r=0';

/**
 * DEFAULT_BIO：默认个人简介文本。
 * 当用户没有填写简介时，显示这段占位文字。
 */
const DEFAULT_BIO = '这个人还没有简介哦~';

// =================== 通用工具函数 ===================
// 这些函数在整个页面中多处使用，提供通用的认证和导航功能。

/**
 * checkAuth - 检查用户是否已登录（身份验证）。
 *
 * 【功能】
 *   从 localStorage 中读取当前登录的用户信息。
 *   如果没找到（未登录），则跳转到登录页面。
 *   如果找到了，返回该用户对象供后续使用。
 *
 * 【专业术语解释】
 *   localStorage.getItem('currentUser')：
 *     从浏览器的本地存储中读取键名为 'currentUser' 的数据，
 *     返回的是一个字符串（JSON 格式文本）。
 *   || 'null'：
 *     如果 getItem 返回 null（即该键不存在），就用字符串 'null' 作为默认值。
 *     JSON.parse('null') 的结果是 JavaScript 的 null 值。
 *   window.location.href：
 *     浏览器的"地址栏"属性，给它赋一个新值就会让页面跳转到那个新地址。
 *
 * @returns {Object|null}
 *   如果已登录，返回包含用户信息的对象（如 {id, username, avatar, bio}）；
 *   如果未登录，返回 null（并且页面会自动跳转到 login.html）。
 */
function checkAuth() {
  // ---- 第 1 步：从 localStorage 读取当前用户 ----
  // localStorage.getItem('currentUser')：从浏览器本地存储中获取 'currentUser' 这个键对应的值
  // || 'null'：如果获取不到（getItem 返回 null），就用字符串 'null' 作为默认值
  // JSON.parse(...)：把 JSON 格式的字符串解析成 JavaScript 对象
  // 整句意思：从本地存储拿到当前用户的 JSON 字符串，解析成对象，赋值给变量 user
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');

  // ---- 第 2 步：判断是否已登录 ----
  // if (!user)：如果 user 是 falsy 值（null、undefined、0、""、false 等），就进入条件
  // 也就是说，如果当前没有用户登录（user 为 null），就执行下面的跳转
  if (!user) {
    // 跳转到登录页面（赋值给 window.location.href 会触发浏览器导航）
    window.location.href = 'login.html';
    // 返回 null，表示未登录状态，调用者可以通过判断返回值做后续处理
    return null;
  } /* ── if (!user) 结束 ── */

  // ---- 第 3 步：已登录，返回用户对象 ----
  // 如果执行到这里，说明 user 不为 null，用户已登录，返回用户信息对象
  return user;
} /* ── checkAuth 函数结束 ── */

/**
 * logout - 退出登录。
 *
 * 【功能】
 *   弹出确认对话框询问用户是否确定退出。
 *   如果用户点击"确定"，从 localStorage 中移除当前用户信息，
 *   然后跳转到首页（index.html）。
 *
 * 【参数】
 *   无
 *
 * 【返回值】
 *   无（undefined）
 */
function logout() {
  // confirm("...")：浏览器弹出一个带确定/取消的对话框
  // 如果用户点击"确定"，confirm 返回 true，进入 if 代码块
  if (confirm('确定要退出登录吗？')) {
    // localStorage.removeItem('currentUser')：从浏览器本地存储中删除 'currentUser' 这个键
    // 相当于让用户"下线"，清除登录状态
    localStorage.removeItem('currentUser');
    // 跳转到首页
    window.location.href = 'index.html';
  } /* ── if (confirm) 结束 ── */
} /* ── logout 函数结束 ── */

/**
 * loadNav - 加载页面顶部导航栏。
 *
 * 【功能】
 *   读取当前登录用户的信息，动态生成导航栏的 HTML 内容。
 *   如果用户已登录，显示用户头像、用户名以及"个人资料""退出"等链接；
 *   如果未登录，只显示"首页""登录""注册"三个链接。
 *
 * 【参数】
 *   无
 *
 * 【返回值】
 *   无（undefined）
 */
function loadNav() {
  // ---- 第 1 步：获取当前用户信息 ----
  // 从 localStorage 中获取 'currentUser'，解析成对象
  // 如果没取到（未登录），则 user = null
  const user = JSON.parse(localStorage.getItem('currentUser') || 'null');

  // ---- 第 2 步：找到导航栏的容器元素 ----
  // document.getElementById('navLinks')：在 HTML 中找到 id="navLinks" 的元素
  // 这个元素是导航栏的容器，我们接下来要修改它的 innerHTML（内部 HTML 内容）
  const links = document.getElementById('navLinks');

  // ---- 第 3 步：根据登录状态渲染不同的导航栏 ----
  if (user) {
    // ===== 用户已登录 =====
    // user.avatar：用户对象的头像 URL 属性
    // || DEFAULT_AVATAR：如果 user.avatar 为空（undefined/null/""），就用默认头像
    const avatarUrl = user.avatar || DEFAULT_AVATAR;

    // innerHTML：把一个 HTML 字符串赋值给元素的 innerHTML，浏览器会把它解析成 DOM 元素
    // 这里用字符串拼接的方式，动态生成带用户信息的导航栏
    // 注意：多个字符串用 + 号连接，这是 JavaScript 字符串拼接的写法
    links.innerHTML =
      // ---- 导航链接：首页 ----
      '<a href="index.html">首页</a>' +
      // ---- 导航链接：后台管理 ----
      '<a href="dashboard.html">后台管理</a>' +
      // ---- 显示用户信息和头像的 span 区域 ----
      // style 中的 rgba(255,255,255,.8) 表示白色半透明（.8 是不透明度 80%）
      '<span style="color:rgba(255,255,255,.8)">' +
        // <img> 显示用户头像
        // src="' + avatarUrl + '"：用字符串拼接的方式把头像 URL 放到 src 属性中
        // border-radius:50%：让图片变成圆形（圆形头像效果）
        // vertical-align:middle：让图片在行内垂直居中
        // object-fit:cover：保持图片宽高比，裁剪多余部分以填满整个区域
        '<img src="' + avatarUrl + '" alt="" style="width:24px;height:24px;border-radius:50%;vertical-align:middle;margin-right:4px;object-fit:cover">' +
        // 显示欢迎文本和用户名
        '欢迎, ' + user.username +
      '</span>' +
      // ---- 导航链接：个人资料编辑页 ----
      '<a href="profile.html" style="color:rgba(255,255,255,.8);text-decoration:none">个人资料</a>' +
      // ---- 退出登录链接 ----
      // javascript:logout()：这是一个伪协议链接，点击时会执行 JavaScript 的 logout() 函数
      '<a href="javascript:logout()">退出</a>';
  } else {
    // ===== 用户未登录 =====
    // 只显示三个基础链接：首页、登录、注册
    links.innerHTML = '<a href="index.html">首页</a><a href="login.html">登录</a><a href="register.html">注册</a>';
  } /* ── if (user) ... else 结束 ── */
} /* ── loadNav 函数结束 ── */

// =================== 加载资料 ===================
// 这部分负责从 localStorage 读取用户数据并填充到表单中。

/**
 * loadProfile - 加载个人资料到表单中。
 *
 * 【功能】
 *   1. 调用 checkAuth() 检查登录状态，未登录则终止执行。
 *   2. 调用 loadNav() 加载导航栏。
 *   3. 从 localStorage 的 'users' 数组中查找当前用户的完整数据。
 *   4. 将用户名、简介、头像填充到对应的表单元素中。
 *
 * 【专业术语解释】
 *   .find(u => u.id === user.id)：
 *     Array.find() 方法遍历数组，返回第一个满足条件（回调函数返回 true）的元素。
 *     u => u.id === user.id 是一个箭头函数，意思是"对于每个元素 u，
 *     如果 u.id 等于当前登录用户的 user.id，就返回 true"。
 *     这行代码的作用是：在 users 数组中找到与当前登录用户 ID 匹配的那个用户对象。
 *
 * @returns {void}
 */
function loadProfile() {
  // ---- 第 1 步：验证登录状态 ----
  // 调用 checkAuth()，如果未登录，函数内部已做了跳转，返回 null
  const user = checkAuth();
  // 如果 user 为 null（未登录），直接结束函数，不再往下执行
  if (!user) return;

  // ---- 第 2 步：加载导航栏 ----
  loadNav();

  // ---- 第 3 步：从 currentUser 获取用户数据并填充表单 ----
  // 不再从 localStorage 的 users 数组中查找用户数据，
  // 直接从当前登录用户缓存（currentUser）中读取用户名、简介和头像
  // 这些数据在登录时已从后端 API 获取并保存到 currentUser 中

  // 填充用户名
  document.getElementById('username').value = user.username;

  // 填充简介（bio），如果为空则使用默认简介文本
  document.getElementById('bio').value = user.bio || DEFAULT_BIO;

  // 加载头像：如果用户没有设置头像，使用默认头像
  const avatarUrl = user.avatar || DEFAULT_AVATAR;
  // 找到 id="avatarImg" 的 <img> 元素，设置它的 src（图片源地址）
  document.getElementById('avatarImg').src = avatarUrl;
} /* ── loadProfile 函数结束 ── */

// =================== 头像裁剪 ===================
// 这部分实现了一个完整的头像裁剪功能：
//   1. 用户上传一张图片
//   2. 图片以"cover 模式"（铺满裁剪区域，多余部分裁掉）显示在弹窗中
//   3. 用户可以用鼠标/手指拖动图片来调整显示区域
//   4. 用户可以用滚轮缩放图片
//   5. 确认裁剪后，将圆形可视区域导出为 200x200 的 JPEG 图片（base64 格式）
//   6. base64 数据可以直接作为 <img> 的 src 显示，也可以保存到 localStorage

/**
 * cropState：裁剪状态对象。
 *
 * 这是一个全局对象（用 let 声明，因为它的属性会被不断修改），
 * 存储了裁剪操作的所有中间状态数据。
 * 在裁剪弹窗打开期间，所有函数都通过这个对象来共享和修改状态。
 *
 * 【属性说明】
 *   img       - 用户选择的原始图片的 Image 对象（new Image() 创建）
 *   scale     - 基础缩放比例。为了让图片铺满裁剪容器（cover 效果）而计算出的比例。
 *               例如图片宽 1000px、容器宽 260px，则 scaleX = 0.26。
 *               取 scaleX 和 scaleY 中较大的那个，确保图片完全覆盖容器。
 *   zoom      - 用户手动缩放倍率。通过滚轮调节，范围限制在 0.5 ~ 3 之间。
 *               初始为 1（不额外缩放）。
 *   offsetX   - 图片在容器中的水平偏移量（单位：像素）。
 *               负值表示图片向左移动（图片右边缘的内容进入可视区域）。
 *               正值表示图片向右移动。
 *   offsetY   - 图片在容器中的垂直偏移量（单位：像素）。
 *               负值表示图片向上移动。
 *   dragStartX- 用户开始拖动时，鼠标位置与当前 offsetX 的差值。
 *               用于在拖动过程中计算新的 offsetX。
 *   dragStartY- 用户开始拖动时，鼠标位置与当前 offsetY 的差值。
 *   dragging  - 布尔值，标记用户是否正在拖拽图片。true=正在拖动，false=未拖动。
 */
let cropState = {
  img: null,       // 原始 Image 对象（从用户选择的文件加载的图片）
  scale: 1,        // 基础显示比例（cover 缩放比例，让图片铺满容器）
  zoom: 1,         // 用户缩放倍率（通过鼠标滚轮调节，范围 0.5~3）
  offsetX: 0,      // 当前 X 偏移（图片在容器中的水平位置，单位 px）
  offsetY: 0,      // 当前 Y 偏移（图片在容器中的垂直位置，单位 px）
  dragStartX: 0,   // 拖动起始时，鼠标 X 坐标减去当前 offsetX 得到的基准值
  dragStartY: 0,   // 拖动起始时，鼠标 Y 坐标减去当前 offsetY 得到的基准值
  dragging: false  // 是否正在拖动中（true=拖动中，false=未拖动）
}; /* ── cropState 对象结束 ── */

/**
 * CROP_SIZE：裁剪容器的像素大小（宽度和高度相同，正方形）。
 * 裁剪区域是一个 260×260 像素的正方形，最终从中截取圆形部分。
 * 这个常量在 clampOffset（边界约束）和渲染等地方都会用到。
 */
const CROP_SIZE = 260; // 裁剪容器像素大小（单位：像素 px）

/**
 * getDisplayScale - 获取当前实际显示比例。
 *
 * 【功能】
 *   返回基础缩放比例（scale）乘以用户缩放倍率（zoom）的结果。
 *   这个值代表了图片当前的整体缩放倍数。
 *   例如：scale=0.5（原始图片的一半大小），zoom=2（用户放大了2倍），
 *   则实际显示比例 = 0.5 × 2 = 1.0（原始大小）。
 *
 * @returns {number} 当前实际显示比例（无单位，纯倍数）
 */
function getDisplayScale() {
  // cropState.scale：基础缩放比例（cover 模式计算出的比例）
  // cropState.zoom：用户通过滚轮调节的额外缩放倍率
  // 两者相乘得到当前图片的实际缩放比例
  return cropState.scale * cropState.zoom;
} /* ── getDisplayScale 函数结束 ── */

/**
 * renderCropImage - 根据当前的缩放和偏移，重新渲染裁剪区域中的图片。
 *
 * 【功能】
 *   读取 cropState 中的缩放和偏移数据，计算图片的显示宽度、高度和位置，
 *   然后通过修改 DOM 元素的 style 属性（left、top、width、height）来更新
 *   图片在裁剪容器中的显示效果。
 *
 * 【专业术语解释】
 *   img.naturalWidth / img.naturalHeight：
 *     这是 Image 对象的属性，表示图片的"原始尺寸"（即图片文件本身的宽度和高度），
 *     无论 CSS 如何缩放，这两个值都不会变。
 *   元素.style.left/top/width/height：
 *     设置 HTML 元素的 CSS 样式。left 和 top 是定位属性，
 *     需要配合 position: absolute/relative 使用。
 *     这里单位是 'px'（像素），需要通过字符串拼接加上单位后缀。
 *
 * @returns {void}
 */
function renderCropImage() {
  // ---- 第 1 步：获取原始图片对象 ----
  // 从 cropState 中取出保存的原始图片
  const img = cropState.img;

  // ---- 第 2 步：如果图片不存在，直接返回 ----
  // 如果 img 为 null（没有选择图片或裁剪已取消），就不执行任何操作
  if (!img) return;

  // ---- 第 3 步：计算当前显示尺寸 ----
  // 调用 getDisplayScale() 获取当前总缩放比例
  const dScale = getDisplayScale();
  // 图片的显示宽度 = 原始宽度 × 缩放比例
  const dw = img.naturalWidth * dScale;
  // 图片的显示高度 = 原始高度 × 缩放比例
  const dh = img.naturalHeight * dScale;

  // ---- 第 4 步：找到裁剪图片的 DOM 元素 ----
  // document.getElementById('cropImage')：找到裁剪弹窗中用于显示图片的 <img> 元素
  const cropImg = document.getElementById('cropImage');

  // ---- 第 5 步：更新元素的 CSS 样式 ----
  // 设置图片的显示宽度（像素）
  // 字符串拼接：数字 dw 加上 'px' 后缀，变成如 "520px" 这样的 CSS 值
  cropImg.style.width = dw + 'px';
  // 设置图片的显示高度
  cropImg.style.height = dh + 'px';
  // 设置图片的 left 偏移（水平位置，相对于裁剪容器）
  // 负值表示图片向左移出容器一部分（超出部分被容器隐藏）
  cropImg.style.left = cropState.offsetX + 'px';
  // 设置图片的 top 偏移（垂直位置，相对于裁剪容器）
  cropImg.style.top = cropState.offsetY + 'px';
} /* ── renderCropImage 函数结束 ── */

/**
 * clampOffset - 约束偏移量，防止图片移出可视区域。
 *
 * 【功能】
 *   当用户拖动图片时，需要限制偏移范围，不能让图片完全移出裁剪容器。
 *   规则：
 *     - 如果图片某一方向小于容器尺寸，就让图片居中（不能拖动）。
 *     - 如果图片大于容器，则允许拖动，但边界不能超出容器范围。
 *   简而言之：确保裁剪容器中始终有图片内容，不会出现空白区域。
 *
 * 【参数】
 *   @param {number} offsetX - 建议的 X 偏移量（可能是超出边界的值）
 *   @param {number} offsetY - 建议的 Y 偏移量
 *   @param {number} displayW - 图片当前显示宽度（像素）
 *   @param {number} displayH - 图片当前显示高度（像素）
 *
 * 【返回值】
 *   @returns {{x: number, y: number}} 约束后的偏移量对象，包含 x 和 y 属性
 *
 * 【专业术语解释】
 *   Math.min(a, b)：返回 a 和 b 中较小的那个数值。
 *   Math.max(a, b)：返回 a 和 b 中较大的那个数值。
 *   Math.min(0, Math.max(offsetX, CROP_SIZE - displayW))：
 *     这是一个经典的范围限制写法。当 displayW > CROP_SIZE（图片比容器大）时，
 *     CROP_SIZE - displayW 是负数（比如 260 - 500 = -240）。
 *     offsetX 必须在 [CROP_SIZE - displayW, 0] 之间，即 [-240, 0]。
 *     所以先取 Math.max(offsetX, -240)，确保不<左边界；
 *     再取 Math.min(结果, 0)，确保不>右边界。
 */
function clampOffset(offsetX, offsetY, displayW, displayH) {
  // ---- 水平方向约束（X 轴） ----
  // 如果图片宽度 ≤ 容器宽度（图片比容器小或刚好一样大）
  if (displayW <= CROP_SIZE) {
    // 让图片水平居中：容器宽度减去图片宽度再除以 2
    offsetX = (CROP_SIZE - displayW) / 2;
  } else {
    // 图片比容器大，允许拖动但限制边界
    // offsetX 的取值范围：[CROP_SIZE - displayW, 0]
    // Math.max(offsetX, CROP_SIZE - displayW)：不能向左超出左边界
    // Math.min(..., 0)：不能向右超出右边界
    offsetX = Math.min(0, Math.max(offsetX, CROP_SIZE - displayW));
  } /* ── if (displayW <= CROP_SIZE) ... else 结束 ── */

  // ---- 垂直方向约束（Y 轴） ----
  // 如果图片高度 ≤ 容器高度
  if (displayH <= CROP_SIZE) {
    // 让图片垂直居中
    offsetY = (CROP_SIZE - displayH) / 2;
  } else {
    // 图片比容器高，允许拖动但限制边界
    offsetY = Math.min(0, Math.max(offsetY, CROP_SIZE - displayH));
  } /* ── if (displayH <= CROP_SIZE) ... else 结束 ── */

  // ---- 返回约束后的结果 ----
  // 返回一个对象，包含 x（水平偏移）和 y（垂直偏移）两个属性
  return { x: offsetX, y: offsetY };
} /* ── clampOffset 函数结束 ── */

/**
 * uploadAvatar - 用户选择图片后，打开裁剪弹窗。
 *
 * 【功能】
 *   1. 获取用户通过文件输入框选择的第一个文件。
 *   2. 使用 FileReader 将该文件读取为 data URL（base64 编码的图片数据）。
 *   3. 创建一个 Image 对象加载这张图片。
 *   4. 图片加载完成后：
 *      a. 保存图片到 cropState.img。
 *      b. 计算 cover 缩放比例（让图片完全覆盖裁剪区域）。
 *      c. 计算居中偏移量。
 *      d. 将图片显示在裁剪弹窗中。
 *      e. 将弹窗的 display 设为 'flex'，使其可见。
 *
 * 【参数】
 *   @param {HTMLInputElement} input - 文件选择 <input> 元素（type="file"）
 *   用户通过这个元素选择要上传的图片文件
 *
 * 【返回值】
 *   无
 *
 * 【专业术语解释】
 *   FileReader：浏览器提供的 API，用于读取用户选择的文件内容。
 *     这里使用 readAsDataURL 方法，将文件读取为 base64 格式的 data URL。
 *   new Image()：创建一个 JavaScript 的 Image 对象，代表一张图片。
 *     设置它的 src 属性后，浏览器会异步加载这张图片。
 *     加载完成时会触发 onload 回调函数。
 *   e.target.result：在 FileReader 的 onload 回调中，e.target 就是 FileReader 对象本身，
 *     e.target.result 是读取到的文件内容（这里是一段 data URL 字符串）。
 *   cover 模式：一种背景图片的缩放方式，保持图片宽高比，
 *     同时让图片完全覆盖容器，多余的部分会被裁剪掉。
 *     这里的计算逻辑是取 scaleX 和 scaleY 中较大的那个，
 *     这样图片在某个方向可能会超出容器。
 */
function uploadAvatar(input) {
  // ---- 第 1 步：获取用户选择的文件 ----
  // input.files：文件输入框的 files 属性，是一个类数组对象，包含所有选中的文件
  // [0]：取第一个文件（如果 input 没有 multiple 属性，通常只有一个文件）
  const file = input.files[0];
  // 如果用户没有选择文件（例如点了取消），直接结束函数
  if (!file) return;

  // ---- 第 2 步：创建 FileReader 读取文件 ----
  // FileReader：浏览器内置的对象，用于异步读取用户计算机上的文件内容
  const reader = new FileReader();

  // ---- 第 3 步：设置文件读取完成后的回调函数 ----
  // reader.onload：当读取操作成功完成时，浏览器会调用这个函数
  // 参数 e（事件对象）中包含了读取结果
  reader.onload = function(e) {
    // ---- 第 3a 步：创建一个新的 Image 对象 ----
    // Image 是浏览器内置的类，代表一张图片
    const img = new Image();

    // ---- 第 3b 步：设置图片加载完成后的回调 ----
    // img.onload：当图片的 src 被设置且图片加载完成后，浏览器会调用这个函数
    img.onload = function() {
      // ========== 图片已加载完毕，开始初始化裁剪状态 ==========

      // --- 保存原始图片到 cropState，供后续裁剪使用 ---
      cropState.img = img;

      // --- 计算 cover 模式的基础缩放比例 ---
      // scaleX = 容器宽度 ÷ 图片原始宽度
      // 例如：容器 260px，图片宽度 520px，则 scaleX = 0.5（图片缩小一半）
      const scaleX = CROP_SIZE / img.naturalWidth;
      // scaleY = 容器高度 ÷ 图片原始高度
      const scaleY = CROP_SIZE / img.naturalHeight;
      // 取较大的那个比例：这样图片在短边也能填满容器，长边会超出容器被裁剪
      // 这实现了 CSS 中 background-size: cover 的效果
      cropState.scale = Math.max(scaleX, scaleY);
      // 重置用户缩放倍率为 1（没有额外缩放）
      cropState.zoom = 1;

      // --- 计算初始偏移量：让图片居中显示 ---
      // 获取当前实际缩放比例
      const dScale = getDisplayScale();
      // 图片当前显示宽度 = 原始宽度 × 缩放比例
      const displayW = img.naturalWidth * dScale;
      // 图片当前显示高度
      const displayH = img.naturalHeight * dScale;
      // 水平居中偏移 = (容器宽度 - 图片宽度) / 2
      // 如果图片比容器宽，这个值会是负数（图片向左移出容器）
      cropState.offsetX = (CROP_SIZE - displayW) / 2;
      // 垂直居中偏移
      cropState.offsetY = (CROP_SIZE - displayH) / 2;

      // --- 在裁剪弹窗中显示图片 ---
      // document.getElementById('cropImage')：找到裁剪弹窗中显示图片的 <img> 元素
      // e.target.result：FileReader 读取到的图片 data URL
      document.getElementById('cropImage').src = e.target.result;
      // 根据当前的 cropState 渲染图片的位置和大小
      renderCropImage();

      // --- 显示裁剪弹窗 ---
      // 将裁剪弹窗的 CSS display 属性设为 'flex'，使其从隐藏变为可见
      // (flex 是 CSS 弹性布局的一种显示模式)
      document.getElementById('cropModal').style.display = 'flex';
    } /* ── img.onload 回调结束 ── */

    // ---- 第 3c 步：设置 Image 对象的 src，开始加载图片 ----
    // e.target.result 是 FileReader 读取到的 data URL（data:image/...;base64,...）
    // 设置 src 后，浏览器开始异步加载这张图片
    img.src = e.target.result;
  } /* ── reader.onload 回调结束 ── */

  // ---- 第 4 步：以 Data URL（base64）格式读取文件 ----
  // readAsDataURL：FileReader 的方法，将文件读取为 data: URL 格式
  // 完成后会触发 reader.onload 回调，result 属性包含完整的 data URL 字符串
  reader.readAsDataURL(file);

  // ---- 第 5 步：重置文件输入框 ----
  // 将 input.value 设为空字符串，这样用户再次选择同一文件时也能触发 change 事件
  // 否则如果选择同一文件，浏览器认为 value 没变，不会触发 change 事件
  input.value = '';
} /* ── uploadAvatar 函数结束 ── */

/**
 * updateCropImagePosition - 更新裁剪图片的位置（仅偏移，不更新尺寸）。
 *
 * 【功能】
 *   只更新裁剪图片的 left 和 top CSS 属性，不重新计算宽高。
 *   在只需要改变位置的场景下使用（例如只拖动不缩放时）。
 *
 * @returns {void}
 */
function updateCropImagePosition() {
  // 找到裁剪弹窗中的图片元素
  const cropImg = document.getElementById('cropImage');
  // 更新水平偏移（像素）
  cropImg.style.left = cropState.offsetX + 'px';
  // 更新垂直偏移（像素）
  cropImg.style.top = cropState.offsetY + 'px';
} /* ── updateCropImagePosition 函数结束 ── */

/**
 * confirmCrop - 确认裁剪，生成圆形头像。
 *
 * 【功能】
 *   1. 根据当前的缩放和偏移，计算裁剪区域在原始图片中的对应位置。
 *   2. 创建一个临时的 Canvas 画布（200×200 像素）。
 *   3. 在 Canvas 上画一个圆形裁剪区域（clip），只保留圆形内的图像。
 *   4. 从原始图片中截取对应的矩形区域，绘制到 Canvas 上。
 *   5. 将 Canvas 导出为 JPEG base64 数据（质量 70%）。
 *   6. 更新页面上的头像预览图。
 *   7. 将裁剪后的 data URL 暂存到 <input data-preview> 中，等保存时一起提交。
 *   8. 关闭裁剪弹窗。
 *
 * 【专业术语解释——Canvas 绘图流程】
 *   canvas.getContext('2d')：
 *     从 Canvas 元素获取 2D 渲染上下文，这是所有绘图操作的前提。
 *     可以理解为：拿起了画笔，准备在画布上画画。
 *
 *   ctx.beginPath()：
 *     开始一条新的路径。路径就是一系列点、线、弧的集合。
 *     每次开始绘制新图形前都应该调用它。
 *
 *   ctx.arc(100, 100, 100, 0, Math.PI * 2)：
 *     画一个圆弧/圆。参数：圆心 x=100, 圆心 y=100, 半径=100,
 *     起始角度=0, 结束角度=Math.PI*2（即 360°，画一个完整的圆）。
 *     Math.PI 是圆周率 π，约等于 3.14159。
 *
 *   ctx.closePath()：
 *     闭合路径，将终点和起点用直线连接起来。
 *     对于圆形来说，终点和起点是重合的，但这个调用让路径形成一个完整的封闭形状。
 *
 *   ctx.clip()：
 *     裁剪！创建一个裁剪区域，之后所有绘制操作只显示在这个区域内。
 *     这里创建了一个圆形裁剪区域，所以后面 drawImage 画出的图片
 *     只有圆形内部可见，外部被"剪掉"了。
 *
 *   ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)：
 *     在 Canvas 上绘制图片。这是一个功能强大的方法，有 9 个参数：
 *     - img：要绘制的图片对象
 *     - sx, sy：从原始图片的哪个位置开始裁剪（左上角坐标）
 *     - sw, sh：裁剪的宽度和高度
 *     - dx, dy：把裁剪出的内容画到 Canvas 的哪个位置
 *     - dw, dh：在 Canvas 上显示的宽度和高度（可缩放）
 *
 *   canvas.toDataURL('image/jpeg', 0.7)：
 *     把 Canvas 画布的内容导出为一张 JPEG 格式的图片，
 *     返回 base64 编码的数据 URL 字符串。
 *     参数 'image/jpeg' 指定图片格式，0.7 表示 JPEG 压缩质量（范围 0~1）。
 *     这个字符串可以直接作为 <img> 的 src 使用，
 *     也可以作为字符串保存到 localStorage 中。
 *
 * @returns {void}
 */
function confirmCrop() {
  // ---- 第 1 步：获取原始图片 ----
  const img = cropState.img;
  // 如果图片不存在（例如取消裁剪后未重置状态），直接返回
  if (!img) return;

  // ---- 第 2 步：计算裁剪区域在原始图片中的坐标 ----
  // 获取当前实际缩放比例
  const dScale = getDisplayScale();

  // cropX：裁剪区域在原始图片上的 X 坐标
  // -cropState.offsetX：把偏移量转成正数（offsetX 是负值时表示图片左移，
  // 即容器看到的是图片靠右的部分）
  // 除以 dScale：把像素偏移值换算到原始图片的坐标系中
  // 因为 offsetX 是经过缩放后的像素值，而原始图片的坐标需要除以缩放比例才能对应
  const cropX = -cropState.offsetX / dScale;

  // cropY：同理，垂直方向
  const cropY = -cropState.offsetY / dScale;

  // cropSize：裁剪区域在原始图片中的边长
  // CROP_SIZE（260px）是容器在屏幕上的像素大小，除以缩放比例得到原始图片中的对应大小
  // 例如：缩放比例是 2（图片放大到 2 倍），则 cropSize = 260/2 = 130，
  // 意味着原始图片中 130×130 的区域被放大到了 260×260 显示
  const cropSize = CROP_SIZE / dScale;

  // ---- 第 3 步：创建 Canvas 画布 ----
  // document.createElement('canvas')：在内存中创建一个 <canvas> 元素
  // 注意这个 canvas 没有添加到页面中，它只是在内存中用于绘图处理
  const canvas = document.createElement('canvas');

  // AVATAR_SIZE：最终输出的头像大小（200×200 像素）
  const AVATAR_SIZE = 200;
  // 设置 Canvas 的宽度（像素）
  canvas.width = AVATAR_SIZE;
  // 设置 Canvas 的高度（像素）
  canvas.height = AVATAR_SIZE;

  // ---- 第 4 步：获取 Canvas 的 2D 绘图上下文 ----
  // getContext('2d')：从 Canvas 获取 2D 渲染上下文
  // ctx 就是"画笔对象"，通过调用它的各种方法在 Canvas 上绘图
  const ctx = canvas.getContext('2d');

  // ---- 第 5 步：创建圆形裁剪路径 ----
  // beginPath()：开始一条新路径，先前的路径会被清除
  ctx.beginPath();

  // arc(圆心x, 圆心y, 半径, 起始角度, 结束角度)：
  // 画一个完整的圆。AVATAR_SIZE / 2 = 100，所以圆心在画布正中心 (100, 100)
  // 半径也是 100，刚好是画布边长的一半，所以是一个内切圆（正好贴在画布边界内）
  // Math.PI * 2 = 2π ≈ 6.283，对应 360°，是一个完整的圆
  ctx.arc(AVATAR_SIZE / 2, AVATAR_SIZE / 2, AVATAR_SIZE / 2, 0, Math.PI * 2);

  // closePath()：闭合路径，把最后一点和起点连接起来
  ctx.closePath();

  // clip()：裁剪——从现在开始，所有的绘制操作都只显示在这个圆形区域内
  // 圆形区域外的部分会被自动隐藏（不可见）
  ctx.clip();

  // ---- 第 6 步：绘制图片（只在圆形区域内可见） ----
  // drawImage(图片, 原始裁剪X, 原始裁剪Y, 裁剪宽度, 裁剪高度,
  //            目标X, 目标Y, 目标宽度, 目标高度)
  // 从原始图片的 (cropX, cropY) 位置开始，裁剪 cropSize × cropSize 的区域，
  // 然后绘制到 Canvas 的 (0, 0) 到 (200, 200) 区域（正好铺满整个画布）
  ctx.drawImage(img, cropX, cropY, cropSize, cropSize, 0, 0, AVATAR_SIZE, AVATAR_SIZE);

  // ---- 第 7 步：导出 Canvas 为图片数据 ----
  // toDataURL('image/jpeg', 0.7)：将 Canvas 内容导出为 JPEG 格式的 data URL
  // 0.7 是图片质量（70%），值越低文件越小但画质越差，值越高画质越好但文件越大
  // 返回的 dataUrl 是一个长字符串，以 "data:image/jpeg;base64," 开头
  const dataUrl = canvas.toDataURL('image/jpeg', 0.7);

  // ---- 第 8 步：更新页面上的头像预览 ----
  // 找到页面上显示头像的 <img> 元素，将其 src 设为裁剪后的数据
  document.getElementById('avatarImg').src = dataUrl;

  // ---- 第 9 步：暂存裁剪结果，等保存时一并提交 ----
  // document.getElementById('avatarInput')：找到文件选择 <input>
  // dataset.preview：HTML5 的 data-* 自定义属性机制
  // 相当于给 <input> 元素临时添加了一个 data-preview 属性
  // 后续在 handleSave 中会读取这个属性值作为最终头像数据
  document.getElementById('avatarInput').dataset.preview = dataUrl;

  // ---- 第 10 步：关闭裁剪弹窗 ----
  // 把弹窗的 display 设为 'none'，隐藏弹窗
  document.getElementById('cropModal').style.display = 'none';
  // 清空 cropState 中的图片引用，释放内存
  cropState.img = null;
} /* ── confirmCrop 函数结束 ── */

/**
 * cancelCrop - 取消裁剪。
 *
 * 【功能】
 *   关闭裁剪弹窗，清空裁剪弹窗中显示的图片，释放裁剪状态。
 *
 * @returns {void}
 */
function cancelCrop() {
  // 隐藏裁剪弹窗（display: none 让元素不可见且不占布局空间）
  document.getElementById('cropModal').style.display = 'none';
  // 清空裁剪弹窗中图片的 src，移除显示的图片
  document.getElementById('cropImage').src = '';
  // 释放 cropState 中的图片引用
  cropState.img = null;
} /* ── cancelCrop 函数结束 ── */

// =================== 裁剪拖动 + 缩放事件 ===================
// 这部分代码负责处理用户在裁剪弹窗中的交互操作：
// 鼠标拖动、触摸屏拖动、滚轮缩放。
// 所有操作都是通过 addEventListener 来绑定事件监听器。

/**
 * cropContainer：裁剪容器 DOM 元素。
 * 在 HTML 中，id="cropContainer" 的元素是裁剪弹窗中放图片的容器。
 * 用户在这个容器范围内进行拖拽和缩放操作。
 * 这里使用 const 声明，因为一旦获取到这个元素的引用，后续不需要改变它。
 */
const cropContainer = document.getElementById('cropContainer');

// ===== 鼠标拖动功能 =====
// 实现用户在裁剪容器中按住鼠标拖动来移动图片位置。

/**
 * mousedown（鼠标按下）事件监听器。
 *
 * 【功能】
 *   当用户在裁剪容器上按下鼠标左键时：
 *   1. 将 dragging 设为 true，标记开始拖动。
 *   2. 记录当前鼠标位置与图片偏移量的差值（dragStartX, dragStartY），
 *      这个差值在 mousemove 中用于计算新的偏移量。
 *
 * 【专业术语解释】
 *   e.clientX / e.clientY：鼠标指针相对于浏览器窗口可视区域左上角的坐标。
 *   cropState.offsetX：图片当前的左偏移（CSS left 值）。
 *   e.clientX - cropState.offsetX：计算鼠标相对于图片左上角的位置。
 *     这样在拖动时，鼠标始终保持在图片上的同一"抓取点"，不会发生跳跃。
 */
cropContainer.addEventListener('mousedown', function(e) {
  // 标记拖动状态为 true
  cropState.dragging = true;
  // 记录鼠标 X 坐标与当前图片 X 偏移的差值（作为拖动基准点）
  cropState.dragStartX = e.clientX - cropState.offsetX;
  // 记录鼠标 Y 坐标与当前图片 Y 偏移的差值
  cropState.dragStartY = e.clientY - cropState.offsetY;
}); /* ── mousedown 事件监听结束 ── */

/**
 * mousemove（鼠标移动）事件监听器。
 * 绑定在 document 上，这样即使鼠标移出裁剪容器，也能继续拖动。
 *
 * 【功能】
 *   当鼠标在页面上移动时，如果正在拖拽模式（dragging=true）且有图片：
 *   1. 根据鼠标当前位置和 dragStart 的差值计算新的偏移量。
 *   2. 使用 clampOffset 约束偏移量在有效范围内。
 *   3. 更新 cropState 并重新渲染图片。
 *
 * 【参数】
 *   e：事件对象，包含鼠标的位置信息。
 */
document.addEventListener('mousemove', function(e) {
  // 如果不在拖拽模式 或者 没有图片，不处理
  if (!cropState.dragging || !cropState.img) return;

  // 获取当前缩放比例（用于计算图片显示尺寸，以便约束边界）
  const dScale = getDisplayScale();
  // 图片当前显示宽度
  const displayW = cropState.img.naturalWidth * dScale;
  // 图片当前显示高度
  const displayH = cropState.img.naturalHeight * dScale;

  // 计算新的偏移量：鼠标当前位置 - 拖动开始的基准值
  // 例如：dragStartX=100，鼠标移动到 clientX=150，则 newX = 150-100 = 50
  let newX = e.clientX - cropState.dragStartX;
  let newY = e.clientY - cropState.dragStartY;

  // 调用 clampOffset 约束偏移量，防止图片移出容器边界
  const clamped = clampOffset(newX, newY, displayW, displayH);
  // 更新 cropState 中的偏移量
  cropState.offsetX = clamped.x;
  cropState.offsetY = clamped.y;

  // 重新渲染图片（更新 DOM 元素的位置）
  renderCropImage();
}); /* ── mousemove 事件监听结束 ── */

/**
 * mouseup（鼠标松开）事件监听器。
 *
 * 【功能】
 *   当用户松开鼠标时，将 dragging 设为 false，结束拖拽模式。
 */
document.addEventListener('mouseup', function() {
  // 标记拖动状态为 false（结束拖动）
  cropState.dragging = false;
}); /* ── mouseup 事件监听结束 ── */

// ===== 触屏拖动功能 =====
// 和鼠标拖动的逻辑完全相同，但使用触摸事件（touchstart/touchmove/touchend），
// 以支持移动端设备（手机、平板）的操作。

/**
 * touchstart（手指按下触屏）事件监听器。
 *
 * 【功能】
 *   当用户用手指触摸裁剪容器时，记录拖动的起始位置。
 *
 * 【专业术语解释】
 *   e.touches：触摸事件对象的 touches 属性，是一个数组，
 *     包含了当前所有触摸点的信息。touches[0] 是第一个触摸点。
 *   t.clientX / t.clientY：触摸点相对于浏览器视口左上角的坐标。
 *   e.preventDefault()：阻止默认行为。
 *     在触屏设备上，触摸并移动通常会滚动页面，这里阻止它，
 *     因为我们要实现的是图片拖动而不是页面滚动。
 */
cropContainer.addEventListener('touchstart', function(e) {
  // e.touches[0]：获取第一个触摸点（如果用户用多根手指，只取第一根）
  const t = e.touches[0];
  // 标记拖动状态
  cropState.dragging = true;
  // 记录触摸点与当前偏移的差值（拖动基准点）
  cropState.dragStartX = t.clientX - cropState.offsetX;
  cropState.dragStartY = t.clientY - cropState.offsetY;
  // 阻止默认行为（防止页面滚动）
  e.preventDefault();
}); /* ── touchstart 事件监听结束 ── */

/**
 * touchmove（手指在屏幕上移动）事件监听器。
 * 绑定在 document 上以支持跨元素拖动。
 *
 * 【功能】
 *   逻辑与鼠标的 mousemove 完全一致，只是从 e.touches[0] 获取坐标。
 */
document.addEventListener('touchmove', function(e) {
  // 如果不在拖动状态或没有图片，不处理
  if (!cropState.dragging || !cropState.img) return;

  // 获取第一个触摸点的坐标
  const t = e.touches[0];

  // 获取当前缩放比例
  const dScale = getDisplayScale();
  // 计算图片显示尺寸
  const displayW = cropState.img.naturalWidth * dScale;
  const displayH = cropState.img.naturalHeight * dScale;

  // 计算新的偏移量
  let newX = t.clientX - cropState.dragStartX;
  let newY = t.clientY - cropState.dragStartY;

  // 约束偏移量范围
  const clamped = clampOffset(newX, newY, displayW, displayH);
  cropState.offsetX = clamped.x;
  cropState.offsetY = clamped.y;

  // 重新渲染图片
  renderCropImage();

  // 阻止默认行为（防止页面滚动）
  e.preventDefault();
}); /* ── touchmove 事件监听结束 ── */

/**
 * touchend（手指离开屏幕）事件监听器。
 *
 * 【功能】
 *   结束拖拽状态。
 */
document.addEventListener('touchend', function() {
  // 标记拖动结束
  cropState.dragging = false;
}); /* ── touchend 事件监听结束 ── */

// ===== 滚轮缩放功能 =====
// 用户通过鼠标滚轮来放大或缩小裁剪区域中的图片。

/**
 * wheel（鼠标滚轮滚动）事件监听器。
 *
 * 【功能】
 *   当用户在裁剪容器上滚动鼠标滚轮时：
 *   1. 阻止页面滚动（e.preventDefault()）。
 *   2. 根据滚轮方向调整 zoom 倍率（向上滚放大，向下滚缩小）。
 *   3. 限制 zoom 范围在 0.5~3 倍之间。
 *   4. 以鼠标当前位置为中心进行缩放，保持鼠标下方的图像点不动。
 *      （这是通过计算缩放前后鼠标在图片上的相对位置来实现的）
 *
 * 【专业术语解释】
 *   e.deltaY：滚轮滚动量。向上滚（放大）为负值，向下滚（缩小）为正值。
 *     正值越大表示向下滚得越多。
 *   以鼠标为中心缩放：
 *     普通的缩放是固定左上角不变，图片向右下扩展。
 *     但用户期望的是鼠标指向哪里，哪里就放大，鼠标下的那个像素点位置不变。
 *     实现方法是：缩放前记录鼠标在图片上的位置比例（ratioX, ratioY），
 *     缩放后根据这个比例计算新的偏移量，使该点在容器中的位置不变。
 *
 *   { passive: false }：
 *     传递给 addEventListener 的第三个参数（选项对象）。
 *     passive: false 告诉浏览器这个事件监听器会调用 preventDefault()，
 *     所以浏览器需要等待监听器执行完毕才能决定是否执行默认行为。
 *     对于 wheel 事件，我们需要阻止页面滚动，所以必须设为 false。
 */
cropContainer.addEventListener('wheel', function(e) {
  // ---- 第 1 步：阻止鼠标滚轮的默认行为（滚动页面） ----
  e.preventDefault();

  // ---- 第 2 步：如果没有图片，不处理 ----
  if (!cropState.img) return;

  // ---- 第 3 步：调整缩放倍率 ----
  // 保存旧的 zoom 值（用于计算缩放前后的比例变化）
  const oldZoom = cropState.zoom;

  // 判断滚轮方向：deltaY > 0 表示向下滚（缩小），deltaY < 0 表示向上滚（放大）
  // 每次滚动改变 0.1 倍（10%）
  const delta = e.deltaY > 0 ? -0.1 : 0.1;

  // 更新 zoom：新的 zoom 值 = 旧值 + delta
  // 但限制在 [0.5, 3] 范围内（不能缩小到 0.5 倍以下，不能放大到 3 倍以上）
  // Math.max(0.5, ...)：确保不低于 0.5
  // Math.min(3, ...)：确保不超过 3
  cropState.zoom = Math.max(0.5, Math.min(3, oldZoom + delta));

  // ---- 第 4 步：计算鼠标在容器中的位置 ----
  // getBoundingClientRect()：获取裁剪容器相对于视口的位置和尺寸
  const rect = cropContainer.getBoundingClientRect();
  // 鼠标相对于容器左上角的 X 坐标 = 鼠标在视口中的 X 坐标 - 容器左侧在视口中的位置
  const mx = e.clientX - rect.left;  // 鼠标相对容器 X（单位：px）
  // 鼠标相对于容器左上角的 Y 坐标
  const my = e.clientY - rect.top;   // 鼠标相对容器 Y（单位：px）

  // ---- 第 5 步：计算缩放前后图片尺寸的变化 ----
  // 旧的总体缩放比例
  const oldScale = oldZoom * cropState.scale;
  // 新的总体缩放比例
  const newScale = cropState.zoom * cropState.scale;
  // 缩放前的图片显示宽度
  const oldW = cropState.img.naturalWidth * oldScale;
  // 缩放前的图片显示高度
  const oldH = cropState.img.naturalHeight * oldScale;

  // ---- 第 6 步：计算鼠标位置在图片上的相对比例 ----
  // (mx - cropState.offsetX)：鼠标位置相对于图片左上角的 X 坐标
  // 除以 oldW：得到鼠标在图片宽度方向上的比例（0~1 之间）
  // 例如：鼠标在图片水平方向的 30% 位置，ratioX = 0.3
  const ratioX = (mx - cropState.offsetX) / oldW;
  // 垂直方向同理
  const ratioY = (my - cropState.offsetY) / oldH;

  // ---- 第 7 步：根据新尺寸和比例计算新的偏移量 ----
  // 缩放后的图片新宽度
  const newW = cropState.img.naturalWidth * newScale;
  // 缩放后的图片新高度
  const newH = cropState.img.naturalHeight * newScale;

  // 计算新的偏移量，使得鼠标指向的那个图像点保持在原来的容器位置
  // mx - ratioX * newW：假设新图片宽度为 newW，要保持 ratioX 比例的那个点在 mx 位置
  // 则图片的偏移量 = mx - (那个点在图片上的X坐标)
  // 那个点在图片上的X坐标 = ratioX * newW
  const clamped = clampOffset(mx - ratioX * newW, my - ratioY * newH, newW, newH);
  // 更新 cropState 中的偏移量
  cropState.offsetX = clamped.x;
  cropState.offsetY = clamped.y;

  // ---- 第 8 步：重新渲染图片 ----
  renderCropImage();

  // 注意：这里 { passive: false } 是 addEventListener 的第三个参数，
  // 它作为一个选项对象传递给 addEventListener。
  // passive: false 表示此事件的监听器会调用 preventDefault()，
  // 浏览器需要等待监听器执行完毕。
}, { passive: false }); /* ── wheel 事件监听结束 ── */

// =================== 保存资料 ===================
// 这部分负责收集表单数据、验证输入、更新 localStorage 中的用户数据。

/**
 * handleSave - 处理个人资料表单的提交保存。
 *
 * 【功能】
 *   1. 阻止表单默认提交行为（防止页面刷新）。
 *   2. 检查用户登录状态。
 *   3. 收集表单数据（用户名、简介、旧密码、新密码、确认密码）。
 *   4. 验证数据合法性（用户名非空、密码长度、两次密码一致等）。
 *   5. 从 localStorage 获取 users 数组，找到当前用户。
 *   6. 如果用户填写了密码修改，验证旧密码正确性后更新密码。
 *   7. 更新用户名、简介、头像（如果有裁剪结果）。
 *   8. 将更新后的 users 数组保存回 localStorage。
 *   9. 同时更新 currentUser 缓存。
 *   10. 显示成功提示，清空密码输入框。
 *
 * 【参数】
 *   @param {Event} e - 表单的 submit 事件对象
 *
 * 【返回值】
 *   无
 *
 * 【专业术语解释】
 *   e.preventDefault()：
 *     阻止表单的默认提交行为。HTML 表单的 <form> 被 submit 时，
 *     默认会刷新页面或跳转到 action 指定的 URL。
 *     因为我们用 JavaScript 手动处理数据，所以要阻止这个默认行为。
 *   trim()：
 *     字符串方法，去掉字符串开头和结尾的空白字符（空格、制表符、换行符等）。
 *     用户可能在输入框中不小心输入了前后空格，trim 可以清理掉。
 *   users.findIndex(u => u.id === user.id)：
 *     Array.findIndex() 方法，遍历数组，返回第一个满足条件的元素的索引位置。
 *     如果找不到，返回 -1。这里用于查找当前用户在 users 数组中的位置。
 *   delete avatarInput.dataset.preview：
 *     delete 操作符用于删除对象的属性。这里删除了 dataset 中的 preview 属性，
 *     这样下次保存时不会使用旧的裁剪数据。
 */
async function handleSave(e) {
  // ---- 第 1 步：阻止表单默认提交行为 ----
  // 如果不阻止，浏览器会刷新页面，导致我们的 JavaScript 处理逻辑失效
  e.preventDefault();

  // ---- 第 2 步：检查登录状态 ----
  const user = checkAuth();
  if (!user) return;  // 未登录，checkAuth 已经做了跳转

  // ---- 第 3 步：收集表单数据 ----
  // .value：获取表单输入框的当前文本内容
  // .trim()：去掉首尾空白字符
  const newUsername = document.getElementById('username').value.trim();
  const newBio = document.getElementById('bio').value.trim();

  const avatarInput = document.getElementById('avatarInput');
  // 获取头像数据，优先级：
  // 1. avatarInput.dataset.preview（裁剪后的新头像数据，由 confirmCrop 设置的）
  // 2. user.avatar（用户原有的头像）
  // 3. DEFAULT_AVATAR（默认头像）
  const avatarBase64 = avatarInput.dataset.preview || user.avatar || DEFAULT_AVATAR;

  // ---- 第 4 步：验证用户名 ----
  // 如果用户名为空（用户删光了所有字符）
  if (!newUsername) {
    // 显示错误消息：找到 id="error" 的元素，设置其文本内容
    document.getElementById('error').textContent = '用户名不能为空';
    // 显示错误提示框（display: block 使其可见）
    document.getElementById('error').style.display = 'block';
    // 隐藏成功提示框（如果有显示的话）
    document.getElementById('success').style.display = 'none';
    // 结束函数，不继续执行保存
    return;
  } /* ── if (!newUsername) 结束 ── */

  // ---- 第 5 步：调用后端 API 更新用户资料 ----
  /**
   * 不再保存到 localStorage 的 users 数组，改为通过后端 API 更新
   *
   * API 地址：https://mynewswork.3454381311.workers.dev/api/users/ + user.id
   * HTTP 方法：PUT（更新服务器上的现有资源）
   *
   * 请求头：
   *   Content-Type: application/json   —— 请求体为 JSON 格式
   *   Authorization: Bearer <token>    —— 身份验证 token，从 localStorage 的 currentUser 中获取
   *
   * 请求体：包含更新后的用户名、简介和头像的 JSON 对象
   *
   * 如果服务器返回成功（res.ok）：
   *   1. 从响应中获取更新后的用户信息
   *   2. 更新 localStorage 中的 currentUser（保留原有的 token）
   *   3. 显示成功提示，刷新导航栏
   * 如果失败，从响应 JSON 中获取 error 信息并弹窗提示
   */
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  try {
    const res = await fetch('https://mynewswork.3454381311.workers.dev/api/users/' + currentUser.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (currentUser ? currentUser.token : '')
      },
      body: JSON.stringify({
        username: newUsername,
        bio: newBio,
        avatar: avatarBase64
      })
    });

    if (res.ok) {
      // 解析服务器返回的更新后用户信息
      const updated = await res.json();
      // 保留原有的 token，因为服务器不会在响应中重新发放 token
      const currentToken = currentUser.token;

      // ---- 更新 currentUser 缓存 ----
      // 更新 localStorage 中的 currentUser 对象
      // 确保导航栏和其他页面能立即看到最新的用户信息
      localStorage.setItem('currentUser', JSON.stringify({
        id: updated.id,               // 用户 ID（来自服务器）
        username: updated.username,   // 更新后的用户名
        token: currentToken,          // 保留原有的 token
        avatar: updated.avatar || '', // 更新后的头像（可能为空）
        bio: updated.bio || ''        // 更新后的简介（可能为空）
      }));

      // ---- 显示成功提示 ----
      // 隐藏错误提示框
      document.getElementById('error').style.display = 'none';
      // 设置成功消息文本
      document.getElementById('success').textContent = '保存成功！';
      // 显示成功提示框
      document.getElementById('success').style.display = 'block';

      // setTimeout：延迟执行函数，这里是 2000 毫秒（2 秒）后自动隐藏成功提示
      // 这样用户看到"保存成功"后，提示会自动消失，无需手动关闭
      setTimeout(function(){
        // 2 秒后执行：隐藏成功提示框
        document.getElementById('success').style.display = 'none';
      }, 2000); /* ── setTimeout 回调结束 ── */

      // ---- 刷新导航栏（显示更新后的用户名和头像） ----
      loadNav();

      // ---- 清空密码输入框（安全考虑：防止密码留在页面上） ----
      document.getElementById('oldPassword').value = '';
      document.getElementById('newPassword').value = '';
      document.getElementById('confirmPassword').value = '';

      // ---- 删除暂存的裁剪数据 ----
      // delete 操作符：删除对象的属性
      // 删除 dataset.preview 属性，避免下次提交时误用旧的裁剪数据
      delete avatarInput.dataset.preview;

    } else {
      // 服务器返回错误状态码，读取错误信息并弹窗提示用户
      const d = await res.json();
      alert(d.error || '保存失败');
    }
  } catch (err) {
    // 网络请求失败（如断网、服务器不可达），弹窗提示
    alert('保存失败: ' + err.message);
  }
} /* ── handleSave 函数结束 ── */

// =================== 页面初始化 ===================
// 页面加载完成后自动执行的代码

/**
 * 调用 loadProfile() 加载个人资料。
 *
 * 这行代码位于文件的顶层（不在任何函数内部），
 * 当浏览器加载并执行这个 JS 文件时，会立即执行这一行。
 * 它会：
 *   1. 检查用户是否登录
 *   2. 加载导航栏
 *   3. 从 localStorage 读取用户数据并填充到表单中
 *   4. 显示用户头像
 */
loadProfile();
