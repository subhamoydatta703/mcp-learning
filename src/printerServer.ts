import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { exec } from "child_process";

const server = new McpServer({ name: "brother-printer", version: "1.0.0" });

server.tool(
  "print_file",
  { filePath: z.string(), printer: z.string().default("Brother DCP-T520W Printer"), copies: z.number().default(1) },
  async ({ filePath, printer, copies }) => {
    const isPdf = filePath.toLowerCase().endsWith(".pdf");
    const cmd = isPdf
      ? `SumatraPDF.exe -print-to "${printer}" -print-settings "${copies}x" -silent "${filePath}"`
      : `powershell -Command "Get-Content '${filePath}' | Out-Printer -Name '${printer}'"`;
    return new Promise((resolve) => {
      exec(cmd, (err, stdout, stderr) => {
        resolve({ content: [{ type: "text", text: err ? `Failed: ${stderr}` : `Sent to ${printer}` }] });
      });
    });
  }
);

server.connect(new StdioServerTransport());
