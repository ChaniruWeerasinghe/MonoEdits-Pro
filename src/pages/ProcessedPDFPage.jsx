import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Notification, { addToast } from '../components/Notification';
import { usePDFRenderer } from '../hooks/usePDFRenderer';

export default function ProcessedPDFPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pdfBytes, filename } = location.state || {};

  const [isProcessing, setIsProcessing] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);

  const { canvasRef, pageIndex, totalPages, goNext, goPrev, isRendering } = usePDFRenderer(pdfBytes);

  useEffect(() => {
    if (!pdfBytes) {
      navigate('/forms');
      return;
    }

    // Create a Blob URL for previewing in a new tab
    const url = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
    setPdfUrl(url);

    const timer = setTimeout(() => {
      setIsProcessing(false);
      addToast('Document successfully processed.', 'success');
    }, 1500);
    
    return () => {
      clearTimeout(timer);
      URL.revokeObjectURL(url);
    };
  }, [pdfBytes, navigate]);

  const handleDownload = useCallback(() => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `Completed_${filename || 'document.pdf'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    addToast('Download started successfully.', 'success');
  }, [pdfUrl, filename]);

  if (!pdfBytes) return null;

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-slate-50 dark:bg-[#070b14] relative">
      <Notification />

      {/* Processing Overlay (covers the screen while loading) */}
      {isProcessing && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 dark:bg-[#070b14] animate-fadein">
           <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-slate-200 dark:border-slate-800 border-t-teal-500 rounded-full animate-spin mb-8 shadow-lg"></div>
           <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">Processing Document</h2>
           <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Finalizing fields and locking your PDF...</p>
        </div>
      )}

      {/* Main Content (Always rendered so canvasRef mounts properly) */}
      <div className={`flex-1 flex flex-col w-full h-full relative min-h-0 ${isProcessing ? 'opacity-0 pointer-events-none' : 'animate-fadein'}`}>
         
         {/* Top Bar Floating */}
         <div className="absolute top-0 left-0 w-full p-4 md:p-6 flex items-center justify-between z-30 pointer-events-none">
            <div className="pointer-events-auto">
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white drop-shadow-md">{filename}</h1>
              <p className="text-teal-600 dark:text-teal-400 text-xs md:text-sm mt-1 uppercase tracking-wider font-bold drop-shadow-md">Final Document Ready</p>
            </div>
            <button 
              onClick={() => navigate('/forms')} 
              className="pointer-events-auto px-4 py-2 rounded-full text-xs md:text-sm font-bold bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-lg"
            >
              Back to Editor
            </button>
         </div>

         {/* PDF Canvas area */}
         <div className="flex-1 relative flex items-center justify-center w-full h-full p-4 pt-24 pb-28 md:p-12 md:pt-28 md:pb-32 overflow-hidden">
            <canvas 
                ref={canvasRef} 
                className={`shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] rounded-sm bg-white transition-opacity duration-200 max-w-full max-h-full object-contain ${isRendering ? 'opacity-50' : 'opacity-100'}`}
            />
            {isRendering && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                   <div className="w-8 h-8 md:w-10 md:h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin drop-shadow-lg" />
                </div>
            )}
         </div>

         {/* Bottom Bar Floating */}
         <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col md:flex-row items-center justify-center gap-4 z-30 pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-3 md:gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 p-2 md:p-3 rounded-[2rem] shadow-2xl flex-wrap justify-center">
                
                {totalPages > 1 && (
                   <div className="flex items-center gap-1 px-3 border-r border-slate-300 dark:border-slate-700">
                      <button className="p-1.5 md:p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors" onClick={goPrev} disabled={pageIndex === 0}>
                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                      </button>
                      <span className="text-[11px] md:text-xs font-extrabold text-slate-700 dark:text-slate-200 w-10 md:w-12 text-center tracking-widest select-none">{pageIndex + 1}/{totalPages}</span>
                      <button className="p-1.5 md:p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors" onClick={goNext} disabled={pageIndex === totalPages - 1}>
                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                      </button>
                   </div>
                )}

                <a 
                   href={pdfUrl}
                   target="_blank"
                   rel="noreferrer"
                   className="px-4 md:px-6 py-2.5 md:py-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs md:text-sm transition-colors flex items-center gap-2"
                >
                   Preview in New Tab
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>

                <button 
                   onClick={handleDownload}
                   className="px-6 md:px-8 py-2.5 md:py-3 rounded-full bg-teal-500 hover:bg-teal-400 text-white dark:text-slate-900 font-extrabold text-xs md:text-sm transition-colors shadow-[0_0_20px_rgba(20,184,166,0.3)] flex items-center gap-2"
                >
                   Download PDF
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </button>
            </div>
         </div>
      </div>
    </div>
  );
}
