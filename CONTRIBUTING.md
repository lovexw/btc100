# 贡献指南

感谢你对 **Bitcoin $1M** 项目的兴趣！我们欢迎各种形式的贡献。

## 🤝 如何贡献

### 报告 Bug

如果你发现了 Bug，请提交一个 Issue：

1. 使用清晰、描述性的标题
2. 详细描述问题
3. 提供复现步骤
4. 说明期望行为和实际行为
5. 附加截图或日志（如果相关）

**Example:**
```
标题: 比特币价格在移动设备上显示不完整

描述:
在 iPhone 上打开应用时，实时价格数字被截断。

复现步骤:
1. 用 iPhone Safari 打开应用
2. 查看 BitcoinTracker 部分

期望: 价格完整显示
实际: 价格显示被裁剪
```

### 提议新功能

1. 先检查是否已有相关 Issue
2. 创建新 Issue，标题以 `[Feature]` 开头
3. 清晰描述功能的价值和用处
4. 提供实现方案的建议（可选）

### 提交代码

#### 前置条件
- Node.js 16+
- Git

#### 开发流程

1. **Fork 仓库**
   ```bash
   # 在 GitHub 上 fork 项目
   ```

2. **克隆你的 fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/bitcoin-1m.git
   cd bitcoin-1m
   ```

3. **创建功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **安装依赖并开始开发**
   ```bash
   npm install
   npm run dev
   ```

5. **进行更改并测试**
   - 在 `http://localhost:5173` 测试
   - 运行 linter：`npm run lint`
   - 确保代码风格一致

6. **提交你的改动**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

   **提交信息规范（Conventional Commits）：**
   - `feat:` 新功能
   - `fix:` 修复 bug
   - `docs:` 文档更新
   - `style:` 代码格式（不影响功能）
   - `refactor:` 重构
   - `perf:` 性能改进
   - `test:` 添加或修改测试
   - `chore:` 构建工具或依赖更新

7. **推送到你的 fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **提交 Pull Request**
   - 在 GitHub 上创建 PR
   - 清晰描述你的改动
   - 关联相关 Issue（如果有）
   - 等待代码审查

#### 代码风格指南

我们遵循以下约定：

**JavaScript/React:**
- 使用 ES6+ 语法
- 组件使用函数式写法（Hooks）
- 文件名使用 PascalCase（组件）或 camelCase（工具）
- 缩进：2 个空格
- 无分号（基于 ESLint 配置）
- 使用有意义的变量名

**示例：**
```jsx
// ✅ Good
export default function MyComponent() {
  const [count, setCount] = useState(0)
  
  const handleClick = () => {
    setCount(count + 1)
  }
  
  return (
    <button onClick={handleClick}>
      Count: {count}
    </button>
  )
}

// ❌ Avoid
export default (props) => {
  const a = useState(0)
  return <button onClick={() => a[1](a[0] + 1)}>Count: {a[0]}</button>
}
```

**Tailwind CSS:**
- 使用 Tailwind 工具类而不是自定义 CSS
- 响应式设计：`sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- 避免过深的嵌套

**示例：**
```jsx
// ✅ Good
<div className="w-full md:w-1/2 lg:w-1/3 px-4 py-2">
  Content
</div>

// ❌ Avoid
<div style={{ width: '100%', padding: '8px 16px' }}>
  Content
</div>
```

### 文档贡献

- 更新 README.md, DEPLOYMENT.md 等
- 修复拼写或语法错误
- 改进清晰度或可读性
- 添加使用示例

## 📋 PR 审查过程

我们的维护者会审查所有 PR：

1. **初始检查**
   - 代码风格是否一致
   - 是否有测试覆盖

2. **代码审查**
   - 逻辑是否正确
   - 性能是否可接受
   - 是否有更好的实现方式

3. **反馈和修改**
   - 我们会提出建议
   - 请根据反馈进行修改
   - 可能需要多次往返

4. **合并**
   - 一旦批准，将合并到主分支
   - 你将被添加到贡献者列表

## 🎯 优先处理的功能

我们特别欢迎以下方面的贡献：

- [ ] **多语言支持** - i18n 国际化
- [ ] **价格图表** - 使用 Chart.js 或 Recharts
- [ ] **PWA 支持** - Service Worker 和离线功能
- [ ] **价格警报** - 当价格达到某个值时通知
- [ ] **额外 API 支持** - 支持更多数据源
- [ ] **性能优化** - 减少包大小，改进加载时间
- [ ] **可访问性** - 改进 WCAG 合规性
- [ ] **测试** - 单元测试和集成测试

## 📚 有用的资源

### 项目特定
- [README.md](./README.md) - 项目概述
- [DEPLOYMENT.md](./DEPLOYMENT.md) - 部署指南
- [QUICKSTART.md](./QUICKSTART.md) - 快速开始

### 技术文档
- [React Docs](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Docs](https://vitejs.dev/)
- [MDN Web Docs](https://developer.mozilla.org/)

### 开源最佳实践
- [Open Source Guides](https://opensource.guide/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Keep a Changelog](https://keepachangelog.com/)

## 🛠️ 常见开发任务

### 添加新组件

```bash
# 创建新组件文件
touch src/components/NewComponent.jsx
```

```jsx
// src/components/NewComponent.jsx
export default function NewComponent() {
  return (
    <div className="...">
      New Component
    </div>
  )
}
```

```jsx
// 在 App.jsx 中导入并使用
import NewComponent from './components/NewComponent'

export default function App() {
  return (
    <>
      ...
      <NewComponent />
      ...
    </>
  )
}
```

### 修改样式

使用 Tailwind CSS 的工具类：

```jsx
// 直接在组件中使用
<div className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600">
  Styled content
</div>
```

### 测试改动

```bash
# 本地测试
npm run dev

# 生产构建测试
npm run build
npm run preview
```

## 🤔 问题和讨论

- 🐛 **Bug 报告**: Issues
- 💡 **功能建议**: Issues + Discussions
- 💬 **一般问题**: Discussions
- 📖 **文档问题**: Issues

## ✨ 贡献者

感谢所有为这个项目做出贡献的人！

## 📝 许可证

通过贡献，你同意你的贡献将在 MIT 许可证下发布。

## 🙏 最后的话

无论是代码、文档、测试还是想法，我们都欢迎你的贡献！

如有任何问题，请随时提问。我们希望 Bitcoin $1M 是一个友好、包容的社区。

---

**Happy contributing!** 🚀
