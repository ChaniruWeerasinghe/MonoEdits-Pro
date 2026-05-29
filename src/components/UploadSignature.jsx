import { useRef, useState } from 'react';
import { addToast } from './Notification';

const ACCEPTED = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

export default function UploadSignature({ onSigned }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file) => {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) {
      addToast('Please upload a PNG, JPG, or WebP image.', 'error');
      return;
    }
    const maxMB = 5;
    if (file.size / 1024 / 1024 > maxMB) {
      addToast(`Signature image must be under ${maxMB} MB.`, 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
      onSigned(e.target.result);
    };
    reader.onerror = () => addToast('Could not read image file.', 'error');
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const clear = () => {
    setPreview(null);
    onSigned(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-400">
        Upload a PNG or JPG of your existing signature. Use a transparent background PNG for best results.
      </p>

      {!preview ? (
        <div
          id="sig-image-dropzone"
          className={`upload-sig-zone flex flex-col items-center gap-3 py-10 px-6 text-center ${isDragging ? 'border-teal-500' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          role="button"
          tabIndex={0}
          aria-label="Upload signature image"
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(13,148,136,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <div>
            <p className="text-slate-300 font-medium text-sm">Drop signature image here</p>
            <p className="text-slate-500 text-xs mt-1">
              or <span className="text-teal-400 font-semibold">click to browse</span>
            </p>
          </div>
          <p className="text-slate-600 text-xs">PNG / JPG / WebP &mdash; up to 5 MB</p>
        </div>
      ) : (
        <div
          className="glass-subtle flex flex-col items-center gap-4 p-6"
          style={{ border: '1px solid rgba(13,148,136,0.25)' }}
        >
          <img
            src={preview}
            alt="Uploaded signature preview"
            style={{
              maxHeight: 120,
              maxWidth: '100%',
              objectFit: 'contain',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.05)',
              padding: 8,
            }}
          />
          <button id="remove-sig-image-btn" className="btn-danger" onClick={clear} type="button">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
            </svg>
            Remove
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        id="sig-image-input"
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => processFile(e.target.files?.[0])}
        style={{ display: 'none' }}
        aria-hidden="true"
      />
    </div>
  );
}
