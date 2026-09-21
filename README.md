# Read Frog · 纯翻译版

基于 [Read Frog](https://github.com/mengxi-ream/read-frog) 精简的浏览器扩展，保留网页、划词、YouTube 字幕和输入框翻译，移除账号、订阅、埋点等功能。

翻译服务仅保留 **Google、Microsoft 和 DeepSeek**。Google、Microsoft 无需密钥；DeepSeek 需自行配置 API Key。网页支持双语和仅译文模式（Microsoft 不支持仅译文模式）。

## 开发

```bash
pnpm install
pnpm dev                     # Chrome 开发模式，端口 3333
pnpm build                   # 构建到 .output/chrome-mv3
pnpm build:firefox            # 构建到 .output/firefox-mv3
pnpm type-check
SKIP_FREE_API=true pnpm test  # 跳过免费翻译接口的联网测试
```

Chrome 手动安装：在 `chrome://extensions` 开启开发者模式，选择「加载已解压的扩展程序」，加载 `.output/chrome-mv3`。重新构建后，需重载扩展并刷新网页。

配置仅支持当前版本，不迁移旧版设置；升级到此精简版后需重新配置。

## 自动构建

推送到 `main` 或提交 PR 时，GitHub Actions 会运行检查并打包 Chrome、Firefox 扩展；也可手动触发 `Build extension`。在运行详情的 **Artifacts** 下载对应 ZIP，产物保留 14 天。Chrome 解压到含 `manifest.json` 的目录后即可加载；Firefox 产物未签名，不会自动发布到商店。

## 许可

[GPLv3](./LICENSE)，沿用上游许可。
