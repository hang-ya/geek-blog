import { marked } from "marked";

/** Render markdown string to HTML */
export function renderMarkdown(content: string): string {
  return marked.parse(content, { async: false }) as string;
}
