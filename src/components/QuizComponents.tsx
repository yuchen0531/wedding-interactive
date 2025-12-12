import { useState, useEffect } from "react";
import { images } from "../assets/image";
import { MessageComponents } from "../components/MessageComponents";
import { callFunction } from "../utils/callFunction";

type QuizProps = {
  quizStatus: 'quiz' | 'quiz_fail';
  userId: string;
  onRefresh: () => void | Promise<void>;
};

export function QuizComponents({ quizStatus, userId, onRefresh }: QuizProps) {
  const quizData = [
    { question: "我們最喜歡一起做什麼活動？", options: ["旅遊", "打電動", "煮飯", "睡覺"], answer: 0 },
    { question: "我們第一次約會吃什麼？", options: ["牛排", "火鍋", "壽司", "炸雞"], answer: 1 },
    { question: "我們最常一起看的電影類型？", options: ["愛情片", "動作片", "喜劇片", "恐怖片"], answer: 2 },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isQuizStart, setQuizStart] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [noticeMsg, setNoticeMsg] = useState("");
  const [noticeModal, setNoticeModal] = useState(false);

  // ✅ 關鍵：記住「後端已寫入的下一個狀態」，關閉 Modal 再觸發 refetch
  const [serverNextState, setServerNextState] = useState<null | 'wheel' | 'quiz_fail'>(null);

  // 父層 quizStatus 變成 'quiz_fail' 後，就不再等待
  useEffect(() => {
    if (quizStatus === 'quiz_fail') {
      // 可依需求在這裡做其他本地同步
    }
  }, [quizStatus]);

  const finishQuiz = async (index: number) => {
    if (submitting) return;
    setSubmitting(true);

    const correct = index === quizData[currentQuestion].answer;
    const nextState: 'wheel' | 'quiz_fail' = correct ? 'wheel' : 'quiz_fail';

    // 顯示提示 Modal（先不 refetch）
    setNoticeMsg(correct ? '恭喜全部答對!!' : '謝謝您的參與，答錯了');
    setNoticeModal(true);

    try {
      await callFunction("update-game-state", { userId, gameState: nextState });
      // 記住後端寫入的狀態，等 Modal 關閉再觸發父層 onRefresh()
      setServerNextState(nextState);

      // 若失敗，先切回首頁卡片（但仍等待使用者關閉 Modal 才 refetch）
      if (!correct) {
        setQuizStart(false);
      }
    } catch (e) {
      console.error('更新 game_state 失敗：', e);
      // 發生錯誤時，不要切畫面；也不要記 serverNextState
      setServerNextState(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOptionClick = (index: number) => {
    if (submitting) return;
    if (selectedIndex !== null) return;

    const correct = index === quizData[currentQuestion].answer;
    const isLast = currentQuestion >= quizData.length - 1;

    setSelectedIndex(index);
    setIsCorrect(correct);

    setTimeout(() => {
      if (correct && !isLast) {
        setCurrentQuestion(q => q + 1);
        setSelectedIndex(null);
        setIsCorrect(null);
      } else {
        void finishQuiz(index);
        setSelectedIndex(null);
        setIsCorrect(null);
      }
    }, 800);
  };

  // ✅ 關閉提示 Modal 時才觸發父層 refetch → 這時才會切到下一畫面
  const handleNoticeClose = async () => {
    setNoticeModal(false);

    if (serverNextState) {
      // 若是成功（wheel）→ 父層 refetch 後直接切到轉盤畫面
      // 若是失敗（quiz_fail）→ 父層也會同步顯示失敗狀態
      await onRefresh?.();
      setServerNextState(null);
    }
  };

  // 只有在非作答狀態時，依 quizStatus 決定是顯示「失敗文字」或「開始挑戰」
  const showFail = quizStatus === 'quiz_fail';

  return (
    <>
      <MessageComponents
        show={noticeModal}
        text={noticeMsg}
        onClose={handleNoticeClose}
				confirmText=""
				closeText="關閉"
				onConfirm={() => {}}
      />

      <div className="h-full bg-[#efeeb359] flex flex-col items-center justify-center">
        {isQuizStart ? (
          <>
            <div className="mx-auto my-16 text-[#515151] flex flex-col items-center justify-center">
              <p className="text-xl mb-5 font-bold">{currentQuestion + 1} / {quizData.length}</p>
              <p className="text-2xl">{quizData[currentQuestion].question}</p>
            </div>

            <div className="w-[85%] mx-auto text-[#515151] answer-card px-3 pt-6 pb-3 rounded-2xl bg-[#c1c1ff]">
              {quizData[currentQuestion].options.map((option, index) => (
                <div
                  key={index}
                  className={`answer-option rounded-3xl mb-5 p-3 text-lg text-center cursor-pointer
                    ${selectedIndex === index
                      ? isCorrect ? "bg-[#87c583] text-white" : "bg-[#ff7777] text-white"
                      : "bg-white"}`}
                  onClick={() => handleOptionClick(index)}
                >
                  <p>{option}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="h-full bg-[#efeeb359] text-center text-lg w-full relative overflow-x-hidden">
            <img src={images.leaf5} className="w-[120px] absolute top-[75%] rotate-[62deg] -left-5" alt="" />
            <img src={images.leaf5} className="w-[120px] absolute top-16 -scale-x-100 rotate-[-75deg] -right-2" alt="" />

            <div className="flex items-center justify-center relative">
              <button className="game-title my-16 text-2xl mx-auto text-[#d19c8c] bg-white rounded-xl shadow-xl py-3 px-10 font-bold ">
                友情小測驗
              </button>
            </div>

            <p>我們精心準備了小禮物等你們來領取唷!!</p>
            <p>一起來測看看你是否了解我們</p>
            <p>測驗成功即可玩轉盤參加抽獎!!</p>

            <div className="max-w-[500px] font-bold text-[#534131] my-10 game-content mx-auto bg-[#fff395] p-3 w-[85%] relative rounded-xl flex-col flex justify-center items-center shadow-xl">
              <p>遊戲說明</p>
              <p>每人限玩一次</p>
							<p>三題皆答對即可玩轉盤參加抽獎~</p>
              <div className="mt-5 flex items-center justify-center">
                <p>注意: 請確認好再按下答案!!</p>
              </div>
            </div>

            {showFail ? (
              <p className="mx-auto text-[#e16161] text-xl font-bold">測驗失敗，謝謝您的參與</p>
            ) : (
              <button
                className="game-btn mx-auto text-[#847363] bg-white rounded-full shadow-xl py-3 px-10 text-xl font-bold disabled:opacity-50"
                onClick={() => {
                  setCurrentQuestion(0);
                  setSelectedIndex(null);
                  setIsCorrect(null);
                  setQuizStart(true);
                }}
                disabled={submitting}
              >
                開始挑戰
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
