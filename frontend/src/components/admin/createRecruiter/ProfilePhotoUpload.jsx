import { useRef } from 'react';
import { Camera, AlertCircle } from 'lucide-react';

export default function ProfilePhotoUpload({ file, setFile, error, setError }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.size > 2 * 1024 * 1024) {
      setError("PNG, JPG up to 2MB. File size must be less than 2MB.");
      setFile(null);
      return;
    }

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type)) {
      setError("Accept only PNG and JPG/JPEG files.");
      setFile(null);
      return;
    }

    setError(null);
    setFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const clearSelection = (e) => {
    e.stopPropagation();
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-1.5 font-sans">
      <label className="text-sm font-semibold text-slate-800">Profile Photo (Optional)</label>
      
      <div 
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full border-2 border-dashed rounded-xl p-6 bg-slate-50/50 hover:bg-slate-50 transition-colors text-center cursor-pointer flex flex-col items-center justify-center min-h-[140px] focus:outline-none focus:ring-2 focus:ring-[#4A1DDF]/20 ${
          error ? 'border-red-300 bg-red-50/10' : 'border-slate-300'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".png,.jpg,.jpeg"
          className="hidden"
        />

        {file ? (
          <div className="space-y-2">
            <div className="relative inline-block">
              <img 
                src={URL.createObjectURL(file)} 
                alt="Profile Preview" 
                className="h-14 w-14 rounded-full object-cover border border-slate-200 mx-auto" 
              />
              <button 
                onClick={clearSelection}
                className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-black"
                title="Remove photo"
              >
                ✕
              </button>
            </div>
            <p className="text-xs font-bold text-slate-800 truncate max-w-xs">{file.name}</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            <div className="h-10 w-10 bg-[#4A1DDF]/10 text-[#4A1DDF] rounded-full flex items-center justify-center mx-auto mb-1 shrink-0">
              <Camera className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-slate-900">Click to upload or drag and drop</p>
            <p className="text-xs font-semibold text-slate-500">PNG, JPG up to 2MB</p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 font-semibold mt-1">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
