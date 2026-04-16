import { useQuery } from "@tanstack/react-query";
import { quizService } from "@/modules/quiz/quiz.service";
import { quizKeys } from "@/modules/quiz/quiz.keys";

export const useGetQuizQuery = (quizId: number | string | undefined) =>
  useQuery({
    queryKey: quizId ? quizKeys.detail(quizId) : quizKeys.detail("none"),
    queryFn: () => quizService.get({ id: quizId as number | string }),
    enabled: Boolean(quizId),
  });

export const useGetQuizListQuery = () =>
  useQuery({
    queryKey: quizKeys.list(),
    queryFn: () => quizService.list(),
  });
