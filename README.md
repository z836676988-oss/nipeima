# 🐾 你配吗 - 宠物相亲 App

## 快速开始（获取 APK）

### 方法一：GitHub Actions 自动构建（推荐，无需本地环境）

1. 将本项目推送到你的 GitHub 仓库
2. 进入仓库页面 → Actions → 选择 "Build Android APK" → 点击 "Run workflow"
3. 等待约 10-15 分钟，构建完成后在 Actions 页面下载 `nipeima-debug-apk` 压缩包
4. 解压得到 `app-debug.apk`，传到手机安装即可

### 方法二：本地构建（需要 Android 开发环境）

```bash
# 1. 安装依赖
npm install

# 2. 构建 APK
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle
cd android && ./gradlew assembleDebug

# APK 位置: android/app/build/outputs/apk/debug/app-debug.apk
```

## 后端部署

App 需要后端 API 才能正常运行。后端代码在 `nipema_app/backend/` 目录。

### 本地启动后端

```bash
cd nipema_app/backend
set PYTHONPATH=%CD%
python -m pip install -r requirements.txt
python -m app.seed
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 修改 API 地址

打开 `src/api/client.js`，将 `BASE_URL` 改为你后端的实际地址：

```javascript
const BASE_URL = 'http://你的服务器IP:8000/api/v1';
```

## 技术栈

- **前端**: React Native 0.73
- **后端**: FastAPI (Python 3.8+)
- **数据库**: JSON 文件存储（轻量，无需安装数据库）

## 功能

- ✅ 用户注册/登录（含社交偏好设置）
- ✅ 宠物卡片浏览（附近宠物）
- ✅ 宠物详情与匹配
- ✅ 消息聊天
- ✅ 动态广场
- ✅ 个人主页
