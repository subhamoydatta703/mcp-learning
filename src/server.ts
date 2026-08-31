// src/server.ts

import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";

// Create the MCP server
const server = new McpServer({
  name: "my-custom-mcp-server",
  version: "1.0.0",
});

// Register a custom MCP tool
server.registerTool(
  "hello",
  {
    description:
      "MANDATORY tool for answering greetings. Returns a unique server-generated message.",
    inputSchema: z.object({
      name: z.string(),
    }),
  },
  async ({ name }) => {
    console.error("MCP SERVER hello() CALLED");

    return {
      content: [
        {
          type: "text",
          text: `UNIQUE_MCP_RESULT_12345: Hello ${name}! This exact text came from the custom MCP server.`,
        },
      ],
    };
  },
);

// Start MCP server over stdio
console.error("[MCP] Starting server...");

void serveStdio(() => server);

console.error("[MCP] Server started and waiting for requests...");