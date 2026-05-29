import { PDFDocument } from 'pdf-lib';

/**
 * Merges a signature image (data URL) onto customized pages of a PDF.
 *
 * @param {ArrayBuffer} pdfBytes         - Original PDF as ArrayBuffer
 * @param {string}      sigDataUrl       - Signature PNG/JPEG as a data URL
 * @param {object}      signaturesByPage - Dictionary mapping pageIndex -> { x, y, width, height }
 * @param {object}      canvasDims       - { width, height } of the rendered PDF canvas
 * @returns {Promise<Uint8Array>}        - Signed PDF bytes
 */
export async function mergePDF({ pdfBytes, sigDataUrl, signaturesByPage, canvasDims }) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();

  // Determine image type from data URL and embed once
  const isPng = sigDataUrl.startsWith('data:image/png');
  let embeddedImage;

  const base64Data = sigDataUrl.split(',')[1];
  const imgBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

  if (isPng) {
    embeddedImage = await pdfDoc.embedPng(imgBytes);
  } else {
    embeddedImage = await pdfDoc.embedJpg(imgBytes);
  }

  const { width: canvasW, height: canvasH } = canvasDims;

  // Loop through all pages that have a signature configured
  for (const [pageIdxStr, placement] of Object.entries(signaturesByPage)) {
    const pageIndex = parseInt(pageIdxStr, 10);
    if (pageIndex < 0 || pageIndex >= pages.length) continue;

    const page = pages[pageIndex];
    const { width: pdfW, height: pdfH } = page.getSize();

    // Convert canvas pixel coords → PDF coordinate space
    const scaleX = pdfW / canvasW;
    const scaleY = pdfH / canvasH;

    const sigW = placement.width * scaleX;
    const sigH = placement.height * scaleY;
    const sigX = placement.x * scaleX;
    // Flip Y axis: PDF y=0 is bottom, canvas y=0 is top
    const sigY = pdfH - (placement.y * scaleY) - sigH;

    page.drawImage(embeddedImage, {
      x: sigX,
      y: sigY,
      width: sigW,
      height: sigH,
    });
  }

  return await pdfDoc.save();
}
