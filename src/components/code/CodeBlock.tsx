import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/libs/cn";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export const CodeBlock = ({ code, language = "javascript", className }: CodeBlockProps) => (
  <div className={cn("overflow-hidden rounded-md border border-slate-800 text-sm", className)}>
    <SyntaxHighlighter
      language={language}
      style={oneDark}
      customStyle={{ margin: 0, padding: "12px 14px", background: "#0f172a" }}
      wrapLongLines
    >
      {code}
    </SyntaxHighlighter>
  </div>
);
