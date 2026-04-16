import { describe, expect, it } from "vitest";
import { parsePrompt } from "@/modules/attempt/utils/parsePrompt";

describe("parsePrompt", () => {
  it("returns plain text when there is no fenced block", () => {
    expect(parsePrompt("Hello world")).toEqual({ text: "Hello world", code: null });
  });

  it("extracts a trailing fenced code block", () => {
    const input = "What does this do?\n\n```\nconsole.log(x)\n```";
    expect(parsePrompt(input)).toEqual({ text: "What does this do?", code: "console.log(x)" });
  });

  it("accepts a language tag on the fence", () => {
    const input = "Code:\n\n```js\nconst x = 1\n```";
    expect(parsePrompt(input)).toEqual({ text: "Code:", code: "const x = 1" });
  });

  it("ignores inline backticks mid-prompt", () => {
    const input = "Use `inline` here";
    expect(parsePrompt(input)).toEqual({ text: input, code: null });
  });

  it("trims whitespace between text and fence", () => {
    const input = "Prompt    \n\n```\nbody\n```";
    expect(parsePrompt(input).text).toBe("Prompt");
  });
});
