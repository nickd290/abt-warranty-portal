import { useState, useEffect } from 'react';

interface FilePreviewProps {
  fileName: string;
  className?: string;
  onClick?: () => void;
}

export function FilePreview({ fileName, className = '', onClick }: FilePreviewProps) {
  const [error, setError] = useState(false);
  const [isPdf, setIsPdf] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Try PNG first by default, fallback to PDF on error
  const handleImageError = () => {
    console.log(`FilePreview error for ${fileName}, isPdf: ${isPdf}`);
    if (!isPdf) {
      setIsPdf(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleImageLoad = () => {
    console.log(`FilePreview loaded: ${fileName}`);
    setLoaded(true);
  };

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-white/5 border border-white/10 rounded-xl ${className}`}
      >
        <p className="text-xs text-white/40">
          {fileName} not found
        </p>
      </div>
    );
  }

  if (isPdf) {
    // PDF preview using iframe
    return (
      <div
        className={`relative overflow-hidden bg-white rounded-lg ${className} ${onClick ? 'cursor-pointer hover:opacity-90 transition' : ''}`}
        onClick={onClick}
      >
        <iframe
          src={`/${fileName}.pdf#page=1&toolbar=0&navpanes=0&scrollbar=0&view=FitH&zoom=page-fit`}
          className="w-full h-full border-0 pointer-events-none"
          title={fileName}
          onError={handleImageError}
          style={{
            transform: 'scale(1)',
            transformOrigin: 'top left',
          }}
        />
      </div>
    );
  }

  // Try PNG image first
  return (
    <div className={`relative ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl">
          <p className="text-xs text-white/40">Loading...</p>
        </div>
      )}
      <img
        src={`/${fileName}.png`}
        alt={fileName}
        className={`w-full h-full object-cover ${onClick ? 'cursor-pointer hover:opacity-90 transition' : ''} ${!loaded ? 'opacity-0' : 'opacity-100'}`}
        onClick={onClick}
        onError={handleImageError}
        onLoad={handleImageLoad}
        style={{ objectPosition: 'center' }}
      />
    </div>
  );
}

interface FullFilePreviewProps {
  fileName: string;
  className?: string;
}

export function FullFilePreview({ fileName, className = '' }: FullFilePreviewProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleError = () => {
    setError(true);
    setLoaded(true);
  };

  const handleLoad = () => {
    setLoaded(true);
  };

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-white/5 border border-white/10 rounded-xl p-12 ${className}`}>
        <p className="text-white/40">
          {fileName}.png not found
        </p>
      </div>
    );
  }

  // Show PNG image directly (fastest loading)
  return (
    <div className={`w-full h-full flex items-center justify-center bg-black ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-400 mx-auto mb-4"></div>
            <p className="text-white/60 text-sm">Loading...</p>
          </div>
        </div>
      )}
      <img
        src={`/${fileName}.png`}
        alt={fileName}
        className={`max-w-full max-h-full object-contain rounded-xl shadow-2xl transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
}
