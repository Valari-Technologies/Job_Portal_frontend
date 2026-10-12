import { useState, useRef, useEffect, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw, Check, Upload, Maximize2, Minimize2 } from 'lucide-react';

export default function ImageCropModal({ imageSrc, onCropComplete, onClose }) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mode, setMode] = useState('fit'); // 'fit' (fits whole logo) or 'fill' (covers circle)
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const modalRef = useRef(null);
  const previewBoxSize = 280; // CSS display size in px

  // Draw canvas image with zoom and position offsets
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    const size = 400; // High resolution output 400x400
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);

    // Save context state
    ctx.save();

    // Create circular clipping path
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();

    // Clean white background inside circle
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    // Calculate aspect ratio scale
    let baseScale;
    if (mode === 'fit') {
      // Ensure all 4 corners fit safely inside the circle with safety margin
      const diagonal = Math.hypot(img.width, img.height);
      baseScale = (size * 0.90) / (diagonal || size);
    } else {
      // Cover the entire circle
      baseScale = Math.max(size / img.width, size / img.height);
    }

    const scale = baseScale * zoom;
    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;

    // Scale display dragging offset (280px) to canvas internal size (400px)
    const posScale = size / previewBoxSize;
    const drawX = (size - drawWidth) / 2 + position.x * posScale;
    const drawY = (size - drawHeight) / 2 + position.y * posScale;

    // High quality smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

    ctx.restore();
  }, [zoom, position, mode]);

  // Load Image ONLY when imageSrc changes
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => {
      imgRef.current = img;
      // If rectangular (aspect ratio not square), default to 'fit' so logos fit completely!
      const isRectangular = Math.abs(img.width - img.height) / Math.max(img.width, img.height) > 0.12;
      setMode(isRectangular ? 'fit' : 'fill');
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    };
  }, [imageSrc]);

  // Redraw canvas whenever zoom, position, mode changes
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Handle Drag Start
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    }
  };

  // Window-level mouse move and up for smooth uninterrupted dragging
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        setPosition({
          x: touch.clientX - dragStart.x,
          y: touch.clientY - dragStart.y
        });
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, dragStart]);

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
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      if (blob) {
        onCropComplete?.(blob, dataUrl);
      } else {
        onCropComplete?.(dataUrl, dataUrl);
      }
      onClose?.();
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 select-none font-sans">
      <div
        ref={modalRef}
        role="dialog"
        aria-label="Crop profile photo"
        className="bg-white rounded-3xl border border-slate-150 shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-slate-900" />
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
          {/* Quick Fit Mode Toggle */}
          <div className="flex items-center justify-center gap-2 mb-4 w-full">
            <button
              type="button"
              onClick={() => { setMode('fit'); setZoom(1); setPosition({ x: 0, y: 0 }); }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mode === 'fit'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Minimize2 className="h-3.5 w-3.5" />
              <span>Fit Entire Logo</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('fill'); setZoom(1); setPosition({ x: 0, y: 0 }); }}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                mode === 'fill'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>Fill Circle</span>
            </button>
          </div>

          {/* Canvas Preview Box */}
          <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            style={{ width: `${previewBoxSize}px`, height: `${previewBoxSize}px` }}
            className="relative rounded-full border-2 border-black shadow-inner bg-white flex items-center justify-center cursor-grab active:cursor-grabbing overflow-hidden"
          >
            <canvas ref={canvasRef} className="w-full h-full pointer-events-none" />
          </div>

          <p className="text-[11px] font-bold text-slate-400 mt-2 text-center">
            Drag to reposition &bull; Adjust zoom below
          </p>

          {/* Controls: Zoom & Reset */}
          <div className="w-full mt-4 space-y-3 px-2">
            <div className="flex items-center justify-between gap-3">
              <ZoomOut className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="range"
                min="0.3"
                max="2.5"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-slate-900 cursor-pointer"
              />
              <ZoomIn className="h-4 w-4 text-slate-400 shrink-0" />
              <span className="text-xs font-black text-slate-700 min-w-[42px] text-right">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-extrabold text-slate-700 hover:text-black flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
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
            className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-slate-900 hover:bg-black shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Check className="h-4 w-4" />
            <span>Apply Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
}
