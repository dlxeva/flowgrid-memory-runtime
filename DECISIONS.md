# Decision Log

> 每条决策记录"为什么这么做"，不只是"做了什么"。
> 记录背景、备选方案、放弃理由和复盘入口，让未来的你或Agent能理解判断链条。

## D-002 | The hackathon runtime uses synthetic data only; no

### 决策时间
2026-07-18

### 所属阶段
执行

### 决策背景
用户明确指令：直接写入决策日志（`flg decision add`）。

### 核心问题
项目推进中的关键判断

### 备选方案
A. Import a real ledger、Use anonymized project traces

### 最终决策
The hackathon runtime uses synthetic data only; no real FlowGrid ledger, user session, customer record, or private evaluation material may enter the demo.

### 决策理由
The submission needs a demonstrable memory lifecycle without exposing personal or project-sensitive context.

### 放弃理由
选择了当前方案，放弃其他备选方案。

### 风险判断
Synthetic data may weaken perceived realism; compensate with verifiable lifecycle and database evidence.

### 后续验证
通过后续执行结果和项目反馈验证。

### 复盘入口
如果关键前提变化或出现新的替代方案，需要重新评估。

---

*原则 | Source: Owner instruction and hackathon scope*

## D-003 | AWS deployment is gated by a separate explicit cos

### 决策时间
2026-07-18

### 所属阶段
执行

### 决策背景
用户明确指令：直接写入决策日志（`flg decision add`）。

### 核心问题
项目推进中的关键判断

### 备选方案
A. Deploy immediately、Create a second AWS environment

### 最终决策
AWS deployment is gated by a separate explicit cost review; until then only local validation and read-only cloud inspection are allowed.

### 决策理由
The owner requires zero unapproved cloud spend while away from the computer.

### 放弃理由
选择了当前方案，放弃其他备选方案。

### 风险判断
Public demo remains blocked until credentials and cost review are complete.

### 后续验证
通过后续执行结果和项目反馈验证。

### 复盘入口
如果关键前提变化或出现新的替代方案，需要重新评估。

---

*原则 | Source: Owner instruction: do not deduct fees and do what is safely possible*

## D-004 | Use L2 vector retrieval with normalized determinis

### 决策时间
2026-07-18

### 所属阶段
执行

### 决策背景
用户明确指令：直接写入决策日志（`flg decision add`）。

### 核心问题
项目推进中的关键判断

### 备选方案
A. Rebuild the live index as cosine、Keep a query/index mismatch

### 最终决策
Use L2 vector retrieval with normalized deterministic embeddings to match the existing CockroachDB Basic vector index.

### 决策理由
The live cluster uses vector_l2_ops; unit-normalized embeddings preserve cosine ranking under L2 and align query/index semantics without rebuilding cloud schema.

### 放弃理由
选择了当前方案，放弃其他备选方案。

### 风险判断
The synthetic embedding is only a runtime proof and does not claim production semantic quality.

### 后续验证
通过后续执行结果和项目反馈验证。

### 复盘入口
如果关键前提变化或出现新的替代方案，需要重新评估。

---

*原则 | Source: Live CockroachDB schema inspection and official CockroachDB vector-index documentation*

## D-005 | Use deploy-time encrypted Lambda environment varia

### 决策时间
2026-07-19

### 所属阶段
执行

### 决策背景
用户明确指令：直接写入决策日志（`flg decision add`）。

### 核心问题
项目推进中的关键判断

### 备选方案
A. AWS Secrets Manager、create a second CockroachDB cluster in us-east-1

### 最终决策
Use deploy-time encrypted Lambda environment variables instead of AWS Secrets Manager for the synthetic hackathon demo.

### 决策理由
Avoid the recurring Secrets Manager charge while keeping the CockroachDB URL out of Git, browser code, and the public template. The user confirmed the demo-only cost tradeoff.

### 放弃理由
选择了当前方案，放弃其他备选方案。

### 风险判断
The URL remains a CloudFormation deployment parameter; this is not appropriate for production, shared, or customer-data deployments.

### 后续验证
通过后续执行结果和项目反馈验证。

### 复盘入口
如果关键前提变化或出现新的替代方案，需要重新评估。

---

*决策 | Source: User confirmation in this session: no Secrets Manager; reduce fixed cost.*

## D-006 | Approve a short-lived synthetic AWS deployment under a $3 alert

### 决策时间
2026-07-19

### 所属阶段
执行

### 决策背景
Local implementation, SAM validation, and a cost plan were complete. The owner approved the reviewed $3 monthly AWS budget alert and deployment of the synthetic hackathon runtime.

### 核心问题
How to prove the Lambda-to-CockroachDB lifecycle without exposing private data or committing to fixed cloud spend.

### 备选方案
A. Leave AWS integration as local code only、Use a fixed-capacity service、Deploy the reviewed serverless synthetic stack

### 最终决策
Deploy the reviewed serverless stack in `us-east-1` with synthetic data only, a $3 monthly budget alert, seven-day log and trace retention, and a public read-only API.

### 决策理由
The hackathon requires meaningful AWS and CockroachDB integration plus a functional demo. Lambda, API Gateway, and a private expiring trace bucket provide verifiable integration while avoiding fixed-capacity resources.

### 放弃理由
Leaving the stack local would not satisfy the deployed-demo requirement. Fixed-capacity infrastructure would add avoidable cost and operational burden.

### 风险判断
The budget alert is monitoring rather than a hard cap. The CockroachDB URL and runtime write token must remain outside Git and the public browser build. The stack must be deleted after the demonstration window.

### 后续验证
The deployed verifier completed `D-001` confirmed -> `P-001` pending -> `D-001` superseded by `D-002`; an unauthenticated GET returned the final synthetic snapshot.

### 复盘入口
Reopen if the public read-only API creates abuse or cost pressure, the hackathon requires a different hosting model, or the project moves beyond synthetic data.

---

*决策 | Source: Owner-approved budget alert, CloudShell deployment output, and deployed verifier result.*
