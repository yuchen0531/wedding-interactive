import { useEffect, Suspense, lazy } from "react"
import { Routes, Route } from "react-router-dom"
// import liff from "@line/liff"
import { callFunction } from "./utils/callFunction"
import { HeaderComponents } from "./components/HeaderComponents"
import { FooterComponents } from "./components/FooterCpmponents"


// 用 lazy 分割各個頁面
const SupabaseTest = lazy(() => import("./pages/SupabaseTest"))
const Draw = lazy(() => import("./pages/DrawPage").then(m => ({ default: m.Draw })))
const Admin = lazy(() => import("./pages/AdminPage").then(m => ({ default: m.Admin })))
const Photo = lazy(() => import("./pages/PhotoPage").then(m => ({ default: m.Photo })))
const Seat = lazy(() => import("./pages/SeatPage").then(m => ({ default: m.Seat })))
const Raffle = lazy(() => import("./pages/RafflePage").then(m => ({ default: m.Raffle })))
const Message = lazy(() => import("./pages/MessagePage").then(m => ({ default: m.Message })))
const Info = lazy(() => import("./pages/InfoPage").then(m => ({ default: m.Info })))
const WheelGamePage = lazy(() => import("./pages/WheelGamePage").then(m => ({ default: m.WheelGamePage })))

function App() {
  // const navigate = useNavigate()
  // const [ready, setReady] = useState(false)
  useEffect(() => {
    const initLiff = async () => {
      const localLineUserId = localStorage.getItem("lineUserId")
      const localProfile = localStorage.getItem("accountInfo")
      if(!localLineUserId || !localProfile) {
        const userId = "123456789abcdefg";
        const userName = "測試用使用者";
        localStorage.setItem("lineUserId", userId);
        localStorage.setItem("lineuserName", userName);
        const result = await callFunction("new-account", { userId: userId,userName: userName });
        localStorage.setItem("accountInfo", JSON.stringify(result.data));
        console.log(await result);
      }
    };
    initLiff();
  }, []);
  // useEffect(() => {
  //   const initLiff = async () => {
  //     try {2  //       await liff.init({ liffId: "2007884701-wbRyqDm8" });
  //       const params = new URLSearchParams(window.location.search)
  //       const liffState = params.get("liff.state")
  //       if (liffState) navigate(liffState, { replace: true })

  //       if (!liff.isLoggedIn()) {
  //         liff.login({ redirectUri: window.location.href });
  //         return;
  //       }
  //       const localLineUserId = localStorage.getItem("lineUserId")
  //       const localProfile = localStorage.getItem("accountInfo")
  //       if(!localLineUserId || !localProfile) {
  //         const profile = await liff.getProfile();
  //         const userId = profile.userId;
  //         const userName = profile.displayName;
  //         localStorage.setItem("lineUserId", userId);
  //         localStorage.setItem("lineuserName", userName);
  //         console.log('登入成功', profile);
  //         const result = await callFunction("new-account", { userId: userId,userName: userName });
  //         localStorage.setItem("accountInfo", JSON.stringify(result.data));
  //         console.log(await result);
  //       }
  //       setReady(true)
  //     } catch (error) {
  //       console.error('LIFF 初始化失敗:', error);
  //       setReady(true)
  //     }
  //   };
  //   initLiff();
  // }, [navigate]);
  // if (!ready) return null
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* 固定 Header 區域 */}701852963.
      
      <div className="h-16 shrink-0">
        <HeaderComponents />
      </div>

      {/* 下方 Route 可滾動區域 */}
      <div className="overflow-auto">
        <Suspense fallback={
            <div className="flex justify-center items-center ">
            </div>
          }>
          <Routes>
              <Route path="/" element={<Info />} />
              <Route path="/supabase-test" element={<SupabaseTest />} />
              <Route path="/draw" element={<Draw />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/message" element={<Message />} />
              <Route path="/photo" element={<Photo />} />
              <Route path="/seat" element={<Seat />} />
              <Route path="/raffle" element={<Raffle />} />
              <Route path="/wheel-game" element={<WheelGamePage />} />
          </Routes>
        </Suspense>
        <FooterComponents />
      </div>
      
    </div>
  )
}

export default App
