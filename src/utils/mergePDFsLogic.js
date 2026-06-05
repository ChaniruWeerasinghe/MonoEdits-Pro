import { PDFDocument } from 'pdf-lib';

/**
 * Merges multiple PDFs into a single PDF document.
 * 
 * @param {Array} pdfFiles - Array of file objects { id, file, name, size, bytes }
 * @returns {Promise<Uint8Array>} - The merged PDF bytes
 */
export async function mergeMultiplePDFs(pdfFiles) {
  const mergedPdf = await PDFDocument.create();

  for (const pdf of pdfFiles) {
    const pdfDoc = await PDFDocument.load(pdf.bytes);
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}
