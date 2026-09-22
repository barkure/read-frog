# Read Frog Lite

基于 [Read Frog](https://github.com/mengxi-ream/read-frog) 精简，支持网页、划词、YouTube 字幕和输入框翻译。

支持 Google、Microsoft（无需密钥）和 DeepSeek（需 API Key）。网页支持双语和仅译文模式，Microsoft 仅支持双语。

## 安装

从 [Actions](https://github.com/barkure/read-frog/actions) 的构建记录中下载对应浏览器的 ZIP。

Chrome：解压后，在 `chrome://extensions` 开启开发者模式，点击「加载已解压的扩展程序」，选择解压目录。Firefox 包未签名，仅供临时加载测试。

## 开发

```bash
pnpm install
pnpm dev                     # Chrome 开发模式，端口 3333
pnpm build                   # 构建到 dist/chrome-mv3
pnpm build:firefox            # 构建到 dist/firefox-mv3
pnpm type-check
SKIP_FREE_API=true pnpm test  # 跳过免费翻译接口的联网测试
```

本地构建后，Chrome 加载 `dist/chrome-mv3`。重新构建后重载扩展并刷新网页。

## 许可

沿用上游 [GPL v3](./LICENSE) 许可。
