export function deterministicEmbedding(input, dimensions = 8) {
  const output = Array.from({ length: dimensions }, () => 0);
  for (let index = 0; index < input.length; index += 1) {
    output[index % dimensions] += input.charCodeAt(index) / 255;
  }

  const magnitude = Math.hypot(...output) || 1;
  return output.map((value) => Number((value / magnitude).toFixed(6)));
}

export function vectorLiteral(vector) {
  return `[${vector.join(",")}]`;
}

export function classifyRevision({ hasQualifyingEvidence }) {
  return hasQualifyingEvidence ? "apply" : "propose";
}
