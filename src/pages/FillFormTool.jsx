import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import PDFUploader from '../components/PDFUploader';
import Notification, { addToast } from '../components/Notification';
import { usePDFRenderer } from '../hooks/usePDFRenderer';
import { extractPdfFields, fillPdfFields } from '../utils/fillFormLogic';
import DynamicPDFForm from '../components/DynamicPDFForm';

export default function FillFormTool() {
  const navigate = useNavigate();
  const [pdfBytes, setPdfBytes] = useState(null);
  const [filename, setFilename] = useState('');
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { canvasRef, pageIndex, totalPages, goNext, goPrev, isRendering } = usePDFRenderer(pdfBytes);

  const handleFileLoaded = useCallback(async ({ bytes, name }) => {
    setIsProcessing(true);
    try {
      const extractedFields = await extractPdfFields(bytes);
      setFields(extractedFields);
      
      const initialData = {};
      extractedFields.forEach(f => { initialData[f.name] = f.value; });
      setFormData(initialData);
      
      setPdfBytes(bytes);
      setFilename(name);
      if (extractedFields.length === 0) {
        addToast('No interactive form fields found.', 'warning');
      } else {
        addToast(`Found ${extractedFields.length} interactive fields.`, 'success');
      }
    } catch (err) {
      addToast('Failed to read PDF form fields.', 'error');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleFieldChange = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleApply = async () => {
    setIsProcessing(true);
    try {
      const filledBytes = await fillPdfFields(pdfBytes, formData);
      navigate('/forms/preview', { state: { pdfBytes: filledBytes, filename } });
    } catch (err) {
      addToast('Failed to process document.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div 
      className={`flex flex-col ${pdfBytes ? "h-[100dvh] overflow-hidden bg-slate-50 dark:bg-[#070b14]" : "app-bg min-h-screen"}`}
    >
      <Notification />
      {!pdfBytes && <Header />}

      <main className={`flex-1 flex flex-col w-full mx-auto ${pdfBytes ? 'h-full overflow-hidden' : 'pt-20 pb-10'}`}>
        {!pdfBytes ? (
          <div className="site-container flex-1 flex flex-col items-center justify-center animate-fadeup overflow-y-auto w-full">
            <div className="mb-8 md:mb-10 text-center px-4">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Fill PDF Forms</h1>
            </div>
            <PDFUploader onFileLoaded={handleFileLoaded} />
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row w-full h-full overflow-hidden relative">
            
            {/* Left Side: Document Preview (Flexible layout instead of fixed vh) */}
            <div 
              className="w-full md:w-1/2 flex-1 md:h-full flex flex-col border-b md:border-b-0 md:border-r border-slate-300 dark:border-slate-800/50 z-10 relative bg-slate-100 dark:bg-[#070b14]"
            >
               <div className="p-4 md:p-6 pb-2 md:pb-4 shrink-0 flex items-center justify-between z-20">
                 <div className="overflow-hidden pr-2">
                   <h2 className="text-sm md:text-lg font-bold text-slate-800 dark:text-slate-200 truncate">{filename}</h2>
                   <p className="text-slate-500 text-[10px] md:text-xs mt-0.5 uppercase tracking-wider font-semibold">Document Preview</p>
                 </div>
                 
                 {/* Page Navigation */}
                 {totalPages > 1 && (
                   <div className="flex items-center gap-1 bg-white dark:bg-slate-900/90 rounded-lg px-2 py-1 md:px-2.5 md:py-1.5 border border-slate-200 dark:border-slate-700/80 shadow-sm">
                      <button 
                        className="p-1 md:p-1.5 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors" 
                        onClick={goPrev} 
                        disabled={pageIndex === 0}
                        aria-label="Previous Page"
                      >
                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                      </button>
                      <span className="text-[10px] md:text-[11px] font-extrabold text-slate-700 dark:text-slate-200 w-8 md:w-10 text-center tracking-widest select-none">
                         {pageIndex + 1}/{totalPages}
                      </span>
                      <button 
                        className="p-1 md:p-1.5 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition-colors" 
                        onClick={goNext} 
                        disabled={pageIndex === totalPages - 1}
                        aria-label="Next Page"
                      >
                         <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                      </button>
                   </div>
                 )}
               </div>
 
               {/* PDF Canvas Area */}
               <div className="flex-1 bg-slate-200/50 dark:bg-slate-900/30 relative min-h-0">
                 {/* Absolute inset wrapper forces the container to strictly bound the canvas */}
                 <div className="absolute inset-4 md:inset-6 flex items-center justify-center">
                    <canvas 
                        ref={canvasRef} 
                        className={`rounded-[24px] md:rounded-[32px] bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] transition-opacity duration-200 max-w-full max-h-full object-contain ${isRendering ? 'opacity-50' : 'opacity-100'}`}
                    />
                 </div>
                 {isRendering && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/50 dark:bg-[#070b14]/50 backdrop-blur-sm">
                       <div className="w-8 h-8 md:w-10 md:h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                 )}
               </div>
            </div>
 
            {/* Right Side: Smart Form (Native Scrolling) */}
            <div 
              className="w-full md:w-1/2 flex-1 md:h-full flex flex-col relative overflow-hidden"
            >
               <div className="flex-1 overflow-y-auto px-4 py-6 md:p-8 pb-32 md:pb-36 min-h-0 relative">
                  <div className="max-w-xl mx-auto">
                     <div className="mb-10 md:mb-14">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Form Fields</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm md:text-base leading-relaxed">Fill out the fields below. They will be embedded directly into your PDF.</p>
                     </div>
                     
                     <DynamicPDFForm 
                       fields={fields} 
                       formData={formData} 
                       onChange={handleFieldChange} 
                     />
                  </div>
               </div>
 
               {/* Action Bar (Sticky Bottom, fully opaque with shadow) */}
               <div 
                 className="absolute bottom-0 w-full p-4 md:p-6 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0b1120] flex justify-between items-center z-30 shadow-[0_-15px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_-15px_30px_rgba(0,0,0,0.6)]"
               >
                  <button 
                     onClick={() => setPdfBytes(null)} 
                     className="px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                     Cancel
                  </button>
                  <button 
                     onClick={handleApply}
                     disabled={isProcessing || fields.length === 0}
                     className="px-6 md:px-8 py-2.5 md:py-3 rounded-full bg-teal-500 hover:bg-teal-400 text-white dark:text-slate-900 font-extrabold text-xs md:text-sm transition-colors shadow-[0_0_20px_rgba(20,184,166,0.3)] disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
                  >
                     {isProcessing ? 'Processing...' : 'Apply'}
                     {!isProcessing && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>}
                  </button>
               </div>
            </div>
 
          </div>
        )}
      </main>
    </div>
  );
}
