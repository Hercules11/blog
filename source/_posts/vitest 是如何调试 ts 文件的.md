---
title: vitest 是如何调试 ts 文件的（chatgpt 回答）
date: 2024-07-12 15:46:23
tags: 源代码分析
---

问：vitest 是如何调试 ts 文件的

Vitest 是一个快速的单元测试框架，它可以与 TypeScript 结合使用，并支持对 TypeScript 文件进行调试。Vitest 利用 Vite 的强大功能，自动处理 TypeScript 文件的编译和调试。下面是 Vitest 如何调试 TypeScript 文件的工作原理和相关配置。

### Vitest 如何调试 TypeScript 文件

#### 1. Vite 的支持

Vitest 构建在 Vite 之上。Vite 是一个基于 ES 模块的现代前端构建工具，具有快速的冷启动和热更新特性。Vite 内置了对 TypeScript 的支持，通过 esbuild 进行快速编译。因此，Vitest 可以利用 Vite 的 TypeScript 支持来处理和运行 TypeScript 文件。

#### 2. Source Maps

为了调试 TypeScript 文件，Vitest 使用 source maps。source maps 是一种将编译后的代码映射回源代码的技术，使得调试器可以显示源代码中的行号和文件名。TypeScript 编译器（tsc）和 Vite 都可以生成 source maps，确保在调试时看到的是 TypeScript 源代码，而不是编译后的 JavaScript 代码。

#### 3. 配置 Vitest 和 TypeScript

要使用 Vitest 测试和调试 TypeScript 文件，需要进行一些配置。

**项目结构示例**：

```
my-project/
  ├── node_modules/
  ├── src/
  │   ├── example.ts
  ├── test/
  │   ├── example.spec.ts
  ├── package.json
  ├── tsconfig.json
  └── vite.config.ts
```

**package.json**：
```json
{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch"
  },
  "devDependencies": {
    "typescript": "^4.5.4",
    "vite": "^2.7.2",
    "vitest": "^0.0.137"
  }
}
```

**tsconfig.json**：
```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "sourceMap": true,
    "outDir": "./dist"
  },
  "include": ["src", "test"]
}
```

**vite.config.ts**：
```typescript
import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    // Vitest configuration options
    globals: true,
    environment: 'node',
    include: ['test/**/*.spec.ts'],
    exclude: [...configDefaults.exclude, 'test/e2e/*']
  },
});
```

**example.spec.ts**：
```typescript
import { describe, it, expect } from 'vitest';
import { exampleFunction } from '../src/example';

describe('exampleFunction', () => {
  it('should return the correct value', () => {
    expect(exampleFunction()).toBe('expectedValue');
  });
});
```

### 调试 TypeScript 文件

#### 1. 在 VS Code 中配置调试

为了在 VS Code 中调试 Vitest 测试，需要添加调试配置。

**.vscode/launch.json**：
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Vitest Tests",
      "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
      "args": ["run", "--no-threads", "test"],
      "autoAttachChildProcesses": true,
      "smartStep": true,
      "sourceMaps": true,
      "internalConsoleOptions": "openOnSessionStart",
      "skipFiles": ["<node_internals>/**", "node_modules/**"]
    }
  ]
}
```

#### 2. 运行调试

1. 打开 VS Code。
2. 在调试面板中选择 `Debug Vitest Tests` 配置。
3. 设置断点。
4. 启动调试。

### 总结

Vitest 利用 Vite 的 TypeScript 支持和 source maps，能够轻松处理和调试 TypeScript 文件。通过正确配置项目和调试器，开发者可以在 Vitest 中进行有效的 TypeScript 单元测试和调试。