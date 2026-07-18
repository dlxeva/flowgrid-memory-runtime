# Constraints and Rules

> 这里记录项目中的规则、约束、例外条件和复核触发器。
> 适合运营机制、解决方案边界、交付条件、审批条件等内容。

## Constraint Blocks

### Constraint 001: synthetic-only data

- **If:** adding data, examples, traces, or demo artifacts
- **Then:** use only synthetic hackathon data
- **Unless:** none
- **Owner:** project owner
- **Review Trigger:** any request to import a real FlowGrid ledger, user session, customer record, or private evaluation material

### Constraint 002: deployment cost gate

- **If:** creating AWS Secrets Manager, Lambda, API Gateway, S3, or another cloud resource
- **Then:** stop after read-only preflight and request a separate explicit cost review
- **Unless:** none
- **Owner:** project owner
- **Review Trigger:** before every `sam deploy` or console resource-creation action

### Constraint 003: protected human judgment

- **If:** an agent request conflicts with a confirmed judgment
- **Then:** create a pending revision and require qualifying evidence before supersession
- **Unless:** none
- **Owner:** runtime policy
- **Review Trigger:** a new lifecycle action, authority model, or automatic mutation path

### Constraint 004: environment alignment

- **If:** changing vector retrieval or deployment settings
- **Then:** preserve L2 vector retrieval against the existing CockroachDB Basic cluster in AWS Jakarta (`ap-southeast-3`)
- **Unless:** a documented migration and live validation replace the current cluster contract
- **Owner:** runtime maintainer
- **Review Trigger:** index/schema changes or deployment into another AWS region

---

*Created: 2026-07-18T18:28:52*
*Last Updated: 2026-07-18T18:28:52*
