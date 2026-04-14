import { LuShieldAlert } from "react-icons/lu";
import { Card, CardBody } from "@/components/ui/Card";

interface Props {
  tabSwitches: number;
  pastes: number;
}

export const AntiCheatSummary = ({ tabSwitches, pastes }: Props) => {
  const clean = tabSwitches === 0 && pastes === 0;
  return (
    <Card className={clean ? "border-slate-200" : "border-amber-300 bg-amber-50"}>
      <CardBody className="flex items-center gap-3">
        <LuShieldAlert className={clean ? "text-slate-400" : "text-amber-600"} size={22} />
        <div className="text-sm">
          <p className="font-medium text-slate-800">Anti-cheat summary</p>
          <p className="text-slate-600">
            {clean
              ? "No tab switches or pastes detected during this attempt."
              : `${tabSwitches} tab switch${tabSwitches === 1 ? "" : "es"}, ${pastes} paste${
                  pastes === 1 ? "" : "s"
                } detected.`}
          </p>
        </div>
      </CardBody>
    </Card>
  );
};
