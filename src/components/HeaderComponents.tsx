import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { images } from "../assets/image";

export function HeaderComponents() {
      const [open, setOpen] = useState(false)
			const location = useLocation()
			useEffect(() => {
				setOpen(false)
			}, [location])
  return (
		<div>
			<div className="md:hidden z-[99] flex justify-between items-center px-3 py-2 shadow-md fixed top-0 left-0 right-0 z-50 bg-[#8B1D2A]">
				<div className="flex items-center">
					<img src={images.bridal} className='h-[48px]' alt="Bridal" />
					<p className='text-white mr-4 header-text text-2xl'>Allen & Agnes’s Wedding</p>
				</div>
				<div className="menu bg-[#ffffff2e] text-white p-1 rounded-lg shadow-lg">
					<button
							className="flex flex-col justify-center items-center w-10 h-10 group"
							onClick={() => setOpen(!open)}
							>
					<div
					className={`w-6 h-0.5 bg-white rounded-sm mb-1 transform-gpu will-change-transform transition-transform duration-300 ${
						open ? 'rotate-45 translate-y-1.5' : ''
					}`}
					/>
					<div
					className={`w-6 h-0.5 bg-white rounded-sm mb-1 transform-gpu will-change-transform transition duration-300 ${
						open ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
					}`}
					/>
					<div
					className={`w-6 h-0.5 bg-white rounded-sm transform-gpu will-change-transform transition-transform duration-300 ${
						open ? '-rotate-45 -translate-y-1.5' : ''
					}`}
					/>
					</button>
				</div>
				<div className={`menu-model ${open ? 'show' : ''}`} onClick={() => setOpen(!open)}>
					<div className="menu-content text-[#851b28] text-lg">
						<nav>
							<ul>
								<li className='py-4'><Link to="/">婚禮資訊</Link></li>
								{/* <li className='py-4'><Link to="/wheel-game">答題抽抽樂</Link></li> */}
								{/* <li className='py-4'><Link to="/raffle">抽獎券領取</Link></li> */}
								{/* <li className='py-4'><Link to="/message">留下祝福</Link></li> */}
								<li className='py-4'><Link to="/photo">婚紗精選</Link></li>
								<li className='py-4'><Link to="/seat">查詢座位</Link></li>
								{/* <li className='py-4'><Link to="/admin">後台管理</Link></li> */}
							</ul>
						</nav>
					</div>
				</div>
			</div>
			<div className="hidden md:flex justify-between items-center px-3 py-2 shadow-lg fixed top-0 left-0 right-0 z-50 bg-[#8B1D2A]">
				<div className="flex items-center">
					<Link to="/"><img src={images.bridal} className='h-[48px]' alt="Bridal" /></Link>
					<p className='text-white mr-4 header-text text-2xl'>Allen & Agnes’s Wedding</p>
				</div>
				<div className="flex">
					<div className='mx-4 text-white cursor-pointer hover:underline'><Link to="/">婚禮資訊</Link></div>
					{/* <div className='mx-4 text-white cursor-pointer hover:underline'><Link to="/wheel-game">答題抽抽樂</Link></div> */}
					{/* <div className='mx-4 text-white cursor-pointer hover:underline'><Link to="/raffle">抽獎券領取</Link></div> */}
					{/* <div className='mx-4 text-white cursor-pointer hover:underline'><Link to="/message">留下祝福</Link></div> */}
					<div className='mx-4 text-white cursor-pointer hover:underline'><Link to="/photo">婚紗精選</Link></div>
					<div className='mx-4 text-white cursor-pointer hover:underline'><Link to="/seat">查詢座位</Link></div>
					{/* <div className='mx-4 text-white cursor-pointer hover:underline'><Link to="/admin">後台管理</Link></div> */}
				</div>
							
			</div>
		</div>
  );
}
