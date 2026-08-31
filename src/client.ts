import { Client } from '@modelcontextprotocol/client';
import { StdioClientTransport } from '@modelcontextprotocol/client/stdio';



const client = new Client({ name: 'my-first-client', version: '1.0.0' });

const transport = new StdioClientTransport({
    command: 'bun',
    args: ['src/server.ts']
});


await client.connect(transport);


const { tools } = await client.listTools();
for (const tool of tools) {
    console.log(tool.name, '—', tool.description);

}

const result = await client.callTool({ name: 'add', arguments: { a: 1, b: 2 } });

for (const block of result.content) {
    if (block.type === 'text') console.log(block.text);
}