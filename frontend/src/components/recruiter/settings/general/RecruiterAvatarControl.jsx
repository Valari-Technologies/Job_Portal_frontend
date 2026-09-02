import { useRef, useEffect } from 'react';
import { User } from 'lucide-react';

export default function RecruiterAvatarControl({ avatarUrl, onAvatarChange, onAvatarRemove }) {
  const fileInputRef = useRef(null);

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (avatarUrl && avatarUrl.startsWith('blob:')) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [avatarUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('File size exceeds 1MB max limit.');
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      onAvatarChange(file, previewUrl);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="h-16 w-16 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Account Profile Avatar" className="h-full w-full object-cover" />
        ) : (
          <User className="h-8 w-8 text-slate-400" />
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-black cursor-pointer hover:bg-indigo-100 transition-colors"
          >
            Change Avatar
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          {avatarUrl && (
            <button
              type="button"
              onClick={onAvatarRemove}
              className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
            >
              Remove
            </button>
          )}
        </div>
        <p className="text-[11px] font-bold text-slate-400">JPG, GIF or PNG. 1MB max.</p>
      </div>
    </div>
  );
}
