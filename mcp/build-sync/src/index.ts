import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as dotenv from "dotenv";
import * as path from "path";
import { appendBuildEntry } from "./tools/append-build-entry";

dotenv.config({ path: path.join(__dirname, "../.env") });

const server = new McpServer({
  name: "pessoa-build-sync",
  version: "1.0.0",
});

server.tool(
  "append_build_entry",
  "Appends a structured session summary entry to build_log.md in the Pessoa repo root",
  {
    sprint: z.string().describe("Current sprint number and name"),
    completed: z
      .array(z.string())
      .describe("List of features or tasks completed this session"),
    files_changed: z
      .array(z.string())
      .describe("List of key files created or modified"),
    architecture_decisions: z
      .array(z.string())
      .describe("Architecture decisions made and their rationale"),
    open_questions: z
      .array(z.string())
      .describe("Questions requiring a product or architecture decision"),
    blockers: z
      .array(z.string())
      .describe("Active blockers preventing progress"),
    next_planned: z
      .array(z.string())
      .describe("What is scoped for the next session"),
  },
  async (input) => {
    try {
      const result = appendBuildEntry(input);
      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error appending build entry: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Pessoa build sync MCP server running");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});