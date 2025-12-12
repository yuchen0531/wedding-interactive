import { useMemo, useEffect, useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { LoadingModal } from "../components/LoadingComponents";
import { MessageComponents } from "../components/MessageComponents";
import { callFunction } from "../utils/callFunction";
import { QuizComponents } from '../components/QuizComponents';
import { WheelComponents } from '../components/WheelComponents';

export function WheelGamePage() {
  const userId = useMemo(() => localStorage.getItem("lineUserId"), []);
  const [localState, setLocalState] = useState<string | null>(null);
  const [localData, setLocalData] = useState<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem("accountInfo");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setLocalData(parsed);
        setLocalState(parsed?.game_state || null);
      } catch (e) {
        console.error("讀取 localStorage.accountInfo 錯誤", e);
      }
    }
  }, []);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['draw-record', userId],
    queryFn: async () => {
      const res = await callFunction("search-draw-record", { userId });
      if (!res?.success) {
        throw new Error(res?.msg || '取得抽獎紀錄失敗');
      }
      return res;
    },
    enabled: !localState && !!userId, // ✅ 若 localStorage 有值就不要打 API
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // 取 local 優先，否則用 API
  const currentState = localState || data?.profile?.game_state;
  const currentProfile = localData || data?.profile;
  console.log('currentProfile:', currentProfile);

  if (!userId) {
    return <MessageComponents show text="尚未取得使用者資訊" onClose={() => {}} />;
  }

  return (
    <>
      <LoadingModal show={isLoading} />
      {error && (
        <MessageComponents
          show
          text={(error as Error).message}
          onClose={() => {}}
        />
      )}

      {(currentState === 'quiz' || currentState === 'quiz_fail') && (
        <QuizComponents
          quizStatus={currentState}
          userId={userId}
          onRefresh={() => void refetch()}
        />
      )}

      {(currentState === 'wheel' || currentState === 'wheel_fail' || currentState === 'wheel_success') && (
        <WheelComponents
          mode={currentState}
          userId={userId}
          profile={currentProfile}
          onRefresh={() => void refetch()}
        />
      )}
    </>
  );
}
