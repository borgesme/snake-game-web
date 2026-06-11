---
title: 贪吃蛇 Web 项目优化清单
date: 2026-06-11
project: snake-game-web
tags: [analysis, optimization, backlog]
source: current-session
---

# 贪吃蛇 Web 项目优化清单

## 背景

本项目当前是一个基于 Vite、React、TypeScript、Canvas、Tailwind CSS 和 Zustand 的贪吃蛇单页应用。现状验证结果：

| 验证项 | 结果 | 说明 |
|---|---|---|
| `pnpm test` | 通过 | 5 个测试文件、23 个用例通过；存在 Canvas mock 相关警告 |
| `pnpm build` | 通过 | 默认路径构建成功 |
| `BASE_PATH=/snake-game-web/ pnpm build` | 通过 | GitHub Pages 子路径构建成功 |
| `git status --short --branch` | 干净 | 分析过程未留下源码变更 |

## 问题对比表

| 优先级 | 问题 | 现象 / 信号 | 核心判断 | 影响 |
|---|---|---|---|---|
| P1 | 食物与障碍生成缺少随机性 | `findFreeCell` 从左上角顺序扫描空位 | 游戏规则正确，但开局和食物路径过于固定 | 玩法重复感强，降低可玩性 |
| P1 | `useSnakeGame` 职责过重 | 一个 hook 同时负责 timer、状态提交、方向队列、score side effect、重置逻辑 | 当前可运行，但后续扩展会增加回归风险 | 新增音效、关卡、倒计时、持久化设置时容易变复杂 |
| P1 | 交互测试覆盖不足 | App 只有标题冒烟测试，hook 只有一个方向队列测试 | 核心引擎覆盖好，但用户流程覆盖薄 | UI 交互改动容易漏测 |
| P2 | Canvas 测试输出有噪声 | `pnpm test` 输出 `HTMLCanvasElement.getContext()` 未实现警告 | 测试通过，但测试环境没有统一 mock Canvas | 容易掩盖真实测试警告 |
| P2 | PWA 缓存策略粗粒度 | service worker 使用固定 `snake-game-web-v1`，预缓存范围很小 | 能离线兜底，但发布更新控制弱 | 用户可能遇到旧缓存不易刷新 |
| P3 | `themeId` 预留但未形成用户能力 | store 有 `themeId` / `setThemeId`，UI 没有主题选择 | 预留字段尚未闭环 | 长期看会形成死代码或误导 |
| P2 | 缺少 lint / format / typecheck 脚本和 CI 门禁 | `package.json` 只有 dev/build/preview/test，GitHub Actions 只跑 test/build | 类型检查、Lint、格式检查没有独立命令和最小 CI 门禁 | 团队协作或后续重构时一致性不足，格式和静态规则问题可能进入主分支 |
| P3 | 实施计划文档未同步状态 | `docs/superpowers/plans/2026-06-10-snake-game.md` 仍有大量未勾选步骤 | 计划文档与项目现状不一致 | 后续接手者难以判断哪些已完成 |

## 结论对比表

| 主题 | 结论 | 依据 | 风险 / 边界 |
|---|---|---|---|
| 当前健康度 | 项目整体结构健康，可维护性基础不错 | engine 是纯 TypeScript，store 边界清晰，构建和部署路径验证通过 | 问题主要在体验、测试和后续扩展成本 |
| 近期优先级 | 先做随机生成、hook 拆分、交互测试补强 | 这三项直接影响玩法质量和回归风险 | hook 拆分应保持行为不变，避免顺手重构 UI |
| PWA 优化 | 可作为第二阶段处理 | 当前构建可用，service worker 已能注册和缓存 | 如果发布频率提高，需要尽早改缓存版本策略 |
| 文档维护 | 应把计划文档归档或同步为完成状态 | 当前计划仍像执行中任务清单 | 不建议把历史计划直接删除，保留上下文更稳 |

## 关键结论

1. 当前项目不是“可运行性”问题，而是“玩法体验、测试可信度、维护成本”的优化问题。
2. `src/lib/game/engine.ts` 的纯函数边界值得保留；随机生成应通过可注入 RNG 或 seed 方式实现，避免破坏测试稳定性。
3. `src/hooks/useSnakeGame.ts` 是后续扩展的主要压力点，适合先做行为不变的结构拆分。
4. App 层和 hook 层测试应补用户流程，而不是继续只补 engine 单测。
5. PWA 和文档同步属于中低风险优化，可在核心交互稳定后处理。

## 建议路线

| 阶段 | 目标 | 建议改动 | 验证方式 |
|---|---|---|---|
| 第 1 阶段 | 提升玩法体验 | 为食物和障碍生成引入随机策略，测试中注入固定 seed | `pnpm test`、新增 engine 随机生成边界测试 |
| 第 2 阶段 | 降低 hook 复杂度 | 拆分 game loop、direction queue、controller actions，保持公开 hook API 不变 | `pnpm test`、hook 行为测试 |
| 第 3 阶段 | 补强交互回归 | 覆盖 start/pause/resume/restart、键盘、触摸、主题、障碍开关 | Testing Library 交互测试 |
| 第 4 阶段 | 清理测试噪声 | 在 `src/test/setup.ts` mock Canvas 和 ResizeObserver | `pnpm test` 输出无 Canvas 未实现警告 |
| 第 5 阶段 | 补齐工程门禁 | 增加 `typecheck`、`lint`、`format:check` 脚本，并接入 GitHub Actions | `pnpm typecheck`、`pnpm lint`、`pnpm format:check`、CI 通过 |
| 第 6 阶段 | 改善发布体验 | 改 service worker 版本策略或引入 Vite PWA / Workbox | 子路径 build、离线刷新 smoke test |
| 第 7 阶段 | 文档收口 | 更新或归档 superpowers plan，保留本优化清单作为 backlog | 文档审阅 |

## 工程门禁脚本优化项

| 项目 | 建议内容 | 目的 | 接入位置 |
|---|---|---|---|
| `typecheck` | `tsc -b` | 单独执行 TypeScript 编译检查，避免只能通过 `build` 间接检查类型 | `package.json` scripts |
| `lint` | ESLint 检查 React / TypeScript | 捕获 Hook 依赖、未使用代码、React 组件和 TypeScript 静态规则问题 | `package.json` scripts、ESLint 配置 |
| `format:check` | Prettier 或等价格式检查 | 保证代码、配置、Markdown 格式一致 | `package.json` scripts、Prettier 配置 |
| GitHub Actions 门禁 | 在 test/build 前后加入 `pnpm typecheck`、`pnpm lint`、`pnpm format:check` | 让主分支具备最小工程质量门禁 | `.github/workflows/deploy-pages.yml` |

建议实施时保持最小改动：

1. `build` 可继续保留 `tsc -b && vite build`，同时新增独立 `typecheck` 方便本地和 CI 精准定位类型错误。
2. ESLint 优先使用 flat config，覆盖 `src/**/*.{ts,tsx}`、`vite.config.ts`，并忽略 `dist`、`node_modules`。
3. Prettier 覆盖 TypeScript、CSS、HTML、Markdown、JSON、YAML；如果不引入 Prettier，也需要选择等价格式检查工具并写清规则。
4. GitHub Actions 建议顺序为 install -> typecheck -> lint -> format:check -> test -> build，失败时能尽早暴露低成本问题。
5. 该项涉及根配置、依赖和 CI，实施时应单独提交，避免和业务逻辑改动混在一起。

## 必要实现位置

| 位置 | 当前作用 | 为什么关键 |
|---|---|---|
| `src/lib/game/engine.ts:145` | `findFreeCell` 查找食物和障碍可用格子 | 生成策略在这里集中，适合引入随机候选或 seed |
| `src/hooks/useSnakeGame.ts:17` | 管理整局游戏控制逻辑 | timer、方向队列、score side effect 都在这里，复杂度最高 |
| `src/hooks/useSnakeGame.test.tsx:12` | 当前唯一 hook 行为测试 | 可扩展为 controller 行为回归测试入口 |
| `src/App.test.tsx:6` | 当前 App 冒烟测试 | 需要扩展为核心用户交互测试 |
| `src/test/setup.ts:1` | Vitest 全局测试初始化 | 适合统一 mock Canvas / ResizeObserver |
| `public/service-worker.js:1` | PWA 缓存版本与 fetch 策略 | 控制离线缓存和发布更新行为 |
| `src/store/gameStore.ts:14` | 存储 `themeId` | 决定保留多主题架构还是简化状态 |
| `docs/superpowers/plans/2026-06-10-snake-game.md:57` | 原实施计划 | 与当前完成状态不同步，需要归档或更新 |

## 待办清单

| 状态 | 事项 | 优先级 |
|---|---|---|
| 待办 | 为食物和障碍生成加入随机策略，并保持测试可复现 | P1 |
| 待办 | 拆分 `useSnakeGame` 内部职责，保持对外 API 不变 | P1 |
| 待办 | 增加 App/hook 交互测试 | P1 |
| 待办 | 在测试 setup 中补 Canvas 和 ResizeObserver mock | P2 |
| 待办 | 优化 service worker 缓存版本策略 | P2 |
| 待办 | 决定 `themeId` 是补 UI 能力还是移除 | P3 |
| 待办 | 增加 lint / format / typecheck 脚本，并接入 GitHub Actions | P2 |
| 待办 | 更新或归档原 superpowers plan | P3 |
