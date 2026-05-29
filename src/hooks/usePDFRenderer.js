import { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Use the bundled worker from pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).href;

/**
 * Hook to render a specific page of a PDF onto a <canvas> element.
 *
 * @param {ArrayBuffer|null} pdfBytes  - Raw PDF bytes
 * @returns {{ canvasRef, pageIndex, totalPages, goNext, goPrev, isRendering, renderError, canvasDims }}
 */
export function usePDFRenderer(pdfBytes) {
  const canvasRef = useRef(null);
  const pdfDocRef = useRef(null);
  const renderTaskRef = useRef(null);

  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isRendering, setIsRendering] = useState(false);
  const [renderError, setRenderError] = useState(null);
  const [canvasDims, setCanvasDims] = useState({ width: 0, height: 0 });

  // Load PDF document when bytes change
  useEffect(() => {
    if (!pdfBytes) {
      pdfDocRef.current = null;
      setTotalPages(0);
      setPageIndex(0);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({ data: pdfBytes.slice(0) });
        const pdf = await loadingTask.promise;
        if (cancelled) return;
        pdfDocRef.current = pdf;
        setTotalPages(pdf.numPages);
        setPageIndex(0);
      } catch (err) {
        if (!cancelled) setRenderError(err.message || 'Failed to load PDF');
      }
    })();

    return () => { cancelled = true; };
  }, [pdfBytes]);

  // Render the current page whenever pageIndex or the loaded doc changes
  useEffect(() => {
    const pdf = pdfDocRef.current;
    const canvas = canvasRef.current;
    if (!pdf || !canvas) return;

    let cancelled = false;

    (async () => {
      // Cancel any in-progress render
      if (renderTaskRef.current) {
        try { await renderTaskRef.current.cancel(); } catch (_) { /* ignored */ }
      }

      setIsRendering(true);
      setRenderError(null);

      try {
        const page = await pdf.getPage(pageIndex + 1); // pdf.js is 1-indexed
        if (cancelled) return;

        const DPR = Math.min(window.devicePixelRatio || 1, 2);
        const viewport = page.getViewport({ scale: 1.5 * DPR });
        const cssWidth = viewport.width / DPR;
        const cssHeight = viewport.height / DPR;

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${cssHeight}px`;

        setCanvasDims({ width: cssWidth, height: cssHeight });

        const ctx = canvas.getContext('2d');
        const renderTask = page.render({ canvasContext: ctx, viewport });
        renderTaskRef.current = renderTask;

        await renderTask.promise;
        if (!cancelled) setIsRendering(false);
      } catch (err) {
        if (!cancelled && err.name !== 'RenderingCancelledException') {
          setRenderError(err.message || 'Render failed');
          setIsRendering(false);
        }
      }
    })();

    return () => { cancelled = true; };
  }, [pageIndex, totalPages]);

  const goNext = useCallback(() => {
    setPageIndex((i) => Math.min(i + 1, totalPages - 1));
  }, [totalPages]);

  const goPrev = useCallback(() => {
    setPageIndex((i) => Math.max(i - 1, 0));
  }, []);

  return { canvasRef, pageIndex, totalPages, goNext, goPrev, isRendering, renderError, canvasDims };
}
