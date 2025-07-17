import { useEffect, useState } from 'react';

export function LoadingImageSquare({ createdAt }: { createdAt: number }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((Date.now() - createdAt) / 1000);
    }, 100);
    return () => clearInterval(interval);
  }, [createdAt]);

  return (
    <div className="relative w-48 h-32 bg-muted flex items-center justify-center rounded-lg animate-pulse">
      {/* Loader icon (simple spinner) */}
      <svg className="animate-spin h-8 w-8 text-gray-400" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      {/* Timer in bottom right */}
      <span className="absolute bottom-2 right-3 text-xs text-gray-500 bg-white/70 px-1 rounded">
        {elapsed.toFixed(1)}s
      </span>
    </div>
  );
}
