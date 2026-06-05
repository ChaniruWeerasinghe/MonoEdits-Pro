import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MultiPDFUploader from '../components/MultiPDFUploader';
import MergeList from '../components/MergeList';
import Notification, { addToast } from '../components/Notification';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { mergeMultiplePDFs } from '../utils/mergePDFsLogic';

export default function MergeTool() {
  const navigate = useNavigate();
  const [pdfFiles, setPdfFiles]           = useState([]);
  const [isGenerating, setIsGenerating]   = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [mergedPdfBytes, setMergedPdfBytes] = useState(null);

  const resetEditor = useCallback(() => {
    setPdfFiles([]);
    setMergedPdfBytes(null); setDownloadReady(false);
    setIsGenerating(false);
  }, []);

  const goHome = useCallback(() => { 
    navigate('/');
  }, [navigate]);

  const handleFilesLoaded = useCallback((newFiles) => {
    setPdfFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const handleRemoveFile = useCallback((id) => {
    setPdfFiles((prev) => prev.filter(f => f.id !== id));
  }, []);

  const handleMergeConfirm = useCallback(async () => {
    if (pdfFiles.length < 2) { 
      addToast('Please upload at least 2 PDF files to merge.', 'error'); 
      return; 
    }
    setIsGenerating(true);
    try {
      const result = await mergeMultiplePDFs(pdfFiles);
      setMergedPdfBytes(result); setDownloadReady(true);
      addToast('PDFs merged successfully!', 'success', 5000);
    } catch (err) {
      addToast(`Merge failed: ${err.message}`, 'error');
    } finally { setIsGenerating(false); }
  }, [pdfFiles]);

  const handleDownload = () => {
    if (!mergedPdfBytes) return;
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([mergedPdfBytes], { type: 'application/pdf' })),
      download: `Merged-Document.pdf`,
    });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    addToast('Download started.', 'success');
  };

  const totalSizeMB = pdfFiles.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024);

  return (
    <div className="app-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Notification />
      <Header />

      <main className="site-container" style={{ paddingTop: 120, paddingBottom: 80, flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Workspace Title Area */}
        <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">Merge PDFs</h1>
            <p className="text-slate-400 mt-2 text-sm md:text-base">Combine and reorder multiple documents into a single file locally.</p>
          </div>
          
          {pdfFiles.length > 0 && !downloadReady && !isGenerating && (
            <div className="flex items-center justify-center md:justify-end gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-slate-300 font-semibold">{pdfFiles.length} files selected</p>
                <p className="text-slate-500 text-xs">Total size: {totalSizeMB.toFixed(2)} MB</p>
              </div>
              <button 
                className="btn-primary" 
                onClick={handleMergeConfirm}
                disabled={pdfFiles.length < 2}
                style={{ padding: '12px 24px' }}
              >
                Merge Files
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 flex flex-col">
          {pdfFiles.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center w-full animate-fadeup mt-10">
              <MultiPDFUploader onFilesLoaded={handleFilesLoaded} />
            </div>
          ) : isGenerating ? (
            <div className="animate-fadeup flex flex-col items-center justify-center gap-8 text-center flex-1 my-20">
              <div style={{ width: 80, height: 80, borderRadius: '50%', border: '4px solid rgba(13,148,136,0.15)', borderTopColor: '#0d9488', animation: 'spin 0.9s linear infinite' }} />
              <div>
                <h2 className="text-2xl font-bold text-slate-100">Merging your PDFs…</h2>
                <p className="text-slate-400 mt-2">Stitching {pdfFiles.length} files together locally.</p>
              </div>
            </div>
          ) : downloadReady ? (
            <div className="animate-fadeup flex flex-col items-center justify-center gap-8 text-center flex-1 my-20">
              <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'rgba(13,148,136,0.1)', border: '2px solid rgba(13,148,136,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(13,148,136,0.2)' }}>
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-100">Merge Complete!</h2>
                <p className="text-slate-400 text-sm mt-2 max-w-md mx-auto">Your {pdfFiles.length} files have been successfully combined into a single document.</p>
              </div>
              <div className="glass-subtle px-6 py-4 flex items-center gap-5 w-full max-w-md" style={{ border: '1px solid rgba(13,148,136,0.3)', borderRadius: 16 }}>
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div className="text-left flex-1 overflow-hidden">
                  <p className="text-slate-200 font-semibold text-sm truncate">Merged-Document.pdf</p>
                  <p className="text-slate-500 text-xs mt-1">{mergedPdfBytes ? `${(mergedPdfBytes.byteLength / 1024 / 1024).toFixed(2)} MB` : '—'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6 max-w-md w-full mx-auto">
                <button className="btn-primary flex items-center justify-center gap-2" onClick={handleDownload} style={{ padding: '14px 16px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download File
                </button>
                <button 
                  className="btn-secondary flex items-center justify-center gap-2" 
                  onClick={() => {
                    if (!mergedPdfBytes) return;
                    const url = URL.createObjectURL(new Blob([mergedPdfBytes], { type: 'application/pdf' }));
                    window.open(url, '_blank');
                    setTimeout(() => URL.revokeObjectURL(url), 1000);
                  }} 
                  style={{ padding: '14px 16px' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  Open Preview
                </button>
                <button className="btn-secondary col-span-2 flex items-center justify-center" onClick={resetEditor} style={{ padding: '14px 16px' }}>
                  Start New Merge
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-fadeup w-full">
              <div className="bg-slate-800/20 border border-slate-700/50 rounded-2xl p-6 md:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-200">Reorder Pages</h3>
                  <p className="text-sm text-slate-400">Drag to rearrange the sequence</p>
                </div>
                <MergeList 
                  files={pdfFiles} 
                  onUpdateFiles={setPdfFiles}
                  onRemove={handleRemoveFile} 
                />
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
