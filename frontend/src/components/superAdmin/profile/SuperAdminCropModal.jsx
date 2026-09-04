import { useState, useRef, useEffect, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Check, Upload } from 'lucide-react';

export default function SuperAdminCropModal({ imageSrc, onCropComplete, onClose }) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const modalRef = useRef(null);
  const cancelButtonRef = useRef(null);

  // Draw canvas image with zoom and position offsets
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    const size = 280;
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

    // Calculate scale preserving aspect ratio
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

  // Focus trap & Escape key
  useEffect(() => {
    setTimeout(() => cancelButtonRef.current?.focus(), 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 select-none font-sans animate-fadeIn">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Crop profile photo"
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden animate-scaleUp"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
              <Upload className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 leading-tight">Crop Profile Photo</h3>
              <p className="text-[11px] font-semibold text-slate-500">Reposition and adjust zoom before applying</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close crop modal"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Workspace */}
        <div className="p-6 flex flex-col items-center">
          {/* Canvas Preview Box */}
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="relative w-[260px] h-[260px] rounded-full border-4 border-teal-600 shadow-inner bg-slate-100 flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden ring-4 ring-teal-50"
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
                className="w-full accent-teal-600 cursor-pointer"
                aria-label="Zoom slider"
              />
              <ZoomIn className="h-4 w-4 text-slate-400" />
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-extrabold text-teal-600 hover:text-teal-800 flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-teal-50 transition-colors cursor-pointer"
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
            ref={cancelButtonRef}
            type="button"
            onClick={onClose}
            className="px-4.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer min-h-[44px]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 flex items-center gap-1.5 transition-colors cursor-pointer min-h-[44px]"
          >
            <Check className="h-4 w-4" />
            <span>Apply Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
