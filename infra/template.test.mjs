import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const templatePath = fileURLToPath(new URL("./template.yaml", import.meta.url));

describe("SAM runtime routes", () => {
  it("maps both the browser runtime root and future nested runtime paths", async () => {
    const template = await readFile(templatePath, "utf8");

    expect(template).toMatch(/RuntimeRoot:[\s\S]*?Path: \/runtime\n[\s\S]*?Method: ANY/);
    expect(template).toMatch(/RuntimeProxy:[\s\S]*?Path: \/runtime\/\{proxy\+\}\n[\s\S]*?Method: ANY/);
  });
});
