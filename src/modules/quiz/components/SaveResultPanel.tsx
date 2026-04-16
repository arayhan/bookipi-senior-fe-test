import { useState } from "react";
import { Link } from "react-router-dom";
import { LuCheck, LuCopy } from "react-icons/lu";
import { Card, CardBody } from "@/components/card/Card";
import { Button } from "@/components/button/Button";

interface Props {
  quizId: number;
}

export const SaveResultPanel = ({ quizId }: Props) => {
  const [copied, setCopied] = useState(false);

  const copyId = async () => {
    await navigator.clipboard.writeText(String(quizId));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Card className="border-emerald-200 bg-emerald-50">
      <CardBody className="flex flex-col gap-3">
        <p className="text-sm font-medium text-emerald-800">
          Quiz published. Share the ID below to let someone take it.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <code className="rounded bg-white px-3 py-2 font-mono text-base text-slate-900 border border-emerald-200">
            {quizId}
          </code>
          <Button variant="secondary" size="sm" onClick={copyId}>
            {copied ? <LuCheck /> : <LuCopy />}
            {copied ? "Copied" : "Copy ID"}
          </Button>
          <Link to={`/play/${quizId}`}>
            <Button size="sm">Take it now</Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  );
};
