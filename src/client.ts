import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";

export async function createMcpClient() {
  const client = new Client({
    name: "my-first-client",
    version: "1.0.0",
  });

  const transport = new StdioClientTransport({
    command: "bun",
    args: ["src/server.ts"],
  });

  await client.connect(transport);

  return client;
}