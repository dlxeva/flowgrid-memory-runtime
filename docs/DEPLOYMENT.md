# Cloud Deployment Runbook

This optional guide deploys synthetic hackathon data only. It does not import FlowGrid ledgers, user sessions, or private evaluation material. It creates AWS resources and must not be run until a separate cost review approves it.

## 0. Local preflight (read-only)

AWS Console login does not automatically give a local terminal AWS credentials. Before any deploy, authenticate the AWS CLI through your approved account flow, then run the read-only preflight from the repository root:

```bash
chmod +x scripts/aws-preflight.sh
AWS_REGION=ap-southeast-3 scripts/aws-preflight.sh
```

The script runs `sam validate --lint` and `aws sts get-caller-identity`. It creates no cloud resources. If it reports missing credentials, complete CLI authentication first; do not work around that by putting long-lived keys in this repository.

The current CloudShell credential is valid in AWS US East (N. Virginia) (`us-east-1`). The first demo deployment therefore targets that region while connecting to the existing CockroachDB Basic cluster in AWS Jakarta (`ap-southeast-3`). This adds cross-region latency, but avoids creating a second database or persistent AWS credentials.

## 1. Create the CockroachDB Cloud cluster

1. The current free-tier target is the existing CockroachDB Basic cluster in AWS Jakarta (`ap-southeast-3`). The first Lambda deployment runs in `us-east-1` because the available CloudShell session can deploy there; do not create a second database for this demo.
2. Create a dedicated SQL user for this demo and copy its general connection string into a password manager.
3. Enable the vector-index feature, then apply [001_judgment_memory.sql](../infra/migrations/001_judgment_memory.sql) in the Cloud SQL shell. Verify with `SHOW CREATE TABLE memory_embeddings;` that its vector index uses `vector_l2_ops`, which matches the Lambda's `<->` retrieval query.
4. In the CockroachDB Cloud console, configure the managed MCP connection for the cluster. Use OAuth for interactive inspection. Do not create another cluster solely for this demo.

The runtime uses CockroachDB's `VECTOR(8)` field for a deterministic synthetic embedding. That lets the demo show real vector-index retrieval without storing any user content.

## 2. Supply the database URL only at deploy time

For this synthetic hackathon demo, pass the CockroachDB URL as a `NoEcho` CloudFormation parameter. SAM writes it to Lambda's encrypted environment and it is never committed, exposed to the browser, or stored in `template.yaml`.

This deliberately avoids the recurring cost of AWS Secrets Manager. It is a demo-only tradeoff: use a dedicated secret store before any production, shared, or customer-data deployment.

## 3. Build and deploy the Lambda stack

Run these commands from the repository root in AWS CloudShell after installing the AWS SAM CLI. The template uses SAM's standard Node.js dependency build, so it does not require a separate bundler:

```bash
sam build --template-file infra/template.yaml
sam deploy --guided \
  --stack-name flowgrid-memory-runtime \
  --region us-east-1 \
  --parameter-overrides \
    DatabaseUrl=<cockroachdb-connection-url> \
    RuntimeWriteToken=<long-random-token>
```

The stack creates a Lambda function, an API Gateway endpoint, and a private S3 bucket for synthetic run traces. The bucket has no public access, expires traces after seven days, and is deleted with the stack to avoid lingering demo-storage cost. Lambda logs also expire after seven days and are deleted with the stack. Empty the bucket before deleting the stack if you do not wait for lifecycle expiration; CloudFormation cannot delete a non-empty bucket. The stack binds both the browser root path (`/runtime`) and future nested runtime paths (`/runtime/{proxy+}`). The write token protects `POST` operations. Keep it in a local shell variable for the live demo; never embed it in the public frontend.

## 4. Smoke test the deployed API

```bash
RUNTIME_API_URL=<CloudFormation RuntimeApiUrl output> \
RUNTIME_WRITE_TOKEN=<RuntimeWriteToken> \
node scripts/verify-deployment.mjs
```

The script creates a unique synthetic project and verifies the complete lifecycle: `D-001` is confirmed, `P-001` stays pending, qualifying evidence applies it, and `D-002` supersedes `D-001`. It prints only a status summary, never the write token or database URL.

## 5. Demo proof

Capture four pieces of evidence for the submission:

1. CockroachDB Cloud schema with the vector index.
2. Managed MCP reading the active judgment and its audit history.
3. API response that creates `P-001` while `D-001` stays confirmed.
4. API response that applies evidence, supersedes `D-001`, and writes an S3 synthetic trace.
