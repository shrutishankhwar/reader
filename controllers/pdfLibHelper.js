const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

exports.extractFormFields = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(dataBuffer);
  const form = pdfDoc.getForm();
  const fields = form.getFields();

  const fieldNames = fields.map(f => f.getName());
  return fieldNames;
};
