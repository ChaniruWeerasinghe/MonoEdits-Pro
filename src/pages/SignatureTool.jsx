import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from '../components/StepIndicator';
import PDFUploader from '../components/PDFUploader';
import SignatureInput from '../components/SignatureInput';
import PDFEditor from '../components/PDFEditor';
import Notification, { addToast } from '../components/Notification';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { mergePDF } from '../utils/mergePDF';

export default function SignatureTool() {
  const navigate = useNavigate();
  const [step, setStep]                   = useState(0);
  const [pdfFile, setPdfFile]             = useState(null);
  const [signatureUrl, setSignatureUrl]   = useState(null);
  const [isGenerating, setIsGenerating]   = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  const [signedPdfBytes, setSignedPdfBytes] = useState(null);

  const resetEditor = useCallback(() => {
    setPdfFile(null); setSignatureUrl(null);
    setSignedPdfBytes(null); setDownloadReady(false);
    setIsGenerating(false); setStep(0);
  }, []);

  const goHome = useCallback(() => { 
    navigate('/');
  }, [navigate]);

  const handlePDFLoaded         = useCallback((f)  => { setPdfFile(f); setStep(1); }, []);
  const handleSignatureComplete = useCallback((url) => { setSignatureUrl(url); setStep(2); }, []);

  const handlePlacementConfirm = useCallback(async ({ signaturesByPage, canvasDims }) => {
    if (!pdfFile?.bytes || !signatureUrl) { addToast('Missing PDF or signature.', 'error'); return; }
    setIsGenerating(true); setStep(3);
    try {
      const result = await mergePDF({ pdfBytes: pdfFile.bytes, sigDataUrl: signatureUrl, signaturesByPage, canvasDims });
      setSignedPdfBytes(result); setDownloadReady(true);
      addToast('Signatures placed & PDF ready!', 'success', 5000);
    } catch (err) {
      addToast(`Merge failed: ${err.message}`, 'error'); setStep(2);
    } finally { setIsGenerating(false); }
  }, [pdfFile, signatureUrl]);

  const handleDownload = () => {
    if (!signedPdfBytes) return;
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([signedPdfBytes], { type: 'application/pdf' })),
      download: `${(pdfFile?.name || 'document').replace(/\.pdf$/i, '')}-signed.pdf`,
    });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
    addToast('Download started.', 'success');
  };

  return (
    <div className="app-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Notification />

      <Header />

      <main className="site-container" style={{ paddingTop: 140, paddingBottom: 80, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 48 }}><StepIndicator currentStep={step} /></div>

        {step === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 w-full animate-fadeup">
            <PDFUploader onFileLoaded={handlePDFLoaded} />
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col justify-center flex-1 gap-6 w-full animate-fadeup">
            <SignatureInput onComplete={handleSignatureComplete} />
            <button id="back-to-upload-btn" className="btn-ghost" onClick={() => setStep(0)} style={{ alignSelf: 'flex-start' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col flex-1 gap-6 w-full animate-fadeup">
            <PDFEditor pdfBytes={pdfFile?.bytes} signatureDataUrl={signatureUrl} onConfirm={handlePlacementConfirm} />
            <button id="back-to-sign-btn" className="btn-ghost" onClick={() => setStep(1)} style={{ alignSelf: 'flex-start' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              Back
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fadeup flex flex-col items-center justify-center gap-8 text-center" style={{ flex: 1 }}>
            {isGenerating ? (
              <>
                <div style={{ width: 72, height: 72, borderRadius: '50%', border: '4px solid rgba(13,148,136,0.15)', borderTopColor: '#0d9488', animation: 'spin 0.9s linear infinite' }} />
                <p className="text-lg font-semibold text-slate-100">Generating your signed PDF…</p>
              </>
            ) : downloadReady && (
              <>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(13,148,136,0.1)', border: '2px solid rgba(13,148,136,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(13,148,136,0.2)' }}>
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-100">Your PDF is signed!</h2>
                  <p className="text-slate-400 text-sm mt-2">The signature has been embedded. Download it below.</p>
                </div>
                <div className="glass-subtle px-6 py-4 flex items-center gap-4" style={{ border: '1px solid rgba(13,148,136,0.2)' }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <div className="text-left">
                    <p className="text-slate-200 font-medium text-sm">{(pdfFile?.name || 'document').replace(/\.pdf$/i, '')}-signed.pdf</p>
                    <p className="text-slate-500 text-xs mt-0.5">{signedPdfBytes ? `${(signedPdfBytes.byteLength / 1024).toFixed(1)} KB` : '—'}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button id="download-pdf-btn" className="btn-primary" onClick={handleDownload}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download Signed PDF
                  </button>
                  <button id="sign-another-btn" className="btn-secondary" onClick={resetEditor}>Sign Another</button>
                  <button id="back-home-end-btn" className="btn-ghost" onClick={goHome}>Back to Home</button>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      <Footer />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
