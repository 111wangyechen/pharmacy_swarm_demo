# 数字副店长工作台 — 前端 Demo

> 对齐 [docs/PRD-数字副店长工作台-MVP.md](docs/PRD-数字副店长工作台-MVP.md) 与 [docs/DESIGN-SPEC-B-WORKBENCH.md](docs/DESIGN-SPEC-B-WORKBENCH.md)

## 在线预览

浏览器直接打开 **`index.html`**，无需构建与服务器。

## 文档

| 文档 | 说明 |
|------|------|
| [docs/PRD-数字副店长工作台-MVP.md](docs/PRD-数字副店长工作台-MVP.md) | 产品需求：闭环、角色、实体、状态机、验收 |
| [docs/DESIGN-SPEC-B-WORKBENCH.md](docs/DESIGN-SPEC-B-WORKBENCH.md) | UI 规范：壳层、令牌、工作台卡片与 Modal |
| [docs/DEMO.md](docs/DEMO.md) | Demo 与 PRD 映射及交互说明 |

## 页面结构（场景导航）

| 模块 | 说明 |
|------|------|
| 工作台 | Hero、常用应用、今日机会、AI 助手、全部分类 Tab |
| 会员洞察 | 人群包、列表、推荐原因（示意） |
| 门店活动 | 活动 Tab、审核与判断依据（示意） |
| 门店执行 | 店长任务 / 店员服务卡 + 风险提示 |
| 活动复盘 | KPI、漏斗、结论（示意） |
| 策略模板 | 模板卡与「一键生成草案」 |

## 文件结构

```
pharmacy-swarm-demo/
├── docs/
│   ├── PRD-数字副店长工作台-MVP.md
│   ├── DESIGN-SPEC-B-WORKBENCH.md
│   └── DEMO.md
├── index.html
├── style.css
├── script.js
└── README.md
```

## 技术栈

- HTML + CSS + 原生 JS，无 npm 依赖。

## License

MIT
