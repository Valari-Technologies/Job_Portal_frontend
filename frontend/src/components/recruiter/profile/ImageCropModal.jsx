import { useState, useRef, useEffect, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Check, Upload } from 'lucide-react';

export default function ImageCropModal({ imageSrc, onCropComplete, onClose }) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const modalRef = useRef(null);

  // Draw canvas image with zoom and position offsets
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    const size = 300;
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);

    // Save context state
    ctx.save();

    // Create circular clipping path
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();

    // Draw background
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, size, size);

    // Calculate aspect ratio scale
    const scale = Math.max(size / img.width, size / img.height) * zoom;
    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;

    const drawX = (size - drawWidth) / 2 + position.x;
    const drawY = (size - drawHeight) / 2 + position.y;

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

    ctx.restore();
  }, [zoom, position]);

  // Load Image
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      imgRef.current = img;
      drawCanvas();
    };
  }, [imageSrc, drawCanvas]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Handle Drag Start
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Keyboard Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) {
        onCropComplete?.(blob);
      }
      onClose?.();
    }, 'image/png');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 select-none font-sans">
      <div
        ref={modalRef}
        role="dialog"
        aria-label="Crop profile photo"
        className="bg-white rounded-3xl border border-slate-150 shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-indigo-600" />
            <h3 className="text-base font-extrabold text-slate-900">Crop Profile Photo</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body / Workspace */}
        <div className="p-6 flex flex-col items-center">
          <p className="text-xs font-bold text-slate-500 mb-4 text-center">
            Drag to reposition and use the zoom slider to adjust your profile picture.
          </p>

          {/* Canvas Preview Box */}
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="relative w-[280px] h-[280px] rounded-full border-4 border-indigo-600 shadow-inner bg-slate-100 flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden"
          >
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>

          {/* Controls: Zoom & Reset */}
          <div className="w-full mt-6 space-y-4 px-2">
            <div className="flex items-center justify-between gap-3">
              <ZoomOut className="h-4 w-4 text-slate-400" />
              <input
                type="range"
                min="1"
                max="2.5"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <ZoomIn className="h-4 w-4 text-slate-400" />
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-extrabold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-indigo-50 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset View</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-150 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Check className="h-4 w-4" />
            <span>Apply Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
