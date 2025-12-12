// import { useState, useEffect } from "react";
import { images } from "../assets/image";
import { SlideImage } from "../components/SlideImageComponents";


export function Info() {
//   const [data, setData] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       // 假設這裡是從某個API或資料庫獲取資訊
//       const response = await fetch("https://api.example.com/info");
//       const result = await response.json();
//       setData(result);
//     };

//     fetchData();
//   }, []);

  return (
    <div className="overflow-x-hidden bg-[#ffffff]">
        <div className="flex flex-col items-center justify-center pb-20  mx-auto relative">
            <img src={images.banner1}  className="w-full max-w-lg" alt="" />
            <div className="heart mt-20">
                  <span className="heart-text text-center text-2xl header-text">Glad you're here</span>
            </div>
            <img src={images.vintage} width="180px" alt="" />
            <p className="-mt-12 text-[#ca9b8e] text-xl text-center font-[500]">很開心能與您分享這份喜悅<br />
                您的陪伴與祝福<br />
                都是我們最珍貴的禮物
            </p>
            <p className="mt-10 text-[#ca9b8e] text-xl text-center font-[500]">
                在此誠摯感謝您<br />
                蒞臨我們人生中最重要的日子
            </p>
        </div>
        <div className="py-20 flex justify-center w-full relative">
            <div className="w-1/2 md:w-1/4 lg:w-1/5 text-center flex flex-col justify-center items-center">
                <p className="text-3xl font-bold mb-5 text-[#cb9b8d] intro-text">新郎</p>
                <p className="text-2xl text-[#777777]">郭晏綸</p>
                <p className="text-xl text-[#777777]">Allen</p>
            </div>
            <SlideImage src={images.img3} className="w-1/2 md:w-1/4 lg:w-1/5" direction="right" imgClassName="rounded-l-full md:rounded-none shadow-lg" />
            <img src={images.nature1} className="absolute -top-2 z-[90] -right-2 -scale-y-100  rotate-[90deg] w-[220px]" alt="" />
            <img src={images.leaf5} className="w-[120px] absolute -bottom-1 rotate-[45deg] -scale-x-100 -left-5" alt="" />
        </div>
        <div className="bg-[#fbe5df] py-20 flex justify-center w-full relative">
            <img src={images.nature1} className="absolute -top-2 z-[90] -left-2 rotate-[90deg] w-[220px]" alt="" />
            <SlideImage src={images.banner2} className="w-1/2 md:w-1/4 lg:w-1/5" direction="left" imgClassName="rounded-r-full md:rounded-none shadow-lg" />
            <div className="md:w-1/4 lg:w-1/5 w-1/2 text-center flex flex-col justify-center items-center">
                <p className="text-3xl font-bold mb-5 text-[#cb9b8d] intro-text">新娘</p>
                <p className="text-2xl text-[#777777]">陳禹蓁</p>
                <p className="text-xl text-[#777777]">Agnes</p>
            </div>
            <img src={images.rose3} className="w-[80px]  absolute bottom-3 rotate-[-30deg] -scale-x-100 -right-1" alt="" />
        </div>
        <div className="py-20 flex justify-center w-full relative">
            <div className="md:w-1/4 lg:w-1/5 w-1/2 text-center flex flex-col justify-center items-center">
                <p className="text-3xl font-bold mb-5 text-[#cb9b8d] intro-text">時間</p>
                <p className="text-2xl text-[#777777]">2026/10/3</p>
                <p className="text-3xl font-bold my-5 text-[#cb9b8d] intro-text">地點</p>
                <p className="text-2xl text-[#777777]">高雄翰品酒店</p>
                <p className="text-2xl text-[#777777]">3F 雲聽</p>
            </div>
            <SlideImage src={images.hotel} className="w-1/2 md:w-1/4 lg:w-1/5 my-auto" direction="right" imgClassName="shadow-lg" />
        </div>
        <div className="bg-[#fbe5df] py-20 flex justify-center items-center flex-col w-full relative">
            <p className="text-3xl font-bold mb-5 text-[#cb9b8d] intro-text">前往方式</p>
            <p className="text-xl text-[#777777]">1.捷運至鹽埕埔站2號出口後步行3分鐘</p>
            <p className="text-center text-xl text-[#777777]">2.開車至<u><a href="https://www.google.com/maps/search/?api=1&query=高雄市鹽埕區大仁路43號" className="text-xl text-[#777777]">高雄市鹽埕區大仁路43號</a></u><br />(對面有公有停車場)</p>
            <p className="text-3xl font-bold my-5 text-[#cb9b8d] intro-text">地圖</p>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3682.7752515010243!2d120.28562289999999!3d22.6248664!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e0470a97bfccd%3A0xbdf2cfcf0393771f!2z6auY6ZuE57-w5ZOB6YWS5bqX!5e0!3m2!1szh-TW!2stw!4v1764907181108!5m2!1szh-TW!2stw" width="375" height="280" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            <img src={images.leaf5} className="w-[120px] absolute bottom-0 rotate-[62deg] -left-5" alt="" />
            <img src={images.leaf5} className="w-[120px] absolute -top-20 -scale-x-100 rotate-[-60deg] -right-1" alt="" />
        </div>
        <div className="py-20 flex flex-col justify-center items-center w-full relative bg-[#f3f0e0] ">
            <p className="text-3xl font-bold my-5 text-[#847363] intro-text">貼心小提醒</p>
            <div style={{ backgroundImage: `url(${images.flower2})` }} className="notice-frame max-w-lg rounded-lg w-[380px] h-[380px] p-3 text-center flex flex-col justify-center items-center relative">
                <p className="text-lg text-[#847363]">11:30 開放入席</p>
                <p className="text-lg text-[#847363]">12:00 準時開席</p>
                <p className="text-lg text-[#847363]">有迎賓雞尾酒及小點心</p>
                <p className="text-lg text-[#847363]">歡迎提早來吃吃喝喝唷~</p>
            </div>
        </div>
    </div>
  );
}