import * as fs from "fs";
import * as path from "path";

export interface BuildEntry {
  sprint: string;
  completed: string[];
  files_changed: string[];
  architecture_decisions: string[];
  open_questions: string[];
  blockers: string[];
  next_planned: string[];
}

export function appendBuildEntry(entry: BuildEntry): string {
  const repoRoot = process.env.REPO_ROOT;

  if (!repoRoot) {
    throw new Error("REPO_ROOT environment variable is not set");
  }

  const buildLogPath = path.join(repoRoot, "build_log.md");

  if (!fs.existsSync(buildLogPath)) {
    throw new Error(`build_log.md not found at ${buildLogPath}`);
  }

  const date = new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formatList = (items: string[]): string =>
    items.length > 0
      ? items.map((item) => `- ${item}`).join("\n")
      : "- None";

  const entry_text = `
## ${entry.sprint} — ${date}

### Completed
${formatList(entry.completed)}

### Files changed
${formatList(entry.files_changed)}

### Architecture decisions made
${formatList(entry.architecture_decisions)}

### Open questions
${formatList(entry.open_questions)}

### Blockers
${formatList(entry.blockers)}

### Next planned
${formatList(entry.next_planned)}
`;

  fs.appendFileSync(buildLogPath, entry_text, "utf8");

  return `Build entry appended successfully to ${buildLogPath}`;
}