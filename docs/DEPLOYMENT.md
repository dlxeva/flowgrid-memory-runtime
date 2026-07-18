# Cloud Deployment Runbook

This optional guide deploys synthetic hackathon data only. It does not import FlowGrid ledgers, user sessions, or private evaluation material. It creates AWS resources and must not be run until a separate cost review approves it.

## 1. Create the CockroachDB Cloud cluster

1. The current free-tier target is the existing CockroachDB Basic cluster in AWS Jakarta (`ap-southeast-3`). Deploy Lambda in the same region to avoid a second cluster and cross-region latency.
2. Create a dedicated SQL user for this demo and copy its general connection string into a password manager.
3. Enable the vector-index feature, then apply [001_judgment_memory.sql](../infra/migrations/001_judgment_memory.sql) in the Cloud SQL shell.
4. In the CockroachDB Cloud console, configure the managed MCP connection for the cluster. Use OAuth for interactive inspection. Do not create another cluster solely for this demo.

The runtime uses CockroachDB's `VECTOR(8)` field for a deterministic synthetic embedding. That lets the demo show real vector-index retrieval without storing any user content.

## 2. Store the database URL in AWS

In AWS Secrets Manager, create a secret containing the CockroachDB connection URL as a plain string. Name it `flowgrid-memory-runtime/database-url`.

Do not put the URL in `template.yaml`, a browser client, Git, or a Lambda environment variable.

## 3. Build and deploy the Lambda stack

Run these commands from the repository root in AWS CloudShell after installing the AWS SAM CLI. The template uses SAM's standard Node.js dependency build, so it does not require a separate bundler:

```bash
sam build --template-file infra/template.yaml
sam deploy --guided \
  --stack-name flowgrid-memory-runtime \
  --region ap-southeast-3 \
  --parameter-overrides \
    DatabaseUrlSecretArn=<secret-arn> \
    RuntimeWriteToken=<long-random-token>
```

The stack creates a Lambda function, an API Gateway endpoint, and a private S3 bucket for synthetic run traces. The write token protects `POST` operations. Keep it in a local shell variable for the live demo; never embed it in the public frontend.

## 4. Smoke test the deployed API

```bash
API_URL=<CloudFormation RuntimeApiUrl output>
TOKEN=<RuntimeWriteToken>

curl "$API_URL?project=demo-launch"

curl -X POST "$API_URL?project=demo-launch" \
  -H "content-type: application/json" \
  -H "x-runtime-token: $TOKEN" \
  -d '{"action": "initialize_demo"}'

curl -X POST "$API_URL?project=demo-launch" \
  -H "content-type: application/json" \
  -H "x-runtime-token: $TOKEN" \
  -d '{
    "action": "request_revision",
    "decisionKey": "D-001",
    "revisionKey": "P-001",
    "request": "Try KOL promotion for launch.",
    "proposal": "Run a KOL-heavy launch campaign."
  }'
```

The endpoint must return a pending revision. It may only return `applied` after a later `apply_evidence` action supplies qualifying evidence.

## 5. Demo proof

Capture four pieces of evidence for the submission:

1. CockroachDB Cloud schema with the vector index.
2. Managed MCP reading the active judgment and its audit history.
3. API response that creates `P-001` while `D-001` stays confirmed.
4. API response that applies evidence, supersedes `D-001`, and writes an S3 synthetic trace.
