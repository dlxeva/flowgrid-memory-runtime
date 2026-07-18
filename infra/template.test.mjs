import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const templatePath = fileURLToPath(new URL("./template.yaml", import.meta.url));
const migrationPath = fileURLToPath(new URL("./migrations/001_judgment_memory.sql", import.meta.url));

describe("SAM runtime routes", () => {
  it("maps both the browser runtime root and future nested runtime paths", async () => {
    const template = await readFile(templatePath, "utf8");

    expect(template).toMatch(/RuntimeRoot:[\s\S]*?Path: \/runtime\n[\s\S]*?Method: ANY/);
    expect(template).toMatch(/RuntimeProxy:[\s\S]*?Path: \/runtime\/\{proxy\+\}\n[\s\S]*?Method: ANY/);
  });
});

describe("synthetic artifact retention", () => {
  it("deletes the demo bucket with the stack and expires traces after seven days", async () => {
    const template = await readFile(templatePath, "utf8");

    expect(template).toMatch(/DemoArtifactsBucket:[\s\S]*?DeletionPolicy: Delete/);
    expect(template).toMatch(/DemoArtifactsBucket:[\s\S]*?UpdateReplacePolicy: Delete/);
    expect(template).toMatch(/LifecycleConfiguration:[\s\S]*?Id: expire-synthetic-traces[\s\S]*?ExpirationInDays: 7/);
    expect(template).toMatch(/MemoryRuntimeLogGroup:[\s\S]*?RetentionInDays: 7/);
    expect(template).toMatch(/MemoryRuntimeLogGroup:[\s\S]*?DeletionPolicy: Delete/);
  });
});

describe("demo deployment secrets", () => {
  it("uses encrypted Lambda environment variables without provisioning Secrets Manager", async () => {
    const template = await readFile(templatePath, "utf8");

    expect(template).toMatch(/DatabaseUrl:[\s\S]*?NoEcho: true/);
    expect(template).toContain("DATABASE_URL: !Ref DatabaseUrl");
    expect(template).not.toContain("AWS::SecretsManager");
    expect(template).not.toContain("secretsmanager:");
  });
});

describe("CockroachDB vector contract", () => {
  it("declares the same L2 index operator used by the runtime", async () => {
    const migration = await readFile(migrationPath, "utf8");

    expect(migration).toContain("embedding vector_l2_ops");
    expect(migration).not.toContain("vector_cosine_ops");
  });
});
