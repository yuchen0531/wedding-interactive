import { useState } from "react";
// import { useQuery } from '@tanstack/react-query';
// import { LoadingModal } from "../components/LoadingComponents";
import { MessageComponents } from "../components/MessageComponents";
import { images } from "../assets/image";
// import { callFunction } from "../utils/callFunction";
// import { QuizComponents } from '../components/QuizComponents';
// import { WheelComponents } from '../components/WheelComponents';
// import { a, s } from "framer-motion/client";

export function Seat() {
  const [hightLightTable, setHightLightTable] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [msg, setMsg] = useState<string>('');
  const [noticeModal, setNoticeModal] = useState(false);
  const getGuests = async () => {
  setHightLightTable(0);

  if (!name) {
    setMsg('請輸入完整姓名');
    setNoticeModal(true);
    return;
  }

  try {
    const res = await fetch(
      `https://docs.google.com/spreadsheets/d/1KJDCcyc2RoywPLJuHSgeHyW6wjU8en2tCeHKcwYI4gA/gviz/tq?sheet=PublicGuests&tqx=out:json&tq=select%20A,B,C%20label%20A%20'displayName',B%20'tableNo',C%20'tableName'&ts=${Date.now()}`,
      { cache: 'no-store' }
    );
    const text = await res.text();
    const jsonStr = text.replace(/^[^{]+/, '').replace(/\);?\s*$/, '');
    const obj = JSON.parse(jsonStr);

    const cols = obj.table.cols.map((c: any) => c.label || c.id);
    const iName = cols.indexOf('displayName');
    const iTable = cols.indexOf('tableNo');
    const iTableName = cols.indexOf('tableName');
    const rows = obj.table.rows as Array<{ c: Array<{ v: any } | null> }>;

    const items = rows
      .map((r, i) => {
        const rawName = (r.c[iName]?.v ?? '').toString().trim();
        const tableNo = Number(r.c[iTable]?.v);
        const tableName = (r.c[iTableName]?.v ?? '').toString().trim();
        if (!rawName || Number.isNaN(tableNo)) return null;
        return {
          id: String(i + 1),
          displayName: rawName,
          nameKey: normalize(rawName),
          tableNo,
          tableName,
        };
      })
      .filter(Boolean) as Array<{
        id: string; displayName: string; nameKey: string; tableNo: number; tableName: string;
      }>;
      
    const searchKey = normalize(name);
    const found = items.find(g => g.nameKey === searchKey);

    if (found) {
      setHightLightTable(found.tableNo);
      setMsg(`您的座位安排於「${found.tableName}」桌，歡迎入席。`);
      setNoticeModal(true);
      console.log('✅ match:', found.nameKey, searchKey);
    } else {
      setHightLightTable(0);
      setMsg('查無資料，請洽詢現場人員');
      setNoticeModal(true);
      setName('');
      console.log('❌ not found:', searchKey);
    }
  } catch (e) {
    setMsg('連線異常，請稍後再試');
    setNoticeModal(true);
    console.error(e);
  }
};

  const normalize = (s: string) => {
    return s
      .trim()
      .replace(/\s+/g, "")
      .replace(/[\uFF01-\uFF5E]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0))
      .toLowerCase();
  }
  return (
    <>
    <MessageComponents
          show={noticeModal}
          text={msg}
          closeText="關閉"
          confirmText=""
          onConfirm={() => {}}
          onClose={() => setNoticeModal(false)}
        />
    <div className="overflow-x-hidden bg-[#F7F3ED] relative isolate p-4 flex flex-col items-center justify-center text-lg text-center" style={{ minHeight: 'calc(100vh - 92px)' }}>
      <img
        src={images.bgRichmenu}
        alt=""
        className="fixed inset-0 w-full h-full object-cover opacity-15 pointer-events-none -z-10"
      />
      <div className="title-bg text-[#6A5D52] header-text">
        <p>為了讓您更快找到座位，</p>
        <p className="mb-2">請輸入您的完整姓名進行查詢 💕</p>
        <div className="flex items-center justify-center mb-3">
          <input type="text" placeholder="請輸入您的姓名" value={name} className="bg-white py-1 px-3 rounded-2xl" onChange={(e) => setName(e.target.value)} />
          <button className="bg-[#8B1D2A] text-white py-1 px-3 rounded-2xl ml-2 text-nowrap btn_shadow" onClick={() => getGuests()}>查詢</button>
        </div>
      </div>
      {/* <p >{ 
        王XX您好，您在第 5 桌唷!!
        }</p> */}
      <div className="w-full max-w-[500px] h-fit bg-white p-3 rounded-2xl mt-3 bg-[#FCFAF7] border border-[#E6DDD2] rounded-[24px] shadow-[0_12px_30px_rgba(0,0,0,0.08),0_2px_8px_rgba(139,29,42,0.04)]">
        <div className="text-white stage tracking-widest w-2/5 rounded h-[40px] bg-white mx-auto flex items-center justify-center -mb-5">舞台</div>
        <div className="flex justify-around mb-1">
          <div>
            <div className={`text-[#857d71] table mb-1 ${hightLightTable === 1 ? 'table-shiny' : 'table-noshiny'}`}>1</div>
            <div className={`text-[#857d71] table mb-1 ${hightLightTable === 2 ? 'table-shiny' : 'table-noshiny'}`}>2</div>
            <div className={`text-[#857d71] table mb-1 ${hightLightTable === 3 ? 'table-shiny' : 'table-noshiny'}`}>3</div>
            <div className={`text-[#857d71] table mb-1 ${hightLightTable === 4 ? 'table-shiny' : 'table-noshiny'}`}>4</div>
            <div className={`text-[#857d71] table mb-1 ${hightLightTable === 5 ? 'table-shiny' : 'table-noshiny'}`}>5</div>

          </div>
          <div className="mt-[65px]">
            <div className={`text-[#857d71] table mb-1 ${hightLightTable === 6 ? 'table-shiny' : 'table-noshiny'}`}>6</div>
            <div className={`text-[#857d71] table mb-1 ${hightLightTable === 7 ? 'table-shiny' : 'table-noshiny'}`}>7</div>
            <div className={`text-[#857d71] table mb-1 ${hightLightTable === 8 ? 'table-shiny' : 'table-noshiny'}`}>8</div>
          </div>
          <div>
            <div className="text-[#857d71] table table-noshiny mt-6 mb-1">主桌</div>
            <div className="text-[#857d71] h-[200px] bg-[#f0f0f0] border-2"></div>
          </div>
          <div className="mt-[65px]">
            <div className={`text-[#857d71] table mb-1 ${hightLightTable === 9 ? 'table-shiny' : 'table-noshiny'}`}>9</div>
            <div className={`text-[#857d71] table mb-1 ${hightLightTable === 10 ? 'table-shiny' : 'table-noshiny'}`}>10</div>
            <div className={`text-[#857d71] table mb-1 ${hightLightTable === 11 ? 'table-shiny' : 'table-noshiny'}`}>11</div>
            <div className={`text-[#857d71] table mb-1 ${hightLightTable === 12 ? 'table-shiny' : 'table-noshiny'}`}>12</div>
          </div>
          <div>
            <div className={`text-[#857d71] table mb-1 ${hightLightTable === 13 ? 'table-shiny' : 'table-noshiny'}`}>13</div>
            <div className={`text-[#857d71] table mb-1 ${hightLightTable === 14 ? 'table-shiny' : 'table-noshiny'}`}>14</div>
            <div className={`text-[#857d71] table mb-1 ${hightLightTable === 15 ? 'table-shiny' : 'table-noshiny'}`}>15</div>
            <div className={`text-[#857d71] table mb-1 ${hightLightTable === 16 ? 'table-shiny' : 'table-noshiny'}`}>16</div>
            <div className={`text-[#857d71] table mb-1 ${hightLightTable === 17 ? 'table-shiny' : 'table-noshiny'}`}>17</div>
          </div>
        </div>
        <div className="flex justify-end">
          <div className={`text-[#857d71] table mb-1 mr-1 ${hightLightTable === 18 ? 'table-shiny' : 'table-noshiny'}`}>18</div>
          <div className={`text-[#857d71] table mb-1 mr-1 ${hightLightTable === 19 ? 'table-shiny' : 'table-noshiny'}`}>19</div>
          <div className={`text-[#857d71] table mb-1 mr-1 ${hightLightTable === 20 ? 'table-shiny' : 'table-noshiny'}`}>20</div>
          <div className={`text-[#857d71] table mb-1 ${hightLightTable === 21 ? 'table-shiny' : 'table-noshiny'}`}>21</div>
        </div>
        {/* <div className="main-table text-white table mx-auto my-3 bg-[#c79aa0]">主桌</div> */}

        {/* {tableGroups.map((group, index) => (
          <div key={index} className="flex justify-between items-center mt-3">
            <div className="flex items-center">
              {group.slice(0, 2).map((item, i) => (
                <div key={item} className={`text-[#797979] table ${i===0 ? 'mr-2' : ''} ${hightLightTable===Number(item) ? 'table-shiny' : 'table-noshiny'} `}>{item}</div>
              ))}
            </div>
            <div className="flex items-center">
              {group.slice(2, 4).map((item, i) => (
                <div key={item} className={`text-[#797979] table ${i===0 ? 'mr-2' : ''} ${hightLightTable===Number(item) ? 'table-shiny' : 'table-noshiny'}`}>{item}</div>
              ))}
            </div>
          </div>
        ))} */}
        {/* <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="table mr-2">1</div>
            <div className="table">2</div>
          </div>
          <div className="flex items-center">
            <div className="table mr-2">3</div>
            <div className="table">4</div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center">
            <div className="table mr-2">5</div>
            <div className="table">6</div>
          </div>
          <div className="flex items-center">
            <div className="table mr-2">7</div>
            <div className="table">8</div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center">
            <div className="table mr-2">9</div>
            <div className="table">10</div>
          </div>
          <div className="flex items-center">
            <div className="table mr-2">11</div>
            <div className="table">12</div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center">
            <div className="table mr-2">13</div>
            <div className="table">14</div>
          </div>
          <div className="flex items-center">
            <div className="table mr-2">15</div>
            <div className="table">16</div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center">
            <div className="table mr-2">17</div>
            <div className="table">18</div>
          </div>
          <div className="flex items-center">
            <div className="table mr-2">19</div>
            <div className="table">20</div>
          </div>
        </div> */}
      </div>
    </div>
    </>
  );
}
