import { PDFDocument } from 'pdf-lib';

/**
 * Extracts AcroForm fields from a PDF.
 * 
 * @param {Uint8Array | ArrayBuffer} pdfBytes - The raw PDF data.
 * @returns {Promise<Array>} Array of field objects { name, type, value, options }
 */
export async function extractPdfFields(pdfBytes) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();
  const fields = form.getFields();
  
  return fields.map(field => {
    const type = field.constructor.name;
    const name = field.getName();
    let value = '';
    let options = [];

    try {
      if (type === 'PDFTextField') {
        value = field.getText() || '';
      } else if (type === 'PDFCheckBox') {
        value = field.isChecked();
      } else if (type === 'PDFDropdown') {
        const selected = field.getSelected();
        value = selected ? (Array.isArray(selected) ? selected[0] : selected) : '';
        options = field.getOptions() || [];
      } else if (type === 'PDFRadioGroup') {
        value = field.getSelected() || '';
        options = field.getOptions() || [];
      }
    } catch (e) {
      console.warn(`Could not read value for field ${name}:`, e);
    }

    return { name, type, value, options };
  });
}

/**
 * Fills the PDF form fields with the provided data.
 * 
 * @param {Uint8Array | ArrayBuffer} pdfBytes - The original PDF data.
 * @param {Object} formData - Object mapping field names to values.
 * @returns {Promise<Uint8Array>} The modified PDF bytes.
 */
export async function fillPdfFields(pdfBytes, formData) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();

  for (const [name, val] of Object.entries(formData)) {
    const field = form.getFieldMaybe(name);
    if (!field) continue;

    const type = field.constructor.name;
    try {
      if (type === 'PDFTextField') {
        field.setText(val || '');
      } else if (type === 'PDFCheckBox') {
        if (val) field.check();
        else field.uncheck();
      } else if (type === 'PDFDropdown') {
        if (val) field.select(val);
        else field.clear();
      } else if (type === 'PDFRadioGroup') {
        if (val) field.select(val);
        // Radio groups generally don't support clearing in standard AcroForm without a specific 'Off' state
      }
    } catch (e) {
      console.warn(`Could not set value for field ${name}:`, e);
    }
  }

  // Lock the fields as read-only. This removes the blue interactive highlight
  // in most PDF viewers, but avoids the crashes caused by form.flatten()
  form.getFields().forEach(f => f.enableReadOnly());
  
  return await pdfDoc.save();
}
