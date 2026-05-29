import { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { usePDFRenderer } from '../hooks/usePDFRenderer';
import { addToast } from './Notification';

const DEFAULT_SIG_W = 200;
const DEFAULT_SIG_H = 80;

export default function PDFEditor({ pdfBytes, signatureDataUrl, onConfirm }) {
  const { canvasRef, pageIndex, totalPages, goNext, goPrev, isRendering, renderError, canvasDims } =
    usePDFRenderer(pdfBytes);

  const scrollRef = useRef(null);

  const [signaturesByPage, setSignaturesByPage] = useState({
    0: { x: 40, y: 40, width: DEFAULT_SIG_W, height: DEFAULT_SIG_H }
  });

  // Re-clamp position when canvas dims change (page change / resize)
  useEffect(() => {
    if (canvasDims.width === 0) return;
    setSignaturesByPage((prev) => {
      const current = prev[pageIndex];
      if (!current) return prev;
      return {
        ...prev,
        [pageIndex]: {
          ...current,
          x: Math.min(current.x, canvasDims.width - current.width),
          y: Math.min(current.y, canvasDims.height - current.height),
        }
      };
    });
  }, [canvasDims, pageIndex]);

  const toggleSignature = () => {
    setSignaturesByPage((prev) => {
      const next = { ...prev };
      if (next[pageIndex]) {
        delete next[pageIndex]; // Remove
      } else {
        // Add at default position
        next[pageIndex] = { x: 40, y: 40, width: DEFAULT_SIG_W, height: DEFAULT_SIG_H };
      }
      return next;
    });
  };

  const handleConfirm = () => {
    if (canvasDims.width === 0 || canvasDims.height === 0) {
      addToast('PDF is still loading. Please wait.', 'warning');
      return;
    }
    if (Object.keys(signaturesByPage).length === 0) {
      addToast('No signatures added. Please add a signature to at least one page.', 'warning');
      return;
    }
    onConfirm({ signaturesByPage, canvasDims });
    addToast('Signatures placed! Generating your signed PDF…', 'info');
  };

  return (
    <div className="animate-fadeup flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-xl font-bold text-slate-100">Position your signature</h2>
        <p className="text-sm text-slate-400">
          Drag and resize the signature to where it belongs on the document.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Page nav */}
        <div className="flex items-center gap-2">
          <button
            id="prev-page-btn"
            className="page-nav-btn"
            onClick={goPrev}
            disabled={pageIndex === 0}
            aria-label="Previous page"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className="text-sm text-slate-300 font-medium px-1 flex items-center gap-1.5">
            Page <span className="text-teal-400">{pageIndex + 1}</span>
            <span className="text-slate-500"> / {totalPages}</span>
            {signaturesByPage[pageIndex] && (
              <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#2dd4bf', marginLeft: 4 }} title="Signature active on this page" />
            )}
          </span>
          <button
            id="next-page-btn"
            className="page-nav-btn"
            onClick={goNext}
            disabled={pageIndex === totalPages - 1}
            aria-label="Next page"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Add/Remove Signature Toggle */}
        <button
          className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            signaturesByPage[pageIndex] 
              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20' 
              : 'bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500/20'
          }`}
          onClick={toggleSignature}
          title={signaturesByPage[pageIndex] ? "Remove from this page" : "Add to this page"}
        >
          {signaturesByPage[pageIndex] ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Remove
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Signature
            </>
          )}
        </button>

        {/* Size hint */}
        <div className="text-xs text-slate-500 glass-subtle px-3 py-1.5 hidden sm:flex items-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }}>
            <polyline points="5 9 2 12 5 15" /><polyline points="9 5 12 2 15 5" />
            <polyline points="15 19 12 22 9 19" /><polyline points="19 9 22 12 19 15" />
            <line x1="2" y1="12" x2="22" y2="12" /><line x1="12" y1="2" x2="12" y2="22" />
          </svg>
          Drag &bull; Resize
        </div>

        {/* Confirm */}
        <button
          id="apply-signature-btn"
          className="btn-primary"
          onClick={handleConfirm}
          disabled={isRendering || totalPages === 0}
        >
          Apply &amp; Continue
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </button>
      </div>

      {/* PDF scroll area */}
      <div ref={scrollRef} className="pdf-scroll-area glass" style={{ padding: 16, textAlign: 'center' }}>
        {renderError && (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <p className="text-red-400 font-medium">Failed to render PDF</p>
            <p className="text-slate-500 text-sm">{renderError}</p>
          </div>
        )}

        {isRendering && !renderError && (
          <div className="flex items-center justify-center py-16">
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              border: '3px solid rgba(13,148,136,0.2)',
              borderTopColor: '#0d9488',
              animation: 'spin 0.8s linear infinite',
            }} />
          </div>
        )}

        {/* PDF canvas + signature overlay */}
        <div
          className="pdf-editor-wrapper"
          style={{
            display: 'inline-block',
            visibility: isRendering ? 'hidden' : 'visible',
            position: 'relative',
          }}
        >
          <canvas ref={canvasRef} className="pdf-canvas" />

          {/* Draggable / resizable signature for current page */}
          {canvasDims.width > 0 && signatureDataUrl && signaturesByPage[pageIndex] && (
            <Rnd
              size={{ width: signaturesByPage[pageIndex].width, height: signaturesByPage[pageIndex].height }}
              position={{ x: signaturesByPage[pageIndex].x, y: signaturesByPage[pageIndex].y }}
              onDragStop={(_, d) =>
                setSignaturesByPage((prev) => ({
                  ...prev,
                  [pageIndex]: { ...prev[pageIndex], x: d.x, y: d.y }
                }))
              }
              onResizeStop={(_, __, ref, ___, position) => {
                setSignaturesByPage((prev) => ({
                  ...prev,
                  [pageIndex]: {
                    width: parseInt(ref.style.width),
                    height: parseInt(ref.style.height),
                    x: position.x,
                    y: position.y,
                  }
                }));
              }}
              bounds="parent"
              minWidth={60}
              minHeight={24}
              maxWidth={canvasDims.width - signaturesByPage[pageIndex].x}
              maxHeight={canvasDims.height - signaturesByPage[pageIndex].y}
              enableResizing={{
                top: false, right: true, bottom: true,
                left: false, topRight: false, bottomRight: true,
                bottomLeft: false, topLeft: false,
              }}
              style={{ zIndex: 10 }}
            >
              <div
                className="sig-overlay-handle"
                style={{ width: '100%', height: '100%' }}
                title="Drag to reposition"
              >
                <img src={signatureDataUrl} alt="Signature overlay" draggable={false} />
                {/* Resize grip indicator */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 3,
                    right: 3,
                    width: 10,
                    height: 10,
                    borderRight: '2px solid rgba(13,148,136,0.8)',
                    borderBottom: '2px solid rgba(13,148,136,0.8)',
                    borderRadius: '0 0 3px 0',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </Rnd>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
