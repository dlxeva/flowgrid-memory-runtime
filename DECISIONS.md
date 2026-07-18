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
