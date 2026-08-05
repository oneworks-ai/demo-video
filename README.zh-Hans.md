# One Works 演示视频

[English](./README.md)

这个仓库是 One Works 产品视频生产的唯一事实来源。可复用录制器、后期脚本、安全演示数据、创作档案、投放清单和验证测试统一放在这里，让每条公开视频都能回溯到设计意图与具体实现。

主仓库 [`oneworks-ai/app`](https://github.com/oneworks-ai/app) 通过 `assets/demo-video` submodule 固定使用这里的版本。和 One Works 产品启动、workspace、Desktop Control 强耦合的薄集成仍留在主仓；可复用的视频逻辑归这个仓库。

## 记录内容

- `src/recorder.ts`：CDP 与 macOS 系统录屏、鼠标合成、镜头聚焦、关键帧和完整性校验。
- `src/scenarios.ts`：可复用的用户操作场景。
- `src/desktop-fixtures.ts`：不包含真实身份的演示数据契约。
- `src/postproduction/`：可复现的片头、转场和成片组装。
- `catalog/`：视频身份、源素材、产物和展示位置的机器可读记录。
- `docs/creative/`：设计逻辑、分镜、修订决策和验收证据。

先看[视频目录](./docs/catalog.md)，再进入目标视频的创作档案；跨视频复用的硬门禁见[录制标准](./docs/recording-standards.md)。

## 开发

```bash
corepack pnpm install
pnpm check
```

把 Adapter 片头合成到清洁的真实窗口录屏前面：

```bash
pnpm demo-video render-adapter-promo \
  --recording /path/to/adapter-promo-recording.mp4 \
  --output /path/to/adapter-promo-final.mp4 \
  --theme dark
```

全高清母版不提交到 Git。公开的 Web 衍生文件保存在主仓文档目录，但它们的用途和路径必须在本仓库登记。
