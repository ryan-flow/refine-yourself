<!-- BEGIN:nextjs-agent-rules -->
# Next.js 16 代理规则

此项目使用 Next.js 16，部分 API 和行为可能与你的训练数据有差异。请注意以下几点：

## 已知差异
- Next.js 16 使用 React 19.x，Server Components / Server Actions 行为有变化
- `next.config.ts` 使用 TypeScript 格式（非 `next.config.js` / `next.config.mjs`）
- Tailwind CSS 4 使用新的 CSS-first 配置方式（`@tailwindcss/postcss` 而非 `tailwind.config.js`）
- shadcn/ui 4.x 基于 base-ui（非 Radix UI），组件 API 不同
- ESLint 使用 flat config（`eslint.config.mjs`）

## 修改代码前
- 优先查阅 `node_modules/next/dist/docs/` 下的官方指南
- 注意 deprecation 警告
<!-- END:nextjs-agent-rules -->

---

# 项目上下文

**炼化自己** — 聊天记录人格提炼平台

架构：
- 前端：Next.js 16 App Router + Tailwind CSS 4 + shadcn/ui (base-ui based) + Lucide icons
- 后端：Next.js API Routes + Supabase (PostgreSQL)
- AI：DeepSeek API (raw fetch)
- 部署：Vercel

数据流：
1. 用户上传 .txt → API 校验 → DeepSeek 分析 → 存入 Supabase → 返回分享链接
2. 访客打开链接 → 获取人设 → 发送消息 → DeepSeek 按人设回复 → 对话存 localStorage

环境变量必填项：DEEPSEEK_API_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
