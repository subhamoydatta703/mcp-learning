import { McpServer } from '@modelcontextprotocol/server';
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';
import * as z from 'zod/v4';

const server = new McpServer({ 
  name: 'calculator-server', 
  version: '1.0.0', 
},
{
  capabilities: {
    tools: {},
  },
});

server.registerTool(
  "add",
  {
    description: "Add two numbers together",
    inputSchema: {
      a: z.number(),
      b: z.number(),
    },
  },
  async ({ a, b }) => {
    return {
      content: [
        {
          type: "text",
          text: String(a + b),
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);