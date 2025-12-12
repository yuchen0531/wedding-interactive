import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  alt?: string;
  direction?: "right" | "left"; // 預設右邊進來
  className?: string;
  imgClassName?: string; // 用來覆蓋 img 的 className
};

export function SlideImage({ src, alt = "", direction = "right", className = "", imgClassName = "" }: Props) {
  const imgRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      setIsVisible(entry.isIntersecting); // ✅ 每次進出都更新狀態
      console.log('👀 ', imgRef.current);
    },
    { threshold: 0.3 }
  );

  if (imgRef.current) {
    console.log('👀 觀察元素:', imgRef.current);
    observer.observe(imgRef.current);
  }

  return () => observer.disconnect();
}, []);

  return (
    <div
      ref={imgRef}
      className={`${direction === "right" ? "slide-in-right" : "slide-in-left"} ${
        isVisible ? "show" : ""
      } ${className}`}
    >
      <img src={src} alt={alt} className={`w-full ${imgClassName}`} loading="lazy" />
    </div>
  );
}
