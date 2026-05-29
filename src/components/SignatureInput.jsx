import { useRef, useState } from 'react';
import DrawSignature from './DrawSignature';
import UploadSignature from './UploadSignature';
import { addToast } from './Notification';

export default function SignatureInput({ onComplete }) {
  const [activeTab, setActiveTab] = useState('draw');
  const [signatureDataUrl, setSignatureDataUrl] = useState(null);
  const drawRef = useRef(null);

  const handleConfirm = () => {
    let dataUrl = signatureDataUrl;

    if (activeTab === 'draw') {
      if (!drawRef.current || drawRef.current.isEmpty()) {
        addToast('Please draw your signature before continuing.', 'warning');
        return;
      }
      dataUrl = drawRef.current.getDataUrl();
    }

    if (!dataUrl) {
      addToast('No signature detected. Please draw or upload one.', 'warning');
      return;
    }

    onComplete(dataUrl);
    addToast('Signature captured. Now position it on your PDF.', 'success');
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setSignatureDataUrl(null);
    drawRef.current?.clear();
  };

  return (
    <div className="animate-fadeup flex flex-col gap-6 w-full max-w-3xl mx-auto">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-100">Create your signature</h2>
        <p className="text-sm text-slate-400 mt-1">Draw it freehand or upload an image of your existing signature.</p>
      </div>

      {/* Tab switcher */}
      <div className="tab-pill" role="tablist">
        <button
          id="tab-draw"
          role="tab"
          aria-selected={activeTab === 'draw'}
          className={activeTab === 'draw' ? 'active' : ''}
          onClick={() => handleTabSwitch('draw')}
          type="button"
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19l7-7 3 3-7 7-3-3z" /><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              <path d="M2 2l7.586 7.586" /><circle cx="11" cy="11" r="2" />
            </svg>
            Draw
          </span>
        </button>
        <button
          id="tab-upload"
          role="tab"
          aria-selected={activeTab === 'upload'}
          className={activeTab === 'upload' ? 'active' : ''}
          onClick={() => handleTabSwitch('upload')}
          type="button"
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
              <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3" />
            </svg>
            Upload Image
          </span>
        </button>
      </div>

      {/* Panel */}
      <div className="glass p-6">
        {activeTab === 'draw' ? (
          <DrawSignature
            ref={drawRef}
            onSigned={(url) => setSignatureDataUrl(url)}
          />
        ) : (
          <UploadSignature onSigned={(url) => setSignatureDataUrl(url)} />
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Your signature stays 100% local — never uploaded.
        </p>
        <button
          id="confirm-signature-btn"
          className="btn-primary"
          onClick={handleConfirm}
          type="button"
        >
          Use This Signature
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>
    </div>
  );
}
