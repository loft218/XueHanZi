# 学汉字

一个程序员老爸为小孩开发一款学习汉字的小程序

### 使用技术栈

- Taro

## 开发

### 项目初始化

```
taro init [AppName]
```

### 使用 Tailwind

```sh
npm i tailwindcss
```

```
//tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
};
export default config;
```

配置参考项目：https://github.com/dcasia/mini-program-tailwind

### 配置 eslint

遵循个人喜好就好

1. 修改`.eslintrc` 为 `.eslintrc.json`
2. 安装 `eslint-plugin-import` 和 `eslint-import-resolver-typescript`

```sh
npm install eslint-plugin-import --save-dev
npm install eslint-import-resolver-typescript --save-dev
```

3. 参见本项目的 `eslintrc.json`

### 使用 animate.scss

1. 下载 `animate.css`，地址：https://github.com/animate-css/animate.css/releases/

2. 由于小程序对代码大小限制比较大，所以删除了 `animate.css` 中 所有`@-webkit-` 部分 css，减少了一半体积

```
@-webkit.*(\n*[^@]*)\}
```

3. 修改 `animate.css` 第一行的 `:root{}` 改成 `page{}` ，小程序里面没用 `:root`

```
:root{--animate-duration:1s;--animate-delay:1s;--animate-repeat:1}
// 改为
page{--animate-duration:1s;--animate-delay:1s;--animate-repeat:1}
```

4. 重命名为 `animate.scss`

5. 在 `app.scss` 引入

```
@import "./animate.scss";
```

### 其它配置

1. 修改 `config/index.ts` Webpack5 持久化缓存配置

```ts
const baseConfig: UserConfigExport = {
  cache: {
    enable: true,
  },
};
```

2. `app.config.ts` 增加 lazyCodeLoading

```ts
export default defineAppConfig({
  lazyCodeLoading: "requiredComponents",
});
```

3. `.gitattributes` 配置，解决不同的换行符格式

```
* text=auto
```
