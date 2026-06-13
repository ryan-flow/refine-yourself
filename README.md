# 炼化自己

> **从聊天记录中提炼你的数字分身**

上传微信 / WhatsApp / Telegram 聊天记录，AI 自动分析语言风格、语气和用词习惯，生成人格画像。分享链接，任何人都可以与你的数字分身对话。

🌐 **在线体验：** [refine-yourself.vercel.app](https://refine-yourself.vercel.app)

---

## 功能

- **人格提炼** — 上传 .txt 聊天记录，DeepSeek AI 分析语言特征，生成多维度人格画像
- **智能对话** — 与数字分身对话，系统自动融入提炼出的人设和说话风格
- **一键分享** — 生成唯一链接，分享即可让朋友与你的分身聊天
- **隐私优先** — 原始聊天记录仅用于 AI 分析，处理完即丢弃，数据库只存人格描述文本

## 技术栈

| 层面 | 技术 |
|------|------|
| 框架 | [Next.js 16](https://nextjs.org/) (App Router) |
| 语言 | TypeScript |
| 样式 | [Tailwind CSS 4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) + [base-ui](https://base-ui.com/) |
| 图标 | [Lucide](https://lucide.dev/) |
| 数据库 | [Supabase](https://supabase.com/) (PostgreSQL) |
| AI | [DeepSeek API](https://platform.deepseek.com/) |
| 部署 | [Vercel](https://vercel.com/) |

## 快速开始

### 前置要求

- Node.js 18+
- npm / pnpm / yarn
- Supabase 项目（免费 tier 即可）
- DeepSeek API 密钥

### 安装

```bash
git clone https://github.com/kukik-s/refine-yourself.git
cd refine-yourself
npm install
```

### 环境变量

复制 `.env.example` 为 `.env.local`：

```bash
cp .env.example .env.local
```

填写以下变量：

| 变量 | 说明 | 获取方式 |
|------|------|----------|
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 | [platform.deepseek.com](https://platform.deepseek.com/) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | 同上 |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 服务角色密钥（写数据库用） | 同上 |
| `NEXT_PUBLIC_BASE_URL` | 部署域名（可选） | 默认 `http://localhost:3000` |

### 数据库

在 Supabase SQL Editor 中执行 `supabase-schema.sql` 创建 `personas` 表：

```sql
-- 包含字段：id, name, bio, persona_profile (JSONB), admin_token, created_at, chat_count
-- 已配置 Row Level Security 策略
```

### 启动

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## API 文档

### 创建分身

```
POST /api/persona
Content-Type: multipart/form-data

- file: .txt 聊天记录文件（最大 10MB）
- name: 分身名称（可选）
```

响应：

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "分身名称",
    "bio": "简介",
    "personaProfile": { /* 人格画像 JSON */ },
    "shareUrl": "https://...",
    "adminToken": "uuid"
  }
}
```

### 获取分身信息

```
GET /api/persona/[id]
```

### 删除分身

```
DELETE /api/persona/[id]
Headers: x-admin-token: <创建时返回的 token>
```

### 发送聊天消息

```
POST /api/chat/[id]
Content-Type: application/json

{
  "message": "你好！",
  "history": [{ "role": "user", "content": "..." }, ...]
}
```

## 项目结构

```
src/
├── app/
│   ├── page.tsx              # 首页（上传流程状态机）
│   ├── layout.tsx            # 根布局
│   ├── about/page.tsx        # 使用说明页
│   ├── chat/[id]/page.tsx    # 聊天页（服务端取数据）
│   └── api/
│       ├── persona/route.ts       # POST 创建分身
│       ├── persona/[id]/route.ts  # GET/DELETE 分身
│       └── chat/[id]/route.ts     # POST 聊天消息
├── components/
│   ├── landing/              # 首页组件
│   │   ├── hero-section.tsx
│   │   ├── upload-area.tsx   # 拖拽+点击上传
│   │   ├── name-input.tsx
│   │   ├── processing-state.tsx   # 三步动画
│   │   ├── persona-result.tsx     # 性格标签展示
│   │   └── share-result.tsx       # 分享链接+令牌
│   ├── chat/                 # 聊天组件
│   │   ├── chat-interface.tsx
│   │   ├── chat-message.tsx
│   │   ├── chat-input.tsx
│   │   ├── typing-indicator.tsx
│   │   ├── persona-header.tsx
│   │   └── empty-state.tsx
│   └── shared/               # 通用组件
│       ├── site-header.tsx
│       ├── site-footer.tsx
│       └── copy-button.tsx
├── lib/
│   ├── deepseek/
│   │   ├── client.ts         # DeepSeek API raw fetch 封装
│   │   ├── persona-prompt.ts # 人格提炼 prompt 构建
│   │   └── chat-prompt.ts    # 聊天 prompt 构建
│   ├── supabase/
│   │   └── server.ts         # Supabase 服务端客户端
│   ├── validators.ts         # 文件校验（大小+类型）
│   ├── chat-storage.ts       # localStorage 对话存储
│   └── utils.ts              # 工具函数
└── types/
    ├── persona.ts            # Persona / PersonaProfile 类型
    ├── chat.ts               # ChatMessage / SavedConversation
    └── api.ts                # ApiResponse 类型
```

## 数据流

```
用户上传 .txt
    → 后端校验（大小 ≤ 10MB、.txt 格式）
    → 发送 DeepSeek API 分析人格
    → 提炼结果存入 Supabase（原始聊天记录不存储）
    → 返回分享链接 + 管理令牌

访问分享链接
    → 前端加载人格数据
    → 用户输入消息
    → 后端构建 system prompt（人设 + few-shot 示例）
    → 调用 DeepSeek API 生成回复
    → 对话保存在浏览器 localStorage
```

## 部署

本项目针对 Vercel 部署优化。连接 GitHub 仓库后：

1. 在 Vercel Dashboard 中创建新项目，导入此仓库
2. 在 Settings → Environment Variables 中填入所有环境变量
3. 部署即可

## 如何使用

1. **导出聊天记录** — 使用 [WeChatMsg](https://github.com/LC044/WeChatMsg) 将微信聊天记录导出为 .txt
2. **上传** — 在本站上传 .txt 文件（支持微信/WhatsApp/Telegram 等格式）
3. **炼化** — AI 自动分析语言风格、常用词汇、语气特点
4. **分享** — 获得链接，发给朋友即可与分身对话

> 每个分身通过随机 UUID 访问，不存在公开列表，无需担心被爬虫扫描到。

## License

MIT

<!-- rebuild -->