// src/Agent.ts

import "dotenv/config";

import { LlmAgent, MCPToolset } from "@google/adk";

export const rootAgent = new LlmAgent({
  name: "mcp_agent",

  model: "gemini-3.6-flash",

  instruction: `
You are a helpful assistant.

You have access to tools provided by a custom MCP server.

When the user asks you to use the MCP server,
use the appropriate MCP tool instead of answering directly.

For example, when asked to say hello,
you MUST call the "hello" tool.
`,

  tools: [
    new MCPToolset({
      type: "StdioConnectionParams",

      serverParams: {

        command: "bun",


        args: [
          "run",
          "E:\\mcp-learning\\src\\server.ts",
        ],
      },
    }),
  ],
});