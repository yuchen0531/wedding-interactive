import { useState } from "react";
import { images } from "../assets/image";
import { createPortal } from "react-dom";

export function Photo() {
  
  const photos = Array.from({ length: 30 }, (_, i) => {
    const no = String(i + 1).padStart(2, "0");

    return {
      thumb: `/photo/thumb/wedding-${no}.webp?v=20260915`,
      full: `/photo/wedding-${no}.webp?v=20260915`,
    };
  });

  const [selected, setSelected] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  return (
    <div className="overflow-x-hidden bg-[#F9F7F2] relative ">
      <img
        src={images.bgRichmenu}
        alt=""
        className="fixed inset-0 w-full h-full object-cover opacity-20 pointer-events-none -z-10"
      />

      <div className="title-bg mb-4 text-center relative z-10">
        <p className="text-3xl font-bold mt-5 text-[#8B1D2A] intro-text">
          婚紗精選
        </p>

        <div className="my-5 flex justify-center items-center w-[75%] mx-auto">
          <div className="h-[1px] w-full bg-[#8B1D2A]" />
          <div className="h-[8px] w-[8px] bg-[#8B1D2A] mx-3 rotate-45 shrink-0" />
          <div className="h-[1px] w-full bg-[#8B1D2A]" />
        </div>

        <div className="p-4 flex flex-col items-center text-center text-lg text-[#393939]">
          <div className="columns-2 sm:columns-3 gap-2 max-w-4xl">
            {photos.map((p, i) => (
              <img
                key={i}
                src={p.thumb}
                alt={`婚紗照 ${i + 1}`}
                loading="lazy"
                decoding="async"
                className="mb-2 w-full rounded-lg shadow cursor-pointer break-inside-avoid transition-transform duration-300 hover:scale-105"
                onClick={() => {
              setSelected(p.full);
              setIsImageLoading(true);
            }}
              />
            ))}
          </div>

          {selected &&
            createPortal(
              <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999]">
                <button
                  className="absolute top-4 right-4 text-white text-4xl leading-none z-[10000]"
                  onClick={() => setSelected(null)}
                  aria-label="關閉"
                >
                  ×
                </button>

                {isImageLoading && (
                  <div className="w-10 h-10 border-4 border-[#bfa05a]/30 border-t-[#bfa05a] rounded-full animate-spin" />
                )}

                <img
                  src={selected}
                  alt="婚紗照放大"
                  onLoad={() => setIsImageLoading(false)}
                  className={`max-w-[95%] max-h-[90%] rounded-2xl shadow-2xl ${
                    isImageLoading ? "hidden" : "block"
                  }`}
                />
              </div>,
              document.body
            )}
        </div>
      </div>
    </div>
  );
}