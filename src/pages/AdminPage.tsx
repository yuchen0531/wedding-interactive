import { callFunction } from "../utils/callFunction";
import React, {  useState } from "react";
import { images } from "../assets/image";
import { MessageComponents } from "../components/MessageComponents";

type DrawItem = {
  couponId: string;
  userId: string;
  userName: string;
};
export function Admin() {
  const [isLoading, setIsLoading] = useState(false);
  const [drawData, setDrawData] = useState<DrawItem[]>([]);
  const [quantity, setQuantity] = useState(10);
  const [winRecord, setWinRecord] = useState<any[] | null>(null);
  const [noticeModal, setNoticeModal] = useState(false);
  const [msg, setMsg] = useState("");
  const getDrawData = async () => {
    try {
      const res = await callFunction("draw", {});
      if (!res?.success) {
        throw new Error(res?.error || "取得抽獎資料失敗");
      }
      console.log("抽獎資料：", res.data);
      setDrawData(res.data);
    } catch (error) {
      console.error("取得抽獎資料失敗：", error);
    }
  };
  const startToDraw = async () => {
    if (!drawData || drawData.length === 0) {
      alert("請先取得抽獎資料");
      return;
    }
    setIsLoading(true);
    console.log("開始抽獎");
    const winRecord: DrawItem[] = [];
    const drawnIds = new Set();
    while (winRecord.length < quantity) {
      const randomIndex = Math.floor(Math.random() * drawData.length);
      const candidate = drawData[randomIndex];
      if (drawnIds.has(candidate.couponId)) continue;
      winRecord.push(candidate);
      drawnIds.add(candidate.couponId);
    }
    console.log("中獎名單：", winRecord);
    setWinRecord(winRecord);
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }
  React.useEffect(() => {
    getDrawData();
  }, []);
  return (
    <>
    <MessageComponents
      show={noticeModal}
      text={msg}
      closeText="取消"
      confirmText="確定"
      onConfirm={() => {setMsg(""); setNoticeModal(false); setWinRecord(null);}}
      onClose={() => setNoticeModal(false)}
    />
    {
      isLoading && (
      //   <div className="isdrawing bg-white">
      //   <img src={images.draw} className="w-full max-w-[280px] mx-auto" alt="" />
      // {/* <p>抽獎中</p> */}
      //   </div>
      <div className="modal">
        <div className="modal-content">
          <img src={images.draw} className="w-full max-w-[280px] mx-auto" alt="" />
          <p className="text-center">抽獎中...</p>
        </div>
      </div>
      )
    }
    { (!isLoading && winRecord) && (
      <div className="modal">
        <div className="modal-content w-[90%] max-w-2xl max-h-[90vh]">
          <div className="w-flex flex-col items-center justify-center mb-2">
            <p className="text-xl">抽獎結果</p>
          </div>
          <div className="border-2 border-[#413937] p-4 rounded-xl shadow-xl max-h-[50vh] overflow-y-auto scroll-area">
            <table className="w-full max-w-md mx-auto text-[#413937] ">
              <thead className="font-bold text-lg">
                <tr>
                  <th className="py-2 text-center">排序</th>
                  <th className="py-2 text-center">中獎號碼</th>
                </tr>
              </thead>
              <tbody className="font-bold text-2xl">
                {winRecord.map((record, index) => (
                  <tr key={index} className="border-t border-[#000000]">
                    <td className="py-2 text-center">{index + 1}</td>
                    <td className="py-2 text-center">{record.couponId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center mt-4">
          <button
            className="bg-[#cda295] text-white px-4 py-2 rounded ml-2 text-nowrap"
            onClick={() => {setMsg("關閉會刪除抽獎結果，您確定嗎?"); setNoticeModal(true)}}
          >
            關閉
          </button>
          </div>
        </div>
      </div>)
    }
    <div className="h-full p-4 bg-[#ebe4e4] flex flex-col items-center justify-center">
      <p className="mb-3 text-xl text-center">輸入抽獎數量</p>
      <input
        type="number"
        value={quantity}
        className="text-center border p-2 rounded border-[#000000] bg-[#373737] text-white mb-4"
        onChange={(e) => setQuantity(Number(e.target.value))}
      />
      <button
        className="bg-[#cda295] text-white px-4 py-2 rounded ml-2 text-nowrap"
        onClick={() => startToDraw()}
      >
        開始抽獎
      </button>
    </div>
    </>
  );
}
