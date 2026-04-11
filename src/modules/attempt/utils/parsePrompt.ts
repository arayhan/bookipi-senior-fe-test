interface ParsedPrompt {
  text: string;
  code: string | null;
}

const FENCE_PATTERN = /\n*```[a-z]*\n([\s\S]*?)\n```\s*$/i;

export const parsePrompt = (prompt: string): ParsedPrompt => {
  const match = prompt.match(FENCE_PATTERN);
  if (!match) return { text: prompt, code: null };
  const text = prompt.slice(0, match.index).trim();
  return { text, code: match[1] };
};
