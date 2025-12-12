import { useMemo, useEffect, useState } from "react";
// import { useQuery } from '@tanstack/react-query';
import { LoadingModal } from "../components/LoadingComponents";
import { MessageComponents } from "../components/MessageComponents";
import { callFunction } from "../utils/callFunction";
// import { div, img } from "framer-motion/client";
import { images } from "../assets/image";


export function Raffle() {
  const userId = useMemo(() => localStorage.getItem("lineUserId"), []);
  const [isLoading, setIsLoading] = useState(false);
  const [noticeMsg, setNoticeMsg] = useState("");
  const [noticeModal, setNoticeModal] = useState(false);
  const [hasTicket, setHasTicket] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const getTicket = async () => {
    try {
      setIsLoading(true);
      const res = await callFunction("get-ticket", { userId });
      if (!res?.success) {
        throw new Error(res?.msg || '取得抽獎紀錄失敗');
      }
      setCouponCode(res?.data?.couponId || "");
      console.log('get-ticket res:', res);
      console.log('領取抽獎券成功');
      localStorage.setItem("accountInfo", JSON.stringify(res.data));
      setNoticeMsg(res?.msg);
      setHasTicket(true);
    } catch (error) {
      console.error('領取抽獎券失敗:', error);
      return;
    } finally {
      setIsLoading(false);
      setNoticeModal(true);
    }
    
  }
  useEffect(() => {
    const raw = localStorage.getItem("accountInfo");
    if (raw) {
      try {
        const accountInfo = JSON.parse(raw);
        setCouponCode(accountInfo?.couponId || "");
        if (accountInfo?.couponId) {
          setHasTicket(true);
        }
      } catch (err) {
        console.error("讀取 localStorage accountInfo 錯誤", err);
      }
    }
  }, []);

  return (
    <>
    <MessageComponents
        show={noticeModal}
        text={noticeMsg}
        onClose={() => setNoticeModal(false)} // 👈 關閉才 refetch
      />
    <LoadingModal show={isLoading} />
    <div className="h-full flex flex-col items-center justify-center bg-[#fbe5df]">
      { hasTicket ? (
        <div className="text-lg text-center">
          <p className="mb-2">🎉 恭喜完成登記！</p>
          <p>以下是您的抽獎券編號</p>
          <p className="text-xl font-bold">No.{couponCode}</p>
          <img src={images.raffle} className="w-full max-w-[420px] mx-auto" alt="" />
          <p className="mb-2">請妥善保存，稍後抽獎將以此號碼為準 🎊  </p> 
          <p className="mb-2">💌 再次謝謝你與我們一同見證幸福</p> 
          <p>願好運與祝福，也降臨到你身邊 🍀</p>
        </div>
      ) : (
        <div className="text-lg text-center">
          <p className="mb-2">感謝您來到現場</p>
          <p className="mb-2">與我們一起見證愛與幸福</p>
          <img src={images.ring2} className="w-1/2 mx-auto" alt="" />
          <p className="mb-2">今天的喜悅</p>
          <p className="mb-2">也想化作小小驚喜分享給你</p>
          <p className="mb-5">請領取屬於你的專屬抽獎券</p>
          <button className="tracking-widest mb-4 px-4 py-2 bg-[#c99a8d] text-white rounded hover:bg-[#b58476] transition" onClick={() => getTicket()}>🎁 點我領取抽獎券 🎁</button>
          <p>每人限領一次，領取即完成登記</p>
        </div>
      )}
    </div>
    </>
  );
}
