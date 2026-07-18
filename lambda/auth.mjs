export function hasValidWriteToken(event, expectedToken) {
  if (!expectedToken) return false;
  return event.headers?.["x-runtime-token"] === expectedToken
    || event.headers?.["X-Runtime-Token"] === expectedToken;
}
