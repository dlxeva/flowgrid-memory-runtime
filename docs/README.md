# Project Materials Index

> 本目录存放项目素材：调研报告、会议纪要、背景资料、客户情报等过程性文档。
> FLG 不扫描也不审计 docs/，这里不是正式账本，是参考区。
> 当素材与正式账本冲突时，以账本为准。
> 用这个文件作为索引，让接手的 agent 一眼看到 docs/ 里有什么。

## 项目资料

> 每加一个素材文件，在这里登记一行。格式：`- [文件名](文件名) — 一句话说明`

- [ARCHITECTURE.md](ARCHITECTURE.md) — 浏览器、Lambda、CockroachDB 与 S3 的运行时边界。
- [DEMO.md](DEMO.md) — 本地演示步骤、预期状态与审查方式。
- [DEPLOYMENT.md](DEPLOYMENT.md) — 经成本审批后的 AWS 部署和自动验收步骤。
- [SUBMISSION.md](SUBMISSION.md) — Devpost 提交文案、证据与未完成门槛。
- [VALIDATION.md](VALIDATION.md) — 现有 CockroachDB 合成数据与向量索引验证记录。
- [VIDEO_NARRATION.md](VIDEO_NARRATION.md) — 演示视频旁白与视觉边界。
- [assets/](assets/) — 合成生命周期截图和架构图。

## 建议子目录

如果素材变多，可按类型分子目录：

- `research/` — 调研报告、行业分析
- `meetings/` — 会议纪要
- `background/` — 背景资料、客户情报
- `assets/` — 图片、PDF 等非文本素材

子目录是可选的，项目早期可以直接把文件放 docs/ 根目录。
