import React, { useState, useEffect, useRef } from 'react';
import { X, RotateCcw, RotateCw } from 'lucide-react';

export default function ImageCropModal({ isOpen, imageSrc, onClose, onSave }) {
  if (!isOpen || !imageSrc) return null;

  const [zoom, setZoom] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  // Panning/Dragging offsets
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // Load image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      imageRef.current = img;
      drawCanvas();
    };
  }, [imageSrc, zoom, rotate, flipH, flipV, offset]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    // Translate to center of canvas for rotation and zooming
    ctx.translate(canvas.width / 2 + offset.x, canvas.height / 2 + offset.y);

    // Apply scale and flips
    ctx.scale(zoom * (flipH ? -1 : 1), zoom * (flipV ? -1 : 1));

    // Apply rotation (in radians)
    ctx.rotate((rotate * Math.PI) / 180);

    // Draw the image centered
    const w = img.width;
    const h = img.height;
    const minSide = Math.min(w, h);
    
    // Scale image down to fit inside the canvas center nicely
    const drawScale = 220 / minSide;
    const dw = w * drawScale;
    const dh = h * drawScale;

    ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
    ctx.restore();
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch Support for Mobile
  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    const touch = e.touches[0];
    dragStart.current = { x: touch.clientX - offset.x, y: touch.clientY - offset.y };
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setOffset({
      x: touch.clientX - dragStart.current.x,
      y: touch.clientY - dragStart.current.y
    });
  };

  const handleSave = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');

    // Make circle clip mask on target output canvas
    ctx.beginPath();
    ctx.arc(150, 150, 150, 0, 2 * Math.PI);
    ctx.clip();

    ctx.save();
    // Replicate translate, zoom, flips, and rotates on the cropped final canvas
    ctx.translate(150 + offset.x, 150 + offset.y);
    ctx.scale(zoom * (flipH ? -1 : 1), zoom * (flipV ? -1 : 1));
    ctx.rotate((rotate * Math.PI) / 180);

    const img = imageRef.current;
    if (img) {
      const minSide = Math.min(img.width, img.height);
      const drawScale = 220 / minSide;
      const dw = img.width * drawScale;
      const dh = img.height * drawScale;
      ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
    }
    ctx.restore();

    const croppedBase64 = canvas.toDataURL('image/jpeg');
    onSave(croppedBase64);
  };

  return (
    <div className="fixed inset-0 bg-[#090d16]/90 backdrop-blur-xs flex items-center justify-center p-4 z-[80] animate-fadeIn text-slate-200">
      <div className="bg-[#1d2226] rounded-2xl w-full max-w-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col md:flex-row h-[500px]">
        
        {/* Left Side: Preview canvas area with crop mask overlay */}
        <div className="flex-grow bg-[#14181b] relative flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-700">
          
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 p-2 bg-[#2b3137] hover:bg-[#383f47] rounded-full transition-colors z-20 text-slate-300 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <span className="absolute top-4 right-6 text-base font-semibold text-slate-300">Edit image</span>

          {/* Canvas wrap container with mouse & touch event listeners for panning */}
          <div 
            className="relative w-[300px] h-[300px] rounded-full overflow-hidden border-4 border-slate-600 bg-[#1d2226] flex items-center justify-center cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
            <canvas 
              ref={canvasRef} 
              width={300} 
              height={300}
              className="pointer-events-none select-none"
            />
            {/* Circle overlay highlight helper */}
            <div className="absolute inset-0 pointer-events-none border border-white/25 rounded-full"></div>
          </div>
        </div>

        {/* Right Side: Tab configurations & zoom controls */}
        <div className="w-full md:w-80 p-6 flex flex-col justify-between bg-[#1d2226] text-left">
          <div className="flex flex-col gap-6">
            
            {/* Header Tabs: Crop */}
            <div className="flex border-b border-slate-700 text-xs font-black uppercase tracking-wider pb-0">
              <button
                type="button"
                className="flex-grow text-center pb-2.5 border-b-2 border-[#0a66c2] text-white font-black"
              >
                Crop
              </button>
            </div>

            {/* Transformations Row Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setRotate(r => r - 90)}
                className="p-2.5 bg-[#2b3137] hover:bg-[#383f47] rounded-xl text-slate-300 transition-colors cursor-pointer"
                title="Rotate Left"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setRotate(r => r + 90)}
                className="p-2.5 bg-[#2b3137] hover:bg-[#383f47] rounded-xl text-slate-300 transition-colors cursor-pointer"
                title="Rotate Right"
              >
                <RotateCw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setFlipH(!flipH)}
                className="p-2.5 bg-[#2b3137] hover:bg-[#383f47] rounded-xl text-slate-300 transition-colors text-[10px] font-black cursor-pointer"
                title="Flip Horizontal"
              >
                Flip H
              </button>
              <button
                type="button"
                onClick={() => setFlipV(!flipV)}
                className="p-2.5 bg-[#2b3137] hover:bg-[#383f47] rounded-xl text-slate-300 transition-colors text-[10px] font-black cursor-pointer"
                title="Flip Vertical"
              >
                Flip V
              </button>
            </div>

            {/* Sliders Area */}
            <div className="flex flex-col gap-4">
              {/* Zoom Slider */}
              <div>
                <label className="text-sm font-black text-slate-300 uppercase tracking-wider block mb-1.5">Zoom</label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0a66c2]"
                />
              </div>

              {/* Rotate Slider */}
              <div>
                <label className="text-sm font-black text-slate-300 uppercase tracking-wider block mb-1.5">Rotate</label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={rotate}
                  onChange={(e) => setRotate(parseInt(e.target.value))}
                  className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0a66c2]"
                />
              </div>
            </div>

          </div>

          {/* Action buttons row footer */}
          <div className="flex items-center gap-3 justify-end pt-4 border-t border-slate-700 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-600 text-slate-400 hover:text-slate-200 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 bg-[#0a66c2] hover:bg-[#004182] text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Save changes
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
