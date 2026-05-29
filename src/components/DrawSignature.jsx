import { useRef, forwardRef, useImperativeHandle } from 'react';
import SignatureCanvas from 'react-signature-canvas';

const DrawSignature = forwardRef(function DrawSignature({ onSigned }, ref) {
  const sigCanvasRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getDataUrl: () => {
      if (!sigCanvasRef.current || sigCanvasRef.current.isEmpty()) return null;
      return sigCanvasRef.current.getCanvas().toDataURL('image/png');
    },
    clear: () => sigCanvasRef.current?.clear(),
    isEmpty: () => sigCanvasRef.current?.isEmpty() ?? true,
  }));

  const handleEnd = () => {
    if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
      onSigned?.(sigCanvasRef.current.getCanvas().toDataURL('image/png'));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-400">
        Draw your signature below using your mouse or touch.
      </p>

      <div className="sig-canvas-wrapper" style={{ aspectRatio: '3/1.2' }}>
        <SignatureCanvas
          ref={sigCanvasRef}
          penColor="#2dd4bf"
          canvasProps={{
            id: 'draw-signature-canvas',
            style: { width: '100%', height: '100%', position: 'absolute', inset: 0 },
          }}
          backgroundColor="transparent"
          onEnd={handleEnd}
        />
        {/* Grid hint */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 0,
            right: 0,
            borderTop: '1px dashed rgba(255,255,255,0.07)',
            pointerEvents: 'none',
          }}
        />
        <p
          style={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.12)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Sign above this line
        </p>
      </div>

      <div className="flex gap-2">
        <button
          id="clear-signature-btn"
          className="btn-ghost"
          onClick={() => { sigCanvasRef.current?.clear(); onSigned?.(null); }}
          type="button"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 101.85-4.14L1 10" />
          </svg>
          Clear
        </button>
      </div>
    </div>
  );
});

export default DrawSignature;
