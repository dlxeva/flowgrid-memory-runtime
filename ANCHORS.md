# Authoritative Anchors

> 定义当前项目的权威锚点文件。
> 同一主题下只有一份文件是"当前真相"，其他版本只能当参考或汇报壳。
> Agent 接手时应优先读取锚点文件，冲突时以锚点为准。

## Anchors

### Runtime implementation

- **File:** `lambda/app.mjs`
- **Role:** authoritative controlled Lambda read/write lifecycle
- **Authority:** authoritative
- **Provenance:** internal
- **Lifecycle:** active
- **Updated:** 2026-07-18
- **Notes:** defines the protected revision boundary and runtime database behavior.

### Cloud deployment contract

- **File:** `infra/template.yaml`
- **Role:** authoritative AWS infrastructure definition
- **Authority:** authoritative
- **Provenance:** internal
- **Lifecycle:** active
- **Updated:** 2026-07-18
- **Notes:** no deployment has occurred; the template is validated locally only.

### Runtime project state

- **File:** `SNAPSHOT.md`
- **Role:** current-stage status and immediate blocker
- **Authority:** authoritative
- **Provenance:** mixed
- **Lifecycle:** active
- **Updated:** 2026-07-18
- **Notes:** project status must not be inferred from generated `dist/` output or old video artifacts.

---

*Created: 2026-07-18T18:28:52*
*Last Updated: 2026-07-18T18:28:52*
