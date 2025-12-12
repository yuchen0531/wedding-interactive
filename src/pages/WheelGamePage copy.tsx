import { useState, useRef, useEffect } from "react";
import { images } from "../assets/image";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingModal } from "../components/LoadingComponents";
import { MessageComponents } from "../components/MessageComponents";
import { callFunction } from "../utils/callFunction";
// import { Message } from "./MessagePage";
// import { div } from "framer-motion/client";

const USER_ID = localStorage.getItem("lineUserId");

export function WheelGamePage() {
  const quizData = [
    {
      question: "我們最喜歡一起做什麼活動？",
      options: ["旅遊", "打電動", "煮飯", "睡覺"],
      answer: 0,
    },
    {
      question: "我們第一次約會吃什麼？",
      options: ["牛排", "火鍋", "壽司", "炸雞"],
      answer: 1,
    },
    {
      question: "我們最常一起看的電影類型？",
      options: ["愛情片", "動作片", "喜劇片", "恐怖片"],
      answer: 2,
    },
  ];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] =useState(false)
  const [noticeModal, setNoticeModal] = useState(false)
  const [alreadyExchange, setAlreadyExchange] = useState(false)
  const [noticeMsg, setNoticeMsg] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [alreadyDone, setalreadyDone] = useState(false);
  const [question, setQuestion] = useState(false)
  const [isQuizStart, setQuizStart] = useState(false)
  const [quizFail, setQuizFail] = useState(true)
  const wheelRef = useRef<HTMLImageElement>(null);
  const getRecord = async () => {
    setIsLoading(true)
    const result = await callFunction("search-draw-record", { userId: USER_ID });
    setalreadyDone(result.alreadyDone);
    console.log(result)
    if (result.alreadyDone) {
      console.log('28', result)
      setIsWin(result.data.isWinner);
      setAlreadyExchange(result.already_exchange);
      setMessage(result.data.isWinner?'您中獎了':'下次再努力')
      setQuestion(true)
    }
    setIsLoading(false);
    console.log(result);
  };
  const gameFinish = async () => {
    setQuizFail(true)
  }
  const handleStartWheel = async () => {
    if (isPlaying) return; // 防止重複點擊
    setIsPlaying(true);
    const result = await callFunction("draw-lottery", { userId: USER_ID });
    console.log('40', result);
    console.log('41', result.data.debug); 
    if (result.success) {
      console.log('43', result)
      setIsWin(result.data.isWinner);
      setMessage(result.msg);
      const wheel = wheelRef.current;
      if (!wheel) return;
      const round = 4;
      const prizeIndex = result.data?.prizeIndex ?? 0;
      console.log('prizeIndex', prizeIndex)
      const randomDegree = Math.floor(Math.random() * (80 - 10 + 1)) + 10; // 5 ~ 85
      const rotateDegree = 360 * round + (prizeIndex * 90) + randomDegree;
      console.log('rotateDegree', rotateDegree)
      wheel.style.transition = "transform 5s cubic-bezier(0.33, 1, 0.68, 1)";
      wheel.style.transform = `rotate(${rotateDegree}deg)`;
    }else{
      setNoticeMsg(result.msg)
      setNoticeModal(true)
    }

    

    // ⏱ 延遲設定 state，確保畫面轉完才顯示結果與按鈕變化
    setTimeout(() => {
      setalreadyDone(true);     // ✅ 現在才算完成抽獎
      setIsPlaying(false);
      setShowModal(true);       // 顯示結果 modal
    }, 5000);
  }
  const exchange = async () => {
    const result = await callFunction("exchange-gift", { userId: USER_ID });
    console.log('58', result);
    if(result.success){
      await getRecord(); // 重新撈一次完整抽獎紀錄資料
    }
    setNoticeMsg(result.msg)
    setNoticeModal(true)
    setShowExchangeModal(false)
  }
  useEffect(() => {
      (async () => {
          await getRecord();
      })();
  }, []);

  return (
    <>
    <LoadingModal show={isLoading}/>
    <MessageComponents show={noticeModal} text={noticeMsg} onClose={() => setNoticeModal(false)} />
    { quizFail ? (
      <>
        <div className="bg-[#cfcea259] flex flex-col items-center justify-start">
          <p></p>
        </div>
      </>
    ) : (
      <>
      { question ?
      (
        <div className="overflow-x-hidden bg-[#fbe5df] flex flex-col items-center justify-center">
          <div className="w-[320px] relative flex justify-center items-center">
            <img src={images.wheel} ref={wheelRef} className="w-full" alt="" />
            <img src={images.placeholder} className="w-[60px] absolute rotate-[180deg]" alt="" />
          </div>
            {alreadyDone ? (
              <button disabled={isPlaying} onClick={() => { setShowModal(true) }} className="px-4 py-2 bg-[#c99a8d] text-white rounded hover:bg-[#b58476] transition mt-5">查看結果</button>
            ) : (
              <button disabled={isPlaying} onClick={handleStartWheel} className="px-4 py-2 bg-[#c99a8d] text-white rounded hover:bg-[#b58476] transition mt-5">開始抽獎</button>
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
                    { alreadyExchange ? (
                      <p className="text-xl font-bold text-[#c99a8d] mb-4">您已兌換過了</p>
                    ): (
                      <>
                      { isWin ? (
                        <>
                          <h2 className="text-2xl font-bold text-[#c99a8d] mb-4">🎊 恭喜 🎊 </h2>
                          <p className="text-xl font-bold text-[#c99a8d] mb-4">{message}</p>
                        </>
                      ):(
                        <>
                          <h2 className="text-2xl font-bold text-[#c99a8d] mb-4">🎊 恭喜 🎊 </h2>
                          <p className="text-xl font-bold text-[#c99a8d] mb-4">{message}</p>
                        </>
                      )}
                      </>
                    )
                    }
                  <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 bg-[#929292] text-white rounded hover:bg-[#4b4b4b] transition"
                  >
                      關閉
                  </button>
                  { (isWin && !alreadyExchange) && (<button
                      onClick={() => {setShowModal(false);setShowExchangeModal(true)}}
                      className="ml-3 px-4 py-2 bg-[#c99a8d] text-white rounded hover:bg-[#b58476] transition"
                  >
                      兌換
                  </button>)}
                  </motion.div>
              </motion.div>
              )}
          </AnimatePresence>
          <AnimatePresence>
              {showExchangeModal && (
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
                  <h2 className="text-xl font-bold text-[#c99a8d] mb-3">🎊 恭喜！獲得小禮物 🎊 </h2>
                  <p className="text-[#e16161] text-xl font-bold">請交給人員核銷</p>
                  <p className="text-[#e16161] text-xl font-bold mb-6">*請勿自行兌換*</p>
                  
                  <button
                      onClick={() => setShowExchangeModal(false)}
                      className="px-4 py-2 bg-[#929292] text-white rounded hover:bg-[#4b4b4b] transition"
                  >
                      取消兌換
                  </button>
                  { isWin && (<button
                      onClick={() => {exchange()}}
                      className="ml-3 px-4 py-2 bg-[#c99a8d] text-white rounded hover:bg-[#b58476] transition"
                  >
                      確認核銷
                  </button>)}
                  </motion.div>
              </motion.div>
              )}
          </AnimatePresence>
      </div>
      ) : ( 
        <div className="bg-[#cfcea259] flex flex-col items-center justify-start">
          { isQuizStart ? (
            <>
            <div className="mx-auto my-16 text-[#515151] flex flex-col items-center justify-center">
              <p className="text-xl mb-5 font-bold">{currentQuestion + 1} / {quizData.length}</p>
              <p className="text-2xl">{quizData[currentQuestion].question}</p>
            </div>
            <div className="w-[85%] mx-auto text-[#515151] answer-card px-3 pt-6 pb-3 rounded-2xl bg-[#c1c1ff]">
              {quizData[currentQuestion].options.map((option,index) => 
                <div key={index} className="answer-option bg-white rounded-3xl mb-5 p-3 text-lg text-center" onClick={() => {
                  if(index === quizData[currentQuestion].answer) {
                    if(currentQuestion < quizData.length - 1 ){
                      setCurrentQuestion(currentQuestion + 1)
                    } else {
                      setQuestion(true)
                    }
                  } else {
                    gameFinish()
                  }
                }}>
                  <p>{ option }</p>
              </div>
              )}
              
              {/* <div className="answer-option bg-white rounded-3xl mb-5 p-3 text-lg text-center">
                <p>sfgsefesfew</p>
              </div>
              <div className="answer-option bg-white rounded-3xl mb-5 p-3 text-lg text-center">
                <p>sfgsefesfew</p>
              </div>
              <div className="answer-option bg-white rounded-3xl mb-5 p-3 text-lg text-center">
                <p>sfgsefesfew</p>
              </div> */}
            </div>
            </>
          ):(
            <div className="bg-[#cfcea259] text-center text-lg w-full relative overflow-x-hidden">
              {/* <div className="game-bg absolute top-8"></div> */}
              <img src={images.leaf5} className="w-[120px] absolute top-[75%] rotate-[62deg] -left-5" alt="" />
              <img src={images.leaf5} className="w-[120px] absolute top-16 -scale-x-100 rotate-[-75deg] -right-2" alt="" />
              <div className="flex items-center justify-center relative">
                {/* <img src={images.vintage} className="w-[180px] absolute -top-7" alt="" /> */}
                <button className="game-title my-16 text-2xl mx-auto text-[#d19c8c] bg-white rounded-xl shadow-xl py-3 px-10 font-bold ">友情小測驗</button>
              </div>
              <p className="">我們精心準備了小禮物等你們來領取唷!!</p>
              <p>一起來測看看你是否了解我們</p>
              <p>測驗成功即可玩轉盤參加抽獎!!</p>
              <div className="max-w-[500px] font-bold text-[#534131] my-10 game-content mx-auto bg-[#fff395] p-3 w-[85%] relative rounded-xl flex-col flex justify-center items-center shadow-xl">
                <p className="">遊戲說明</p>
                <p>三題皆答對即可玩轉盤參加抽獎~</p>
                <div className="mt-5 flex items-center justify-center">
                  <p className="">注意: 請確認好再按下答案!!</p>
                </div>
              </div>
              <button className="game-btn mx-auto text-[#847363] bg-white rounded-full shadow-xl py-3 px-10 text-xl font-bold " onClick={() => setQuizStart(true)}>開始挑戰</button>
            </div>
          )
          }
        </div>
      )
      }
      </>
    )}
    </>
  );
}