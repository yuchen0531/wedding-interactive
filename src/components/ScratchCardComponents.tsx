import { useState, useEffect, useRef } from 'react';
import { images } from "../assets/image";


type Props = {  
    width: number;
    height: number;
    children?: React.ReactNode;
    onFinish?: () => void;
    onStart?: () => void;
}
export function ScratchCard({ width, height, children, onFinish, onStart }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawing = useRef(false);
    const lastPos = useRef<{ x: number; y: number } | null>(null);
    const [done, setDone] = useState(false);

    useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = images.scratchBG;
    img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    const startDrawing = (x: number, y: number) => {
        isDrawing.current = true;
        lastPos.current = { x, y };
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (x: number, y: number) => {
        if (!isDrawing.current || !lastPos.current) return;
        ctx.lineTo(x, y);
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth = 20; // 控制刮刀寬度
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        lastPos.current = { x, y };
    };

    const endDrawing = () => {
        isDrawing.current = false;
        lastPos.current = null;

        // 判斷已刮面積
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let clearPixels = 0;
        for (let i = 0; i < imageData.data.length; i += 4) {
        if (imageData.data[i + 3] < 128) {
            clearPixels++;
        }
        }
        const percent = (clearPixels / (canvas.width * canvas.height)) * 100;
        if (percent > 70 && !done) {
        setDone(true);
        onFinish?.();
        }
    };

    const getPosition = (e: MouseEvent | TouchEvent) => {
        const rect = canvas.getBoundingClientRect();
        const clientX =
        (e as TouchEvent).touches?.[0]?.clientX || (e as MouseEvent).clientX;
        const clientY =
        (e as TouchEvent).touches?.[0]?.clientY || (e as MouseEvent).clientY;
        return {
        x: clientX - rect.left,
        y: clientY - rect.top,
        };
    };

    const handleStart = (e: MouseEvent | TouchEvent) => {
        const { x, y } = getPosition(e);
        startDrawing(x, y);
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
        const { x, y } = getPosition(e);
        draw(x, y);
        onStart?.();
    };

    const handleEnd = () => endDrawing();

    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('mouseleave', handleEnd);

    canvas.addEventListener('touchstart', handleStart);
    canvas.addEventListener('touchmove', handleMove);
    canvas.addEventListener('touchend', handleEnd);

    return () => {
        canvas.removeEventListener('mousedown', handleStart);
        canvas.removeEventListener('mousemove', handleMove);
        canvas.removeEventListener('mouseup', handleEnd);
        canvas.removeEventListener('mouseleave', handleEnd);
        canvas.removeEventListener('touchstart', handleStart);
        canvas.removeEventListener('touchmove', handleMove);
        canvas.removeEventListener('touchend', handleEnd);
    };
    }, [done]);
    return (
    <div className="relative" style={{ width, height }}>
      <div className="absolute inset-0 flex items-center justify-center z-0">
        {children}
      </div>
      {!done && (
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="absolute inset-0 z-10"
        />
      )}
    </div>
  );
}
