/**
 * 南湖新闻 - Cloudflare Workers 后端
 * 
 * 功能：
 * - 用户注册 / 登录（基于 Token 认证）
 * - 新闻的增删改查（CRUD）
 * - 用户资料管理
 * 
 * 数据存储在 Cloudflare Workers KV（键值存储）中：
 * - 'users' 键：存储所有用户数据（JSON 对象，key 为用户 ID）
 * - 'news' 键：存储所有新闻数据（JSON 数组）
 * 
 * 部署方式：
 * 1. 在 Cloudflare Dashboard 创建一个 KV namespace（例如叫 NEWS_KV）
 * 2. 创建 Worker，在绑定中绑定该 KV namespace，变量名设为 NEWS_KV
 * 3. 把本文件内容粘贴到 Worker 编辑器中
 * 4. 点击部署
 */

/* ============================== 入口：处理所有请求 ============================== */

/**
 * fetch - Workers 的入口函数，每次请求都会调用
 * 
 * @param {Request} request - 浏览器的 HTTP 请求对象
 * @param {Object} env - 环境变量和 KV 绑定的容器
 * @returns {Response} HTTP 响应对象
 */
export default {
  async fetch(request, env) {
    // 解析请求的 URL 和路径
    const url = new URL(request.url);            // 把 URL 字符串解析成对象
    const path = url.pathname;                     // 获取路径部分，例如 /api/news
    const method = request.method;                 // 获取 HTTP 方法：GET / POST / PUT / DELETE

    /* ---- CORS 跨域头（允许前端在另一个域名下访问这个 API） ---- */

    /**
     * CORS（跨域资源共享）：
     * 当前端页面部署在 pages.dev，后端部署在 workers.dev，属于不同域名
     * 浏览器默认会阻止跨域请求，需要在响应头中声明允许跨域
     * 
     * Access-Control-Allow-Origin: '*' 表示允许任何网站访问
     */
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',         // 允许所有来源的跨域请求
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',  // 允许的 HTTP 方法
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',      // 允许的自定义请求头
    };

    // 处理预检请求（OPTIONS）：浏览器在发送跨域 POST/PUT/DELETE 前先发一个 OPTIONS 请求确认
    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });   // 返回空响应，只带 CORS 头
    }

    // 使用 try-catch 包裹所有路由，统一处理错误
    try {
      /* ======================== 路由匹配 ======================== */

      // POST /api/register - 用户注册
      if (path === '/api/register' && method === 'POST') {
        return await handleRegister(request, env, corsHeaders);
      }

      // POST /api/login - 用户登录
      if (path === '/api/login' && method === 'POST') {
        return await handleLogin(request, env, corsHeaders);
      }

      // GET /api/news - 获取全部新闻列表
      if (path === '/api/news' && method === 'GET') {
        return await handleGetNews(env, corsHeaders);
      }

      // GET /api/news/123 - 获取单条新闻（路径以 /api/news/ 开头，后面跟数字 ID）
      if (/^\/api\/news\/\d+$/.test(path) && method === 'GET') {
        return await handleGetNewsById(path, env, corsHeaders);
      }

      // POST /api/news - 发布新新闻（需要登录认证）
      if (path === '/api/news' && method === 'POST') {
        return await handleCreateNews(request, env, corsHeaders);
      }

      // PUT /api/news/123 - 编辑新闻（需要登录认证，且只能是自己的新闻）
      if (/^\/api\/news\/\d+$/.test(path) && method === 'PUT') {
        return await handleUpdateNews(request, path, env, corsHeaders);
      }

      // DELETE /api/news/123 - 删除新闻（需要登录认证，且只能是自己的新闻）
      if (/^\/api\/news\/\d+$/.test(path) && method === 'DELETE') {
        return await handleDeleteNews(request, path, env, corsHeaders);
      }

      // GET /api/users/123 - 获取用户资料
      if (/^\/api\/users\/\d+$/.test(path) && method === 'GET') {
        return await handleGetUser(path, env, corsHeaders);
      }

      // PUT /api/users/123 - 修改用户资料（需要登录认证）
      if (/^\/api\/users\/\d+$/.test(path) && method === 'PUT') {
        return await handleUpdateUser(request, path, env, corsHeaders);
      }

      // 以上都没有匹配到 → 返回 404
      return jsonResponse({ error: '接口不存在' }, 404, corsHeaders);

    } catch (err) {
      // 代码执行过程中抛出了任何未捕获的错误，统一返回 500
      return jsonResponse({ error: '服务器内部错误: ' + err.message }, 500, corsHeaders);
    }
  }
};


/* ============================== 工具函数 ============================== */

/**
 * 生成一个随机的 Token（用于用户登录认证）
 * 使用 crypto.randomUUID() 生成标准的 UUID v4 格式字符串
 * 例如：'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
 */
function generateToken() {
  return crypto.randomUUID();
}

/**
 * 从 HTTP 请求中解析 JSON 请求体
 * 
 * @param {Request} request - 请求对象
 * @returns {Object} 解析后的 JavaScript 对象
 * @throws {Error} 如果请求头不是 application/json 则报错
 */
async function parseBody(request) {
  const contentType = request.headers.get('Content-Type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('请求格式错误，请使用 JSON 格式');
  }
  return await request.json();   // request.json() 会自动读取请求体并解析 JSON
}

/**
 * 验证登录身份 - 从 Authorization 请求头中提取 Token，查找对应用户
 * 
 * Authorization 头的格式：'Bearer xxxxxx'
 * 其中 xxxxxx 是登录时返回的 token 字符串
 * 
 * @param {Request} request - 请求对象
 * @param {Object} env - 环境变量
 * @returns {Object} 用户对象（包含 id, username, avatar, bio, token 等字段）
 * @throws {Error} 如果 Token 无效或过期
 */
async function authenticate(request, env) {
  // 1. 获取 Authorization 请求头
  const authHeader = request.headers.get('Authorization');
  
  // 2. 检查请求头是否存在且以 'Bearer ' 开头
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('请先登录');
  }

  // 3. 提取 Token 部分（去掉 'Bearer ' 这个前缀，共 7 个字符）
  const token = authHeader.slice(7);

  // 4. 从 KV 中读取所有用户数据
  const usersStr = await env.NEWS_KV.get('users');
  if (!usersStr) throw new Error('无用户数据');
  
  const users = JSON.parse(usersStr);  // 把 JSON 字符串解析回对象

  // 5. 遍历所有用户，查找 token 匹配的那个
  // Object.values(users) 取出所有用户组成数组
  // .find() 在数组中查找第一个满足条件的用户
  const user = Object.values(users).find(u => u.token === token);
  if (!user) throw new Error('登录已过期，请重新登录');

  return user;  // 返回找到的用户对象
}

/**
 * 生成 JSON 格式的 HTTP 响应
 * 
 * @param {Object} data - 要返回的数据对象
 * @param {number} status - HTTP 状态码（200 成功，400 参数错误，401 未登录，404 不存在，500 服务器错误）
 * @param {Object} corsHeaders - CORS 头
 * @returns {Response} HTTP 响应
 */
function jsonResponse(data, status, corsHeaders) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: {
      'Content-Type': 'application/json',   // 告诉浏览器返回的是 JSON 数据
      ...corsHeaders                         // 合并 CORS 头
    }
  });
}

/**
 * 从路径中提取数字 ID
 * 例如：'/api/news/123' → 123
 * 
 * @param {string} path - URL 路径
 * @returns {number} 提取出的数字 ID
 */
function getIdFromPath(path) {
  // 用 '/' 分割路径，取最后一段，再转成整数
  return parseInt(path.split('/').pop());
}


/* ============================== 注册 API ============================== */

/**
 * POST /api/register - 用户注册
 * 
 * 请求体格式：{ "username": "用户名", "password": "密码" }
 * 成功返回：{ "id": 1, "username": "用户名", "token": "xxx", "avatar": "", "bio": "..." }
 * 
 * @param {Request} request - 请求对象
 * @param {Object} env - 环境变量
 * @param {Object} corsHeaders - CORS 头
 */
async function handleRegister(request, env, corsHeaders) {
  // 解析请求体，获取用户名和密码
  const { username, password } = await parseBody(request);

  // 验证：用户名和密码不能为空
  if (!username || !password) {
    return jsonResponse({ error: '用户名和密码不能为空' }, 400, corsHeaders);
  }

  // 验证：密码长度至少 6 位
  if (password.length < 6) {
    return jsonResponse({ error: '密码长度至少6位' }, 400, corsHeaders);
  }

  // 从 KV 读取已有用户数据
  const usersStr = await env.NEWS_KV.get('users');
  const users = usersStr ? JSON.parse(usersStr) : {};   // 如果没有数据，初始化为空对象

  // 检查用户名是否已被注册
  // Object.values(users) 把 users 对象转成用户数组
  // .some() 遍历数组，只要有一个满足条件就返回 true
  if (Object.values(users).some(u => u.username === username)) {
    return jsonResponse({ error: '用户名已存在' }, 409, corsHeaders);
  }

  // 创建新用户对象
  // Date.now() 返回当前时间戳（毫秒），作为用户的唯一 ID
  const id = Date.now();
  const newUser = {
    id: id,                          // 用户唯一 ID
    username: username,               // 用户名
    password: password,               // 密码（生产环境应该加密存储，但本项目为教学简化）
    avatar: '',                       // 头像 URL，注册时为空，后续可在个人资料页设置
    bio: '这个人还没有简介哦~',       // 默认个人简介
    token: generateToken(),           // 生成一个登录 Token，注册成功后直接登录
    createdAt: Date.now()             // 注册时间
  };

  // 把新用户存入 users 对象（以用户 ID 为 key）
  users[id] = newUser;

  // 将更新后的用户数据写回 KV
  // JSON.stringify() 把 JavaScript 对象转成 JSON 字符串
  await env.NEWS_KV.put('users', JSON.stringify(users));

  // 注册成功，返回 201（Created）
  // 注意：返回的数据中不包含 password，保护用户隐私
  return jsonResponse({
    id: newUser.id,
    username: newUser.username,
    token: newUser.token,
    avatar: newUser.avatar,
    bio: newUser.bio
  }, 201, corsHeaders);
}


/* ============================== 登录 API ============================== */

/**
 * POST /api/login - 用户登录
 * 
 * 请求体格式：{ "username": "用户名", "password": "密码" }
 * 成功返回：{ "id": 1, "username": "用户名", "token": "xxx", "avatar": "", "bio": "..." }
 * 每次登录会重新生成 Token，旧的 Token 会失效（安全设计，防止 Token 泄露后被长期盗用）
 */
async function handleLogin(request, env, corsHeaders) {
  const { username, password } = await parseBody(request);

  // 验证：用户名和密码不能为空
  if (!username || !password) {
    return jsonResponse({ error: '请填写用户名和密码' }, 400, corsHeaders);
  }

  // 读取所有用户数据
  const usersStr = await env.NEWS_KV.get('users');
  const users = usersStr ? JSON.parse(usersStr) : {};

  // 在用户数组中查找用户名和密码都匹配的用户
  const user = Object.values(users).find(u => u.username === username && u.password === password);

  // 没找到 → 用户名或密码错误
  if (!user) {
    return jsonResponse({ error: '用户名或密码错误' }, 401, corsHeaders);
  }

  // 登录成功，重新生成 Token（旧 Token 失效）
  user.token = generateToken();
  users[user.id] = user;                     // 更新 users 对象中的该用户
  await env.NEWS_KV.put('users', JSON.stringify(users));  // 保存回 KV

  // 返回用户信息（不含密码）
  return jsonResponse({
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    bio: user.bio,
    token: user.token
  }, 200, corsHeaders);
}


/* ============================== 新闻相关 API ============================== */

/**
 * GET /api/news - 获取全部新闻列表
 * 
 * 返回所有新闻，按发布时间倒序（最新的在前）
 * 每条新闻包含：id, title, content, authorId, authorName, createdAt
 */
async function handleGetNews(env, corsHeaders) {
  // 从 KV 读取新闻数据
  const newsStr = await env.NEWS_KV.get('news');
  const news = newsStr ? JSON.parse(newsStr) : [];   // 如果没有新闻，返回空数组

  // 按发布时间倒序排列（最新的在前）
  // sort() 的 comparison function：如果 b.createdAt - a.createdAt > 0，b 排在 a 前面
  news.sort((a, b) => b.createdAt - a.createdAt);

  return jsonResponse(news, 200, corsHeaders);
}

/**
 * GET /api/news/123 - 获取单条新闻详情
 */
async function handleGetNewsById(path, env, corsHeaders) {
  const id = getIdFromPath(path);          // 从路径中提取新闻 ID

  const newsStr = await env.NEWS_KV.get('news');
  const news = newsStr ? JSON.parse(newsStr) : [];

  // 在数组中查找 ID 匹配的新闻
  const item = news.find(n => n.id === id);

  if (!item) {
    return jsonResponse({ error: '新闻不存在' }, 404, corsHeaders);
  }

  return jsonResponse(item, 200, corsHeaders);
}

/**
 * POST /api/news - 发布新新闻
 * 
 * 需要登录（需要在 Authorization 头中提供 Bearer Token）
 * 请求体格式：{ "title": "标题", "content": "内容（HTML格式）" }
 */
async function handleCreateNews(request, env, corsHeaders) {
  // 验证登录身份
  const user = await authenticate(request, env);

  // 解析请求体
  const { title, content } = await parseBody(request);

  // 验证标题和内容不能为空
  if (!title || !content) {
    return jsonResponse({ error: '标题和内容不能为空' }, 400, corsHeaders);
  }

  // 读取已有新闻
  const newsStr = await env.NEWS_KV.get('news');
  const news = newsStr ? JSON.parse(newsStr) : [];

  // 创建新新闻对象
  const newItem = {
    id: Date.now(),                // 用当前时间戳作为唯一 ID
    title: title,                   // 新闻标题
    content: content,               // 新闻内容（HTML 格式）
    authorId: user.id,              // 作者 ID
    authorName: user.username,      // 作者名称
    createdAt: Date.now()           // 发布时间
  };

  // 添加到数组并保存
  news.push(newItem);
  await env.NEWS_KV.put('news', JSON.stringify(news));

  return jsonResponse(newItem, 201, corsHeaders);
}

/**
 * PUT /api/news/123 - 编辑新闻
 * 
 * 需要登录，且只能编辑自己发布的新闻
 * 请求体格式：{ "title": "新标题", "content": "新内容" }
 * 可以只传 title 或 content 中的一个，另一个保持不变
 */
async function handleUpdateNews(request, path, env, corsHeaders) {
  // 验证登录身份
  const user = await authenticate(request, env);
  const id = getIdFromPath(path);          // 要编辑的新闻 ID
  const { title, content } = await parseBody(request);

  // 读取新闻数据
  const newsStr = await env.NEWS_KV.get('news');
  const news = newsStr ? JSON.parse(newsStr) : [];
  const idx = news.findIndex(n => n.id === id);   // 查找要编辑的新闻在数组中的位置

  // 新闻不存在
  if (idx === -1) {
    return jsonResponse({ error: '新闻不存在' }, 404, corsHeaders);
  }

  // 权限检查：只能编辑自己的新闻
  if (news[idx].authorId !== user.id) {
    return jsonResponse({ error: '只能编辑自己的新闻' }, 403, corsHeaders);
  }

  // 更新字段（只更新传了的值）
  if (title) news[idx].title = title;
  if (content) news[idx].content = content;

  // 保存回 KV
  await env.NEWS_KV.put('news', JSON.stringify(news));

  return jsonResponse(news[idx], 200, corsHeaders);
}

/**
 * DELETE /api/news/123 - 删除新闻
 * 
 * 需要登录，且只能删除自己发布的新闻
 */
async function handleDeleteNews(request, path, env, corsHeaders) {
  const user = await authenticate(request, env);
  const id = getIdFromPath(path);

  const newsStr = await env.NEWS_KV.get('news');
  const news = newsStr ? JSON.parse(newsStr) : [];
  const idx = news.findIndex(n => n.id === id);

  if (idx === -1) {
    return jsonResponse({ error: '新闻不存在' }, 404, corsHeaders);
  }

  // 权限检查
  if (news[idx].authorId !== user.id) {
    return jsonResponse({ error: '只能删除自己的新闻' }, 403, corsHeaders);
  }

  // 从数组中删除（splice 会修改原数组）
  news.splice(idx, 1);

  // 保存回 KV
  await env.NEWS_KV.put('news', JSON.stringify(news));

  return jsonResponse({ success: true, message: '删除成功' }, 200, corsHeaders);
}


/* ============================== 用户资料 API ============================== */

/**
 * GET /api/users/123 - 获取用户公开资料
 * 
 * 不需要登录（任何人都可以查看用户资料）
 * 返回的数据中不包含 password 和 token（隐私保护）
 */
async function handleGetUser(path, env, corsHeaders) {
  const id = getIdFromPath(path);
  
  const usersStr = await env.NEWS_KV.get('users');
  const users = usersStr ? JSON.parse(usersStr) : {};
  const user = users[id];

  if (!user) {
    return jsonResponse({ error: '用户不存在' }, 404, corsHeaders);
  }

  // 解构赋值：从 user 对象中提取出 password 和 token，剩下的放到 safeUser 中
  // 这样返回的数据就不包含敏感信息了
  const { password, token, ...safeUser } = user;

  return jsonResponse(safeUser, 200, corsHeaders);
}

/**
 * PUT /api/users/123 - 修改用户资料
 * 
 * 需要登录，且只能修改自己的资料
 * 请求体格式（可选字段，只传需要修改的）：
 * {
 *   "username": "新用户名",
 *   "bio": "新简介",
 *   "avatar": "头像 base64 或 URL",
 *   "oldPassword": "当前密码（修改密码时需要）",
 *   "newPassword": "新密码（修改密码时需要）"
 * }
 */
async function handleUpdateUser(request, path, env, corsHeaders) {
  // 验证登录身份
  const currentUser = await authenticate(request, env);
  const id = getIdFromPath(path);

  // 权限检查：只能修改自己的资料
  if (currentUser.id !== id) {
    return jsonResponse({ error: '只能修改自己的资料' }, 403, corsHeaders);
  }

  // 解析请求体
  const { username, bio, avatar, oldPassword, newPassword } = await parseBody(request);

  // 读取用户数据
  const usersStr = await env.NEWS_KV.get('users');
  const users = usersStr ? JSON.parse(usersStr) : {};
  const user = users[id];

  if (!user) {
    return jsonResponse({ error: '用户不存在' }, 404, corsHeaders);
  }

  // 更新基本信息（只更新传了值的字段）
  if (username) user.username = username;
  if (bio !== undefined) user.bio = bio || '这个人还没有简介哦~';  // 如果传了空字符串，用默认简介
  if (avatar !== undefined) user.avatar = avatar;

  // 修改密码逻辑
  if (oldPassword || newPassword) {
    // 验证当前密码是否正确
    if (user.password !== oldPassword) {
      return jsonResponse({ error: '当前密码错误' }, 400, corsHeaders);
    }
    // 验证新密码长度
    if (newPassword.length < 6) {
      return jsonResponse({ error: '新密码长度至少6位' }, 400, corsHeaders);
    }
    user.password = newPassword;   // 更新密码
  }

  // 保存修改后的用户数据
  users[id] = user;
  await env.NEWS_KV.put('users', JSON.stringify(users));

  // 返回时不包含敏感信息
  const { password, token, ...safeUser } = user;

  return jsonResponse(safeUser, 200, corsHeaders);
}
