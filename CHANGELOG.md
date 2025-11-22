# 变更日志

所有对本项目的重要改动都会在此文件中记录。

本项目遵循 [Semantic Versioning](https://semver.org/) 和 [Keep a Changelog](https://keepachangelog.com/) 规范。

## [Unreleased]

### Added
- 初始项目版本

## [0.1.0] - 2024-01-XX

### Added
- ✨ 实时比特币价格追踪（来自 CoinGecko API）
- 📊 价格进度可视化（进度条）
- 🎯 里程碑追踪（历史重要价格节点）
- 💡 投资理念展示（6 个核心原则）
- 🎨 现代化优雅的网站设计
- 📱 完全响应式设计（手机、平板、桌面）
- ⚡ 极速加载（静态网站）
- 🔒 隐私优先（无数据收集）
- 🚀 Cloudflare Pages 部署支持
- 📚 完整的部署文档和快速开始指南

### Technical
- React 18 + Hooks
- Vite 5 构建工具
- Tailwind CSS 3
- Framer Motion 动画
- Lucide React 图标库
- ESLint 代码检查

### Documentation
- README.md - 项目概述
- DEPLOYMENT.md - Cloudflare 部署指南
- QUICKSTART.md - 快速开始
- CONTRIBUTING.md - 贡献指南
- 本 CHANGELOG.md

---

## 如何更新此文件

遵循以下格式：

```markdown
## [版本号] - YYYY-MM-DD

### Added
- 新功能描述

### Changed
- 现有功能的改动

### Fixed
- Bug 修复

### Removed
- 删除的功能

### Security
- 安全相关的改动
```

**版本号规则（Semantic Versioning）：**
- MAJOR.MINOR.PATCH
- MAJOR: 不兼容的 API 改动
- MINOR: 向后兼容的新功能
- PATCH: 向后兼容的 bug 修复

**例如：**
- 0.1.0 → 0.1.1（修复 bug）
- 0.1.1 → 0.2.0（新功能）
- 0.2.0 → 1.0.0（大版本更新）

---

## 发布流程

1. 更新版本号在 package.json
2. 在此文件中更新 [Unreleased] 部分
3. 创建 Git Tag: `git tag v版本号`
4. 推送 Tag: `git push origin v版本号`
5. 在 GitHub 创建 Release（自动生成发布说明）

---

**最后更新**: 2024年
**维护者**: Bitcoin $1M 项目团队
