import { useEffect, useRef, useState } from "react";
import { images } from "../assets/image";
import { SlideImage } from "../components/SlideImageComponents";
function EnvelopeSection() {
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const [isInView, setIsInView] = useState(false);
    const [isCardOpen, setIsCardOpen] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    useEffect(() => {
        const node = sectionRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
            setIsInView(entry.isIntersecting);
            },
            {
                root: null,
                rootMargin: "-40% 0px -40% 0px",
                threshold: 0,
            }
        );

        observer.observe(node);

        return () => observer.disconnect();
        }, []);
        useEffect(() => {
            let openTimer: number | undefined;
            let flipTimer: number | undefined;

            if (isInView) {
                openTimer = window.setTimeout(() => {
                setIsCardOpen(true);
                }, 800);

                flipTimer = window.setTimeout(() => {
                setIsFlipped(true);
                }, 2200);
            } else {
                setIsCardOpen(false);
                setIsFlipped(false);
            }

            return () => {
                if (openTimer) window.clearTimeout(openTimer);
                if (flipTimer) window.clearTimeout(flipTimer);
            };
}, [isInView]);
  return (
    <>
    <div ref={sectionRef} className="relative mt-[200px]">
        {/* 主體 */}
        <div className="envelope-body w-[300px] bg-[#851b28] h-[180px] border"></div>
        {/* 上蓋 */}
        <div className="envelope-flap w-[225px] h-[225px] bg-[#851b28] "></div>
        <div className="envelope-flap-inside w-[225px] h-[225px] bg-[#f3f3f373] rounded"></div>
        <div className={`invite-card-shell ${isCardOpen ? "invite-card-shell--open" : ""}`}>
            <div className={`invite-card ${isFlipped ? "invite-card--flipped" : ""}`}>
                <div className="invite-card__face invite-card__front">
                <p className="invite-card__label">Wedding Invitation</p>
                <div className="invite-card__line" />
                <p className="invite-card__title">Invitation</p>
                <p className="invite-card__sub">Allen & Agnes</p>
            </div>

            <div className="invite-card__face invite-card__back">
                <p className="invite-card__label">Wedding Invitation</p>
                <div className="invite-card__line" />
                <p className="text-[#C6A46C]">
                在此誠摯感謝您<br />
                蒞臨我們人生中最重要的日子
                </p>
            </div>
            </div>
        </div>
        {/* 左邊 */}
        <div className="envelope-side-left w-[150px] h-[180px] bg-[#993945]"></div>
        {/* 右邊 */}
        <div className="envelope-side-right w-[150px] h-[180px] bg-[#993945]"></div>
        {/* 下蓋 */}
        <div className="envelope-side-bottom w-[300px] h-[90px] bg-[#851b28]"></div>
        {/* 封蠟 */}
        <div className="wax-seal w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center text-[#C6A46C] font-bold text-sm absolute top-[55%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            LOVE
        </div>
    </div>
    </>
  );
}
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
    <div className="overflow-x-hidden bg-[#F9F7F2] relative">
        <img src={images.bgRichmenu} alt="" className="fixed top-0 inset-0 w-full h-full object-cover opacity-20" />
        <div className="flex flex-col items-center justify-center mx-auto relative">
            <img src={images.banner1}  className="w-full max-w-lg" alt="" />
            <div className="heart my-20">
                  <span className="heart-text text-center text-2xl header-text">Glad you're here</span>
            </div>
            <EnvelopeSection />
            <div className="mt-20 mb-10 flex justify-center items-center w-[75%]">
                <div className="h-[1px] w-full bg-[#C6A46C]"></div>
                <div className="h-[8px] w-[8px] bg-[#C6A46C] mx-3 rotate-45 shrink-0"></div>
                <div className="h-[1px] w-full bg-[#C6A46C]"></div>
            </div>
            <p className="text-[#C6A46C] text-xl text-center font-[500]">很開心能與您分享這份喜悅<br />
                您的陪伴與祝福<br />
                都是我們最珍貴的禮物
            </p>
            <div className="my-10 flex justify-center items-center w-[75%]">
                <div className="h-[1px] w-full bg-[#C6A46C]"></div>
                <div className="h-[8px] w-[8px] bg-[#C6A46C] mx-3 rotate-45 shrink-0"></div>
                <div className="h-[1px] w-full bg-[#C6A46C]"></div>
            </div>
        </div>
        <div className="py-20 flex justify-center w-full relative">
            <div className="w-1/2 md:w-1/4 lg:w-1/5 text-center flex flex-col justify-center items-center">
                <p className="text-2xl font-bold mb-5 text-[#8B1D2A] intro-text">新郎</p>
                <p className="text-4xl text-[#706455]">晏綸</p>
                <p className="text-xl text-[#706455]">Allen</p>
            </div>
            <SlideImage src={images.allen} className="w-1/2 md:w-1/4 lg:w-1/5" direction="right" imgClassName="rounded-l-full md:rounded-none shadow-lg" />
            <img src={images.nature1} className="absolute -top-2 z-[90] -right-2 -scale-y-100  rotate-[90deg] w-[220px]" alt="" />
        </div>
        <div className="py-20 flex justify-center w-full relative">
            <img src={images.nature1} className="absolute -top-2 z-[90] -left-2 rotate-[90deg] w-[220px]" alt="" />
            <SlideImage src={images.agnes} className="w-1/2 md:w-1/4 lg:w-1/5" direction="left" imgClassName="rounded-r-full md:rounded-none shadow-lg" />
            <div className="md:w-1/4 lg:w-1/5 w-1/2 text-center flex flex-col justify-center items-center">
                <p className="text-2xl font-bold mb-5 text-[#8B1D2A] intro-text">新娘</p>
                <p className="text-4xl text-[#706455]">禹蓁</p>
                <p className="text-xl text-[#706455]">Agnes</p>
            </div>
        </div>
        <div className="py-20 flex justify-center w-full relative">
            <div className="md:w-1/4 lg:w-1/5 w-1/2 text-center flex flex-col justify-center items-center">
                <p className="text-2xl font-bold mb-5 text-[#8B1D2A] intro-text">時間</p>
                <p className="text-xl text-[#706455] mb-2">2026 年 10 月 3 日</p>
                <p className="text-xl text-[#706455] mb-2">星期六 • 午宴</p>
                <p className="text-xl text-[#706455]">12:00 恭候入席</p>
                <p className="text-2xl font-bold my-5 text-[#8B1D2A] intro-text">地點</p>
                <p className="text-xl text-[#706455]">高雄翰品酒店</p>
                <p className="text-xl text-[#706455]">3F 雲廳</p>
            </div>
            <SlideImage src={images.hotel} className="w-1/2 md:w-1/4 lg:w-1/5 my-auto" direction="right" imgClassName="shadow-lg" />
        </div>
        <div className="py-20 flex justify-center items-center flex-col w-full relative">
            <p className="text-2xl font-bold mb-5 text-[#8B1D2A] intro-text">前往方式</p>
            <p className="text-xl text-[#706455]">1.捷運至鹽埕埔站2號出口後步行3分鐘</p>
            <p className="text-center text-xl text-[#706455]">2.開車至<u><a href="https://www.google.com/maps/search/?api=1&query=高雄市鹽埕區大仁路43號" className="text-xl text-[#706455]">高雄市鹽埕區大仁路43號</a></u><br />(對面有公有停車場)</p>
            <p className="text-2xl font-bold my-5 text-[#8B1D2A] intro-text">地圖</p>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3682.7752515010243!2d120.28562289999999!3d22.6248664!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e0470a97bfccd%3A0xbdf2cfcf0393771f!2z6auY6ZuE57-w5ZOB6YWS5bqX!5e0!3m2!1szh-TW!2stw!4v1764907181108!5m2!1szh-TW!2stw" width="375" height="280" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            <img src={images.leaf5} className="w-[120px] absolute bottom-0 rotate-[62deg] -left-5" alt="" />
            <img src={images.leaf5} className="w-[120px] absolute -top-20 -scale-x-100 rotate-[-60deg] -right-1" alt="" />
        </div>
        <div className="py-20 flex flex-col justify-center items-center w-full relative">
            <p className="text-2xl font-bold my-5 text-[#847363] intro-text">貼心小提醒</p>
            <div style={{ backgroundImage: `url(${images.flower2})` }} className="notice-frame max-w-lg rounded-lg w-[380px] h-[380px] p-3 text-center flex flex-col justify-center items-center relative">
                <p className="text-lg text-[#847363]">12:00 開放入席</p>
                <p className="text-lg text-[#847363]">有迎賓雞尾酒及小點心</p>
                <p className="text-lg text-[#847363]">限量供應</p>
                <p className="text-lg text-[#847363] mb-5">歡迎提前來吃吃喝喝唷~</p>
            </div>
        </div>
    </div>
  );
}