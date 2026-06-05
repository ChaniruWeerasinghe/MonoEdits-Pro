import React, { useState } from 'react';
import { usePDFRenderer } from '../hooks/usePDFRenderer';

function PDFThumbnail({ pdfBytes }) {
  const { canvasRef, isRendering } = usePDFRenderer(pdfBytes);
  
  return (
    <div className="w-full h-full relative bg-slate-800">
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} 
        className="block"
      />
      {isRendering && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80 backdrop-blur-sm">
          <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

export default function MergeList({ files, onUpdateFiles, onRemove }) {
  const [draggedIdx, setDraggedIdx] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      e.target.style.opacity = '0.4';
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedIdx(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === index) return;
    
    const newFiles = [...files];
    const draggedFile = newFiles[draggedIdx];
    newFiles.splice(draggedIdx, 1);
    newFiles.splice(index, 0, draggedFile);
    onUpdateFiles(newFiles);
    setDraggedIdx(index);
  };

  if (!files || files.length === 0) return null;

  return (
    <div className="w-full animate-fadeup">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {files.map((file, index) => (
          <div 
            key={file.id} 
            draggable 
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            className="relative overflow-hidden rounded-[24px] border transition-transform flex flex-col justify-end"
            style={{ 
              borderColor: draggedIdx === index ? '#2dd4bf' : 'rgba(255,255,255,0.05)', 
              cursor: 'grab',
              aspectRatio: '3/4',
              transform: draggedIdx === index ? 'scale(1.02)' : 'scale(1)',
              boxShadow: draggedIdx === index ? '0 20px 40px rgba(13,148,136,0.15)' : '0 10px 30px rgba(0,0,0,0.5)',
              backgroundColor: '#0f172a'
            }}
          >
            {/* The Image (Thumbnail) */}
            <div className="absolute inset-0 pointer-events-none">
              <PDFThumbnail pdfBytes={file.bytes} />
            </div>

            {/* Number Badge at Top Left */}
            <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-sm font-bold text-white z-20 shadow-lg">
              {index + 1}
            </div>

            {/* Dark Gradient Overlay (covers bottom 60%) */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/90 to-transparent pointer-events-none z-10 h-[60%] top-auto" />

            {/* Content Area */}
            <div className="relative z-20 p-5 flex flex-col gap-3">
              <div className="pointer-events-none">
                <h3 className="text-white font-bold text-lg leading-tight truncate" title={file.name}>
                  {file.name}
                </h3>
                <p className="text-slate-300 text-sm mt-1 line-clamp-2">
                  Ready to be merged. Drag to reorder.
                </p>
              </div>
              
              <div className="flex items-center gap-2 pointer-events-none">
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-semibold backdrop-blur-md">
                  PDF
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-semibold backdrop-blur-md">
                  {file.size / 1024 / 1024 < 1 
                    ? (file.size / 1024).toFixed(0) + ' KB' 
                    : (file.size / 1024 / 1024).toFixed(2) + ' MB'}
                </span>
              </div>
              
              {/* White Button */}
              <button
                onClick={(e) => { 
                  e.stopPropagation(); 
                  const url = URL.createObjectURL(file.file);
                  window.open(url, '_blank');
                  setTimeout(() => URL.revokeObjectURL(url), 1000);
                }}
                className="mt-1 w-full py-2.5 rounded-full bg-white text-slate-900 font-bold text-sm hover:bg-slate-200 hover:scale-[1.02] active:scale-95 transition-all pointer-events-auto"
              >
                Open Preview
              </button>
            </div>
          </div>
        ))}
        
        {/* Dropzone/Add More Card - Styled to match the aesthetic */}
        <label
          className="relative overflow-hidden rounded-[24px] border border-dashed transition-all cursor-pointer group flex flex-col items-center justify-center"
          style={{ 
            borderColor: 'rgba(13,148,136,0.3)', 
            aspectRatio: '3/4',
            backgroundColor: 'rgba(15, 23, 42, 0.4)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-teal-500/10 text-teal-400 group-hover:bg-teal-500 group-hover:text-white transition-colors shadow-lg">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <p className="text-slate-300 font-bold text-base group-hover:text-white transition-colors">Add More</p>
          </div>

          <input
            type="file"
            accept="application/pdf"
            multiple
            className="hidden"
            onChange={(e) => {
              const filesList = Array.from(e.target.files);
              if (filesList.length > 0) {
                Promise.all(filesList.map(async (f) => ({
                  id: crypto.randomUUID(),
                  file: f,
                  name: f.name,
                  size: f.size,
                  bytes: await f.arrayBuffer()
                }))).then(newFiles => {
                  onUpdateFiles([...files, ...newFiles]);
                });
              }
              e.target.value = '';
            }}
          />
        </label>
      </div>
    </div>
  );
}
