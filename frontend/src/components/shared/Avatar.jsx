import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

function normalizeAvatarSrc(src) {
  if (!src || typeof src !== 'string') return null;
  const trimmed = src.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('data:image/')) return trimmed;
  if (trimmed.startsWith('/')) {
    return `${API_BASE_URL}${trimmed}`;
  }
  if (trimmed.startsWith('http://') && trimmed.includes('.onrender.com')) {
    return `https://${trimmed.slice(7)}`;
  }
  return trimmed;
}

/**
 * Displays a user/company photo with automatic URL normalization and graceful
 * fallback to an initial-letter badge if the image fails to load.
 */
export default function Avatar({
  src,
  alt = '',
  fallbackText = '?',
  imgClassName = 'h-9 w-9 rounded-full object-cover border border-black bg-white shrink-0',
  fallbackClassName = 'h-9 w-9 rounded-full bg-white border border-black flex items-center justify-center text-slate-900 font-extrabold text-sm shrink-0',
  fallbackNode = null,
}) {
  const [hasError, setHasError] = useState(false);
  const normalizedSrc = normalizeAvatarSrc(src);

  useEffect(() => {
    setHasError(false);
  }, [normalizedSrc]);

  if (normalizedSrc && !hasError) {
    return (
      <img
        src={normalizedSrc}
        alt={alt}
        className={imgClassName}
        onError={() => setHasError(true)}
      />
    );
  }

  if (fallbackNode) {
    return fallbackNode;
  }

  return (
    <div className={fallbackClassName}>
      {fallbackText}
    </div>
  );
}
