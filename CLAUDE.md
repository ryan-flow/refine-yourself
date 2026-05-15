# Claude Code 项目配置

## 项目简介
"炼化自己" — 用户上传聊天记录 → AI 提炼人格画像 → 生成分享链接 → 任何人可与之对话。

## 技术栈
- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + base-ui/shadcn
- Supabase (PostgreSQL, free tier) + DeepSeek API
- Vercel 部署

## 目录约定
- `src/app/` — Next.js App Router 页面和 API 路由
- `src/components/{landing,chat,shared,ui}` — 按域划分的组件
- `src/lib/deepseek/` — AI 调用封装（persona-prompt / chat-prompt / client）
- `src/lib/supabase/` — Supabase 服务端客户端
- `src/types/` — TypeScript 类型定义

## 关键设计决策
1. **原始聊天记录不存储** — 读取后只传 DeepSeek，分析完即丢弃。数据库只存提炼后的 JSONB
2. **对话存 localStorage** — 无需后端存储，简化 MVP
3. **DeepSeek 纯 raw fetch** — 不引入 SDK 减小包体积
4. **分身通过随机 UUID 访问** — 无公开列表，不被爬虫扫到
5. **.env.local** — 需要 DEEPSEEK_API_KEY / Supabase URL+key

## 常用命令
- `npm run dev` — 启动开发服务器（localhost:3000）
- `npm run build` — 构建
- `npm run start` — 启动生产服务器

## API 路由
- `POST /api/persona` — multipart: file + name → DeepSeek → Supabase → return
- `GET /api/persona/[id]` — 公开分身信息
- `DELETE /api/persona/[id]` — 需 x-admin-token header
- `POST /api/chat/[id]` — message + history → DeepSeek → reply

查看 @AGENTS.md 了解 Next.js 16 兼容规则。
