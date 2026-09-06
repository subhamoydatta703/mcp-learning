
import "dotenv/config";
import { LlmAgent, MCPToolset } from "@google/adk";
import { getGmailAccessToken } from "./gmailAuth";

export const rootAgent = new LlmAgent({
  name: "gmail-agent",
  model: "gemini-3.6-flash",
  instruction: `
You are a Gmail assistant.
Use the available Gmail MCP tools whenever the user asks
you to search, read, or create Gmail drafts.
`,
  tools: [
  new MCPToolset({
    type: "StreamableHTTPConnectionParams",
    url: "https://gmailmcp.googleapis.com/mcp/v1",
    transportOptions: {
      fetch: (async (input, init) => {
        const token = await getGmailAccessToken();
        const headers = new Headers(init?.headers);
        headers.set("Authorization", `Bearer ${token}`);
        return fetch(input, { ...init, headers });
      }) as typeof fetch,
    },
  }),
],
});