# Pessoa — Claude Code Instructions

## Project Context

Pessoa is an open source AI document IDE built on Next.js 14, TypeScript
strict, Tailwind, Shadcn/ui, Framer Motion, Tiptap, Anthropic SDK with
streaming, Supabase with pgvector, and Vercel. Full product specification
is in pessoa_product_specification_v1_1.md.

## Build Phase Infrastructure

A local MCP server at /mcp/build-sync/ exposes one tool: append_build_entry.
This tool appends a structured entry to build_log.md in the repo root.
Four specialist agents in the Claude project read this file to stay current
with build progress.

## Post-Session Instruction

At the end of every session, before closing, call append_build_entry with
a structured summary of the session using this exact format:

- sprint: the current sprint number and name
- completed: list of features or tasks completed this session
- files_changed: list of key files created or modified
- architecture_decisions: any architecture decisions made and their rationale
- open_questions: any questions requiring a product or architecture decision
- blockers: any active blockers preventing progress
- next_planned: what is scoped for the next session

Do not skip this step. It is the mechanism that keeps the four build phase
agents in sync with current progress.
