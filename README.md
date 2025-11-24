# Artgame Connect (Frontend Only)

English
-------

This folder contains the frontend-only version of Artgame Connect — a static client you can open locally or serve via a simple static server. It's useful for demos, UI development, or when you want to run the client against a mock backend.

Project layout
- `frontend/` - static client with HTML/CSS/JS
- `frontend/assets/js/mock-backend.js` - an optional mock backend used by the client (if present)
- `frontend/assets/js/api-adapter.js` - adapter used to switch between real API endpoints and the mock backend

How to run locally
- Option A — open directly in a browser (works for most features that don't require CORS/API calls). Open `frontend/index.html`.
- Option B — serve with a simple static server (recommended to avoid some browser restrictions):

```powershell
cd e:\xjtlu\ENT207TC\Artgame-Connect-v14-Frontend-Only\frontend
# If you have Node installed:
npx http-server -p 8080
# or using Python 3:
python -m http.server 8080
```

Then open `http://localhost:8080`.

Connecting to a real backend
- By default the frontend may be configured to use a mock backend. To point it to a real API, edit `frontend/assets/js/api-adapter.js` and update the base URL and endpoints to your backend server.

Demo credentials
- The UI references demo accounts in translations (password `123456`). Use these for quick demo logins if the mock backend supports them.

Known issues
- `frontend/assets/js/lang.js`: English translation key `errorSearchingCreators` has an incorrect value; you may see an unexpected message when that error occurs.

中文（简体）
----------------

该目录为前端独立版本，包含静态客户端文件，适用于演示、界面开发或使用模拟后端时运行客户端。

项目结构
- `frontend/` - 静态客户端（HTML/CSS/JS）
- `frontend/assets/js/mock-backend.js` - 可选的模拟后端（如果存在）
- `frontend/assets/js/api-adapter.js` - 用于在真实后端与模拟后端之间切换的适配器

本地运行
- 选项 A — 直接在浏览器中打开 `frontend/index.html`（适用于不涉及跨域/API 调用的功能）。
- 选项 B — 使用静态服务器（推荐，以避免浏览器限制）：

```powershell
cd e:\xjtlu\ENT207TC\Artgame-Connect-v14-Frontend-Only\frontend
# Node 环境下：
npx http-server -p 8080
# 或使用 Python 3：
python -m http.server 8080
```

然后打开 `http://localhost:8080`。

连接真实后端
- 前端默认可能使用模拟后端。要连接真实 API，请编辑 `frontend/assets/js/api-adapter.js` 并将基地址与接口路径指向你的后端服务器。

演示登录
- 翻译中提到的演示账号密码为 `123456`，若模拟后端支持可用于快速登录演示。

已知问题
- `frontend/assets/js/lang.js`：英文翻译键 `errorSearchingCreators` 的值被误设，可能导致该错误提示显示不正确。
