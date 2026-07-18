# Hackathon Demo Cost Plan

**Scope:** one synthetic FlowGrid Memory Runtime demo, deployed only long enough
to record and submit the hackathon proof.

## Recommended guardrail before approval

- **New mandatory spend:** $0.
- **AWS operating budget:** use existing AWS credits first; **recommend** a $3
  alert ceiling before deployment.
- **CockroachDB:** reuse the existing Basic cluster; do not create another
  cluster or add a paid plan for this demo.
- **Decommission:** recommend deleting the SAM stack after the recorded demo and submission
  review. Keep it only if a later, explicit product decision requires it.

An AWS Budget is an alert, not a real-time spending circuit breaker. It is a
warning layer; the hard control is a short-lived stack with no fixed-capacity
resources and prompt deletion after the demo.

## What the stack creates

| Resource | Idle cost | Guardrail |
| --- | --- | --- |
| CloudFormation / SAM | $0 | AWS-native resources have no separate CloudFormation charge. |
| Lambda, arm64, 512 MB | $0 | No provisioned concurrency; charged only when invoked. |
| API Gateway REST API | $0 | Charged only for API calls; no cache is configured. |
| Private S3 trace bucket | Near $0 | Synthetic JSON only; encryption, public block, 7-day expiry, delete with stack. |
| CloudWatch log group | Near $0 | 7-day retention and delete with stack. |
| SAM packaging bucket | Near $0 | Holds a small deployment artifact; inspect and delete after the demo if SAM leaves it behind. |

The template deliberately excludes EC2, ECS, RDS, NAT Gateway, load balancers,
Secrets Manager, and Lambda provisioned concurrency. Those are the common
sources of fixed or hourly surprise costs.

## Expected usage cost

The deployed verifier performs four API calls for one synthetic lifecycle:
initialize, propose, apply evidence, and read the final state. The Lambda also
writes one small S3 trace for each mutation.

| Scenario | AWS estimate | Reasoning |
| --- | --- | --- |
| Deploy, run verifier, record video, delete stack | **$0 expected** | Far below Lambda, API Gateway, and CloudWatch free allowances; S3 stores only a few small JSON traces for up to seven days. |
| Keep a private demo for seven days, under 1,000 full runs | **$0 expected** | Roughly 4,000 API/Lambda calls and 3,000 S3 writes, still tiny relative to included/free usage. |
| Keep a public URL with no rate limit | **Unbounded variable risk** | A public read endpoint can be abused, increasing API, Lambda, data-transfer, and CockroachDB request-unit usage. Do not leave it public after submission without an explicit product decision. |

AWS Lambda includes 1 million requests and 400,000 GB-seconds per month. API
Gateway REST API includes 1 million calls per month for eligible free-tier
accounts; after that, the first US East tier is $3.50 per million calls. The
first 100 GB of aggregate AWS data transfer out to the internet is free each
month. CloudWatch includes 5 GB of log usage. These allowances are account-wide,
so the Billing console is the final authority.

## CockroachDB cost boundary

The project uses the existing CockroachDB Basic cluster in Jakarta. Basic starts
at $0 and includes 50 million request units plus 10 GiB storage each month.
CockroachDB also provides trial credits, but the owner must check the Billing
page before deployment because credits and account-wide Basic usage can change.

This demo must not:

- create a second CockroachDB cluster in `us-east-1`;
- import real project data;
- run a background workload;
- leave a public API running after the hackathon proof.

## Approval gate before deployment

1. Confirm whether the recommended **$3 Cost Budget** alert ceiling is
   acceptable. Budget monitoring is free; alerts can be delayed.
2. In AWS Billing, confirm the existing credit balance and create the approved
   monthly Cost Budget alert.
3. In CockroachDB Billing, confirm the Basic cluster still has sufficient trial
   credit or monthly free usage.
4. Deploy only the reviewed `infra/template.yaml` in `us-east-1`.
5. Run `node scripts/verify-deployment.mjs`, capture the demo evidence, then
   run `sam delete` and confirm the S3 trace bucket is empty or removed.
6. Inspect the SAM-managed packaging bucket and remove the small artifact if it
   is no longer needed.

## Sources

- [AWS Lambda pricing](https://aws.amazon.com/lambda/pricing/)
- [AWS API Gateway pricing guidance](https://docs.aws.amazon.com/whitepapers/latest/best-practices-api-gateway-private-apis-integration/cost-optimization.html)
- [AWS S3 pricing](https://aws.amazon.com/s3/pricing/)
- [AWS CloudWatch pricing](https://aws.amazon.com/cloudwatch/pricing/)
- [AWS CloudFormation pricing](https://aws.amazon.com/cloudformation/pricing/)
- [AWS Budgets pricing](https://aws.amazon.com/aws-cost-management/aws-budgets/pricing/)
- [CockroachDB Cloud pricing](https://www.cockroachlabs.com/pricing/)
