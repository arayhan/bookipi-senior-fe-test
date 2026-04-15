import { useCallback, useEffect } from "react";
import { useAppDispatch } from "@/app/hooks";
import { attemptActions } from "@/modules/attempt/attempt.slice";
import { usePostEventMutation } from "@/modules/attempt/attempt.query";

export const useAntiCheat = (attemptId: number | null) => {
  const dispatch = useAppDispatch();
  const { mutate: postEvent } = usePostEventMutation();

  useEffect(() => {
    if (!attemptId) return;
    console.log("[anti-cheat] attached for attempt", attemptId);

    const handleBlur = () => {
      dispatch(attemptActions.recordEvent("tab_blur"));
      postEvent({ attemptId, event: "tab_blur" });
    };
    const handleFocus = () => {
      postEvent({ attemptId, event: "tab_focus" });
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [attemptId, dispatch, postEvent]);

  const reportPaste = useCallback(() => {
    dispatch(attemptActions.recordEvent("paste"));
    if (attemptId) postEvent({ attemptId, event: "paste" });
  }, [attemptId, dispatch, postEvent]);

  return { reportPaste };
};
