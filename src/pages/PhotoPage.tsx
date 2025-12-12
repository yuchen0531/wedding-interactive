import { useState } from "react";
import { images } from "../assets/image";
export function Photo() {
  const photos = [
    // 挖空：你之後用真實圖片 URL 取代這些
    "https://ikaevehccrdsfltqssch.supabase.co/storage/v1/object/public/wedding-photos/IMG_2131.JPEG",
    "https://ikaevehccrdsfltqssch.supabase.co/storage/v1/object/public/wedding-photos/IMG_7206.JPEG",
    "https://ikaevehccrdsfltqssch.supabase.co/storage/v1/object/public/wedding-photos/IMG_2896.JPEG",
    "https://ikaevehccrdsfltqssch.supabase.co/storage/v1/object/public/wedding-photos/IMG_2790.JPEG",
    "https://ikaevehccrdsfltqssch.supabase.co/storage/v1/object/public/wedding-photos/IMG_2719.JPEG",
    "https://ikaevehccrdsfltqssch.supabase.co/storage/v1/object/public/wedding-photos/IMG_2717.JPEG",
    "https://ikaevehccrdsfltqssch.supabase.co/storage/v1/object/public/wedding-photos/IMG_2716.JPEG",
    "https://ikaevehccrdsfltqssch.supabase.co/storage/v1/object/public/wedding-photos/IMG_2707.JPEG",
    "https://ikaevehccrdsfltqssch.supabase.co/storage/v1/object/public/wedding-photos/IMG_2684.JPEG",
    "https://ikaevehccrdsfltqssch.supabase.co/storage/v1/object/public/wedding-photos/IMG_2677.JPEG",
    "https://ikaevehccrdsfltqssch.supabase.co/storage/v1/object/public/wedding-photos/IMG_2622.JPEG",
    "https://ikaevehccrdsfltqssch.supabase.co/storage/v1/object/public/wedding-photos/IMG_2621.JPEG",
    "https://ikaevehccrdsfltqssch.supabase.co/storage/v1/object/public/wedding-photos/IMG_2218.JPEG",
  ];

  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="p-4 flex flex-col items-center text-center text-lg text-[#393939] bg">
      <div className="title-bg mb-4 text-center">
        <p className="text-3xl font-bold mb-5 text-[#cb9b8d] intro-text">婚紗精選</p>
        <img src={images.vintage2}  className="w-[180px] mb-3 max-w-lg mx-auto" alt="" />
        <p className="text-sm text-[#6d6d6d]">拜託一定要來看看!!</p>
        <p className="text-sm text-[#6d6d6d]">如果你不看的話</p>
        <p className="text-sm text-[#6d6d6d]">那你就會沒看到</p>
      </div>
     
      <div className="">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 max-w-4xl">
          {photos.map((p, i) => (
            <div
              key={i}
              className="rounded-lg overflow-hidden shadow cursor-pointer bg-white"
              onClick={() => setSelected(p)}
            >
              <img
                src={p}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <img
            src={selected}
            className="max-w-[90%] max-h-[80%] rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
