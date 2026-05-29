import { useRef, useState, useCallback } from 'react';
import { addToast } from './Notification';

const MAX_FILE_SIZE_MB = 50;

export default function PDFUploader({ onFileLoaded }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback((file) => {
    if (!file) return;

    if (file.type !== 'application/pdf') {
      addToast('Only PDF files are accepted.', 'error');
      return;
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_FILE_SIZE_MB) {
      addToast(`File too large. Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`, 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onFileLoaded({ bytes: e.target.result, name: file.name });
      addToast(`"${file.name}" loaded successfully.`, 'success');
    };
    reader.onerror = () => addToast('Failed to read the file. Please try again.', 'error');
    reader.readAsArrayBuffer(file);
  }, [onFileLoaded]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  }, [processFile]);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleInputChange = (e) => processFile(e.target.files?.[0]);

  return (
    <div className="animate-fadeup flex flex-col items-center gap-8 w-full max-w-xl mx-auto">
      {/* Icon */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div
          style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(13,148,136,0.2), rgba(13,148,136,0.05))',
            border: '1px solid rgba(13,148,136,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="12" y1="18" x2="12" y2="12" />
            <line x1="9" y1="15" x2="15" y2="15" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Upload your PDF</h2>
          <p className="text-sm text-slate-400 mt-1">
            Your file never leaves your device — processed entirely in the browser.
          </p>
        </div>
      </div>

      {/* Drop zone */}
      <div
        id="pdf-dropzone"
        className={`drop-zone w-full p-12 flex flex-col items-center gap-4 ${isDragging ? 'dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Drop PDF here or click to browse"
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(13,148,136,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 16 12 12 8 16" />
          <line x1="12" y1="12" x2="12" y2="21" />
          <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
        </svg>

        <div className="text-center">
          <p className="text-slate-300 font-medium">
            Drag & drop your PDF here
          </p>
          <p className="text-slate-500 text-sm mt-1">
            or <span className="text-teal-400 font-semibold">click to browse</span>
          </p>
        </div>

        <div
          style={{
            padding: '6px 16px',
            borderRadius: 8,
            background: 'rgba(13,148,136,0.08)',
            border: '1px solid rgba(13,148,136,0.2)',
            fontSize: '0.75rem',
            color: '#64748b',
          }}
        >
          PDF files only &mdash; up to {MAX_FILE_SIZE_MB} MB
        </div>

        <input
          ref={inputRef}
          id="pdf-file-input"
          type="file"
          accept="application/pdf"
          onChange={handleInputChange}
          style={{ display: 'none' }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
