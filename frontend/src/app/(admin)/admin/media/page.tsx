'use client';

import { useState, useRef } from 'react';
import { Upload, Copy, Trash2, Check } from 'lucide-react';
import api from '@/lib/api/api';
import clsx from 'clsx';

interface MediaItem {
  url: string;
  key: string;
  filename: string;
}

export default function MediaPage() {
  const [uploads, setUploads] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setLoading(true);
    const newUploads: MediaItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await api.post('/media/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        newUploads.push({
          url: response.data.url,
          key: response.data.key,
          filename: response.data.filename,
        });
      } catch (error) {
        console.error('Upload failed', error);
      }
    }

    setUploads(prev => [...newUploads, ...prev]);
    setLoading(false);
  };

  const handleDelete = async (key: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      await api.delete(`/media/delete?key=${key}`);
      setUploads(prev => prev.filter(item => item.key !== key));
    } catch (error) {
      console.error('Delete failed', error);
      alert('Failed to delete image');
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Media Gallery</h1>

      <div
        className={clsx(
          "border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center transition-colors cursor-pointer",
          dragActive ? "border-indigo-500 bg-indigo-500/10" : "border-slate-700 bg-slate-900 hover:border-slate-600"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
        <Upload className="h-10 w-10 text-slate-400 mb-4" />
        <p className="text-slate-300 font-medium">Drag & drop images here, or click to select</p>
        <p className="text-sm text-slate-500 mt-2">Supports JPG, PNG, WEBP</p>
        {loading && <p className="text-indigo-400 mt-4 animate-pulse">Uploading...</p>}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Session Uploads</h2>
        {uploads.length === 0 ? (
            <p className="text-slate-500">No images uploaded in this session.</p>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploads.map((item) => (
                <div key={item.key} className="group relative bg-slate-900 rounded-lg overflow-hidden border border-slate-800 aspect-square">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={item.url}
                    alt={item.filename}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                    onClick={() => copyToClipboard(item.url)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                    title="Copy URL"
                    >
                    {copied === item.url ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                    <button
                    onClick={() => handleDelete(item.key)}
                    className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors"
                    title="Delete"
                    >
                    <Trash2 size={18} />
                    </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 text-xs text-slate-200 truncate">
                    {item.filename}
                </div>
                </div>
            ))}
            </div>
        )}
      </div>
      
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-200 text-sm">
        Note: The backend currently does not support listing previously uploaded files. Only files uploaded in this session are shown here.
      </div>
    </div>
  );
}
