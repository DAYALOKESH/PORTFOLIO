import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import api from '@/lib/api/api';
import clsx from 'clsx';

interface ImageUploaderProps {
  value?: string | null;
  onChange: (url: string) => void;
  className?: string;
}

export default function ImageUploader({ value, onChange, className }: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Assuming response.data.url or similar. Adjust based on actual API response.
      // If the API returns { filename: "..." }, construct the URL.
      // For now assuming full URL is returned or can be constructed.
      // Let's assume response.data.url
      onChange(response.data.url); 
    } catch (err) {
      console.error('Upload failed', err);
      setError('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={clsx('w-full', className)}>
      <div className="flex flex-col gap-2">
        {value ? (
          <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-slate-700 bg-slate-900 group">
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={clearImage}
              type="button"
              className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div
            onClick={() => inputRef.current?.click()}
            className={clsx(
              "border-2 border-dashed border-slate-700 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-500/5 transition-colors aspect-video bg-slate-900",
              loading && "opacity-50 cursor-not-allowed"
            )}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
            ) : (
              <>
                <Upload className="h-8 w-8 text-slate-400 mb-2" />
                <p className="text-sm text-slate-400 font-medium">Click to upload image</p>
              </>
            )}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
          disabled={loading}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}
