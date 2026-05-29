import { PDFDocument } from 'pdf-lib';

/**
 * Merges a signature image (data URL) onto a specific page of a PDF.
 *
 * @param {ArrayBuffer} pdfBytes       - Original PDF as ArrayBuffer
 * @param {string}      sigDataUrl     - Signature PNG/JPEG as a data URL
 * @param {number}      pageIndex      - 0-based page index to place the signature
 * @param {object}      placement      - { x, y, width, height } in canvas pixels
 * @param {object}      canvasDims     - { width, height } of the rendered PDF canvas
 * @returns {Promise<Uint8Array>}      - Signed PDF bytes
 */
export async function mergePDF({ pdfBytes, sigDataUrl, pageIndex, placement, canvasDims }) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();

  if (pageIndex < 0 || pageIndex >= pages.length) {
    throw new Error(`Invalid page index: ${pageIndex}`);
  }

  const page = pages[pageIndex];
  const { width: pdfW, height: pdfH } = page.getSize();
  const { width: canvasW, height: canvasH } = canvasDims;

  // Convert canvas pixel coords → PDF coordinate space
  // PDF origin is bottom-left; canvas origin is top-left
  const scaleX = pdfW / canvasW;
  const scaleY = pdfH / canvasH;

  const sigW = placement.width * scaleX;
  const sigH = placement.height * scaleY;
  const sigX = placement.x * scaleX;
  // Flip Y axis: PDF y=0 is bottom, canvas y=0 is top
  const sigY = pdfH - (placement.y * scaleY) - sigH;

  // Determine image type from data URL
  const isPng = sigDataUrl.startsWith('data:image/png');
  let embeddedImage;

  const base64Data = sigDataUrl.split(',')[1];
  const imgBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

  if (isPng) {
    embeddedImage = await pdfDoc.embedPng(imgBytes);
  } else {
    embeddedImage = await pdfDoc.embedJpg(imgBytes);
  }

  page.drawImage(embeddedImage, {
    x: sigX,
    y: sigY,
    width: sigW,
    height: sigH,
  });

  return await pdfDoc.save();
}
