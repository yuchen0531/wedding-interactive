import { useEffect, useRef, useState } from "react";
import { images } from "../assets/image";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingModal } from "../components/LoadingComponents";
import { MessageComponents } from "../components/MessageComponents";
import { callFunction } from "../utils/callFunction";

type WheelProps = {
  mode: "wheel" | "wheel_success" | "wheel_fail";
  userId: string;
  onRefresh: () => void | Promise<void>;
  profile: {
		alreadyExchange?: boolean;
		prizeIndex?: number;
	};
};
export function WheelComponents({
  mode,
  userId,
  onRefresh,
  profile,
}: WheelProps) {
  const [showModal, setShowModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [noticeModal, setNoticeModal] = useState(false);
  const [noticeMsg, setNoticeMsg] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [alreadyDone, setAlreadyDone] = useState(false);
	const winnerMsgs = ["🎉 中獎啦！🎉"];
	const loserMsgs  = ["🎉 差點就中了獎！😅","💫 雖然沒有中獎，但獲得祝福一枚～","😇 我們下次再一起努力！"];
	const pickMsg = (win: boolean, prizeIndex: number) => {
		const arr = win ? winnerMsgs : loserMsgs;
		return win ? arr[prizeIndex] : arr[prizeIndex - 1 ];
	};
  const wheelRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
		console.log('41profile:', profile);
    if (mode === "wheel") {
      setAlreadyDone(false);
      setIsWin(false);
      setMessage("");
    } else {
      setAlreadyDone(true);
      const win = mode === "wheel_success";
      setIsWin(win);
      console.log('win:', win);
      console.log('profile.prizeIndex:', profile.prizeIndex);
			setMessage(pickMsg(win, profile.prizeIndex ?? 0));
      console.log('message:', message);
    }
  }, [mode]);

  const handleStartWheel = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    try {
      const result = await callFunction("draw-lottery", { userId });
      if (!result?.success) {
        setNoticeMsg(result?.msg || "抽獎失敗");
        setNoticeModal(true);
        setIsPlaying(false);
        return;
      }

      const win = !!result.data?.isWinner;
      setIsWin(win);
      setMessage(result.msg || (win ? "中獎啦！" : "未中獎"));

      const wheel = wheelRef.current;
      const rounds = 4;
      const prizeIndex = Number(result.data?.prizeIndex ?? 0);
      const randomDegree = Math.floor(Math.random() * (80 - 10 + 1)) + 10;
      const targetDeg = 360 * rounds + prizeIndex * 90 + randomDegree;

      if (wheel) {
        wheel.style.transition = "transform 5s cubic-bezier(0.33, 1, 0.68, 1)";
        wheel.style.transform = `rotate(${targetDeg}deg)`;
      }

      setTimeout(async () => {
        setAlreadyDone(true);
        setShowModal(true);
        setIsPlaying(false);
      }, 5000);
    } catch (e) {
      console.error("draw-lottery error:", e);
      setNoticeMsg("抽獎發生錯誤，請稍後再試");
      setNoticeModal(true);
      setIsPlaying(false);
    }
  };
	const handleResultClose = async () => {
		setNoticeModal(false);
		await onRefresh();
	};
  const exchange = async () => {
    setIsLoading(true);
    try {
      const result = await callFunction("exchange-gift", { userId });
      const ok = !!result?.success;
      setNoticeMsg(result?.msg || (ok ? "兌換成功" : "兌換失敗"));
      setNoticeModal(true);
      setShowExchangeModal(false);

      await onRefresh(); // 父層同步最新的 alreadyExchanged
    } catch (e) {
      console.error("exchange error:", e);
      setNoticeMsg("核銷失敗，請稍後再試");
      setNoticeModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingModal show={isLoading} />
      <MessageComponents show={noticeModal} text={noticeMsg} closeText="關閉" confirmText="" onConfirm={() => {}} onClose={() => handleResultClose()} />

      <div className="h-full overflow-x-hidden bg-[#fbe5df] flex flex-col items-center justify-center">
        <div className="w-[320px] relative flex justify-center items-center">
          <img src={images.wheel} ref={wheelRef} className="w-full" alt="" />
          <img src={images.placeholder} className="w-[60px] absolute rotate-[180deg]" alt="" />
        </div>

        {alreadyDone ? (
          <button
            disabled={isPlaying}
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-[#c99a8d] text-white rounded hover:bg-[#b58476] transition mt-5"
          >
            查看結果
          </button>
        ) : (
          <button
            disabled={isPlaying}
            onClick={handleStartWheel}
            className="px-4 py-2 bg-[#c99a8d] text-white rounded hover:bg-[#b58476] transition mt-5"
          >
            開始抽獎
          </button>
        )}

        <AnimatePresence>
          {showModal && (
            <motion.div
              key="modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg p-6 max-w-sm w-[85%] shadow-lg text-center"
              >
                {profile.alreadyExchange ? (
                  <p className="text-xl font-bold text-[#c99a8d] mb-4">您已兌換過了</p>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-[#c99a8d] mb-4"> 恭喜 </h2>
                    <p className="text-xl font-bold text-[#c99a8d] mb-4">{message}</p>
                  </>
                )}

                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-[#929292] text-white rounded hover:bg-[#4b4b4b] transition"
                >
                  關閉
                </button>

                {isWin && !profile.alreadyExchange && (
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setShowExchangeModal(true);
                    }}
                    className="ml-3 px-4 py-2 bg-[#c99a8d] text-white rounded hover:bg-[#b58476] transition"
                  >
                    兌換
                  </button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showExchangeModal && (
            <motion.div
              key="ex-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg p-6 max-w-sm w-[85%] shadow-lg text-center"
              >
                <h2 className="text-xl font-bold text-[#c99a8d] mb-3">🎊 恭喜！獲得小禮物 🎊</h2>
                <p className="text-[#e16161] text-xl font-bold">請交給人員核銷</p>
                <p className="text-[#e16161] text-xl font-bold mb-6">*請勿自行兌換*</p>

                <button
                  onClick={() => setShowExchangeModal(false)}
                  className="px-4 py-2 bg-[#929292] text-white rounded hover:bg-[#4b4b4b] transition"
                >
                  取消兌換
                </button>

                {isWin && (
                  <button
                    onClick={() => { void exchange(); }}
                    className="ml-3 px-4 py-2 bg-[#c99a8d] text-white rounded hover:bg-[#b58476] transition"
                  >
                    確認核銷
                  </button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
