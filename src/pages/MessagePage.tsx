import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  onValue,
  push,
  query,
  ref,
  orderByChild,
  limitToLast,
  serverTimestamp,
} from "firebase/database";
import { db } from "../lib/firebase";
import { MessageComponents } from "../components/MessageComponents";
import { images } from "../assets/image";


interface MessageItem {
  id: string;
  name: string;
  text: string;
  createdAt: number | null;
}

export function Message() {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [sending, setSending] = useState(false);
  const [noticeModal, setNoticeModal] = useState(false);
  const [noticeMsg, setNoticeMsg] = useState("");

  // 讀取最新留言
  useEffect(() => {
    const messagesRef = ref(db, "messages");
    const q = query(messagesRef, orderByChild("createdAt"), limitToLast(80));

    const unsubscribe = onValue(
      q,
      (snap) => {
        const list: MessageItem[] = [];
        snap.forEach((child) => {
          const val = child.val() || {};
          list.push({
            id: child.key || "",
            name: val.name,
            text: val.text || "",
            createdAt: val.createdAt ?? null,
          });
        });

        // 最新在上
        setMessages(list.reverse());
      },
      (err) => {
        console.error(err);
        setNoticeMsg("留言載入失敗，請稍後再試。");
        setNoticeModal(true);
      }
    );

    return () => unsubscribe();
  }, []);
  const handleResultClose = () => {
    setNoticeModal(false);
    setNoticeMsg("");
  }
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setNoticeMsg("送出成功，感謝你的留言 💌");
    setNoticeModal(true);
    if (!name.trim()) {
      setNoticeMsg("請先填寫你的暱稱唷~");
      setNoticeModal(true);
      return;
    }
    if (!text.trim()) {
      setNoticeMsg("請先寫一點想對我們說的話 💌");
      setNoticeModal(true);
      return;
    }

    const displayName = name.trim() || localStorage.getItem("lineuserName") || "賓客";

    try {
      setSending(true);
      const messagesRef = ref(db, "messages");
      await push(messagesRef, {
        lineDisplayname: localStorage.getItem("lineuserName"),
        name: displayName,
        text: text.trim(),
        createdAt: serverTimestamp(),
      });

      setText(""); // 保留名字
    } catch (err) {
      console.error(err);
      setNoticeMsg("送出失敗，請稍後再試 🙏");
      setNoticeModal(true);
    } finally {
      setSending(false);
    }
  };

  return (
    // <div className="bg-[#F9F7F2] flex flex-col items-center text-center text-lg text-[#393939] p-4 overflow-y-auto" style={{ minHeight: 'calc(100vh - 92px)' }}>
      <div className="overflow-x-hidden overflow-y-auto bg-[#F9F7F2] relative isolate p-4 flex flex-col items-center justify-center text-lg text-center" style={{ minHeight: 'calc(100vh - 92px)' }}>
            <img
              src={images.bgRichmenu}
              alt=""
              className="fixed inset-0 w-full h-full object-cover opacity-20 pointer-events-none -z-10"
            />
      {/* 標題區：固定在上方 */}
      <div className="title-bg mb-3 text-center">
        <p className="text-3xl font-bold mb-3 text-[#857d71] intro-text">
          一起留下祝福~
        </p>
        <p className="text-sm text-[#838383]">
          想對我們說的話、回憶、祝福，都可以寫在這裡
        </p>
        <p className="text-sm text-[#838383]">
          婚禮結束後，我們會把這裡當成專屬的回憶本。
        </p>
      </div>

      {/* 主卡片：佔滿剩下空間，裡面再分上下區塊 */}
      <div className="w-full max-w-[650px] mb-5">
        

        {/* 分隔線 */}
        <div className="my-3" />

        {/* 下：輸入區（固定在卡片下方，不捲動） */}
        <section>
          
          <form onSubmit={handleSubmit} className="bg-white message-sent-frame rounded-2xl p-2">
            <p className="text-lg font-semibold text-[#857d71] ">
            ✏️ 寫下一點什麼給我們吧~<br/><span className="text-sm">(有機會獲得驚喜唷)</span>
          </p>
            <div className="mb-2">
              <label className="block text-sm text-left ml-2 text-[#857d71] mb-1">
                暱稱
              </label>
              <input
                type="text"
                placeholder="例：新郎最帥好友、最美閨密小美..."
                className="text-[#857d71] bg-[#fbf4ea] w-full rounded-2xl px-3 py-2 text-sm focus:outline-none focus:border-[#cb9b8d]"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-left ml-2 text-[#857d71] mb-1">
                想對我們說的話
              </label>
              <textarea
                rows={2}
                maxLength={50}
                placeholder="例：新郎好帥、新娘身材怎麼那麼好、要幸福喔、要一直幸福下去！💌"
                className="text-[#857d71] w-full bg-[#fbf4ea] rounded-2xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-[#cb9b8d]"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="text-xs text-[#a9a9a9] text-right">
                {text.length}/50
              </div>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full bg-[#E6A6A1] active:bg-[#bf8884] text-white rounded-2xl py-2 text-sm hover:brightness-105 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {sending ? "送出中..." : "送出留言"}
            </button>
          </form>
        </section>
      </div>
      {/* 上：留言牆（可捲動） */}
        <section className="flex-1 flex flex-col bg-white message-sent-frame rounded-2xl p-2 mb-5 w-full max-w-[650px]">
          <div className="flex items-center justify-between mb-1">
            <p className="text-lg font-semibold text-[#857d71]">
              💌 大家的留言
            </p>
          </div>

          <div className="overflow-y-auto pr-1 custom-scrollbar px-2 py-3 message-frame">
            {messages.length === 0 ? (
              <p className="text-sm text-[#857d71] text-center py-6">
                還沒有留言耶，歡迎成為第一個來寫祝福的人 ✍️
              </p>
            ) : (
              <ul className="">
                {messages.map((m) => (
                  <li
                    key={m.id}
                    className="mb-2"
                  >
                    <div className="flex justify-between items-end">
                      <div className="text-[#857d71] text-left ml-1 text-lg">
                      {m.name}
                    </div>
                    {m.createdAt && (
                      <div className="text-[10px] text-[#857d71] text-right leading-relaxed">
                        {new Date(m.createdAt).toLocaleString("zh-TW", {
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    )}
                    </div>
                    <div className="message bg-[#fbf4ea] rounded-lg px-2 py-1 text-sm text-[#534d46] text-left leading-relaxed">
                      {m.text}
                    </div>
                    
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      <MessageComponents show={noticeModal} text={noticeMsg} closeText="關閉" confirmText="" onConfirm={() => {}} onClose={() => handleResultClose()} />

    </div>
  );
}
