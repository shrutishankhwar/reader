
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

exports.extractFormFields = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(dataBuffer);
  const form = pdfDoc.getForm();
  const fields = form.getFields();

  const fieldData = fields.map(field => {
    const type = field.constructor.name;
    let value = '';
    
    if (type === 'PDFTextField') {
      value = field.getText();
    } else if (type === 'PDFDropdown') {
      value = field.getSelected() || '';
    } else if (type === 'PDFCheckBox') {
      value = field.isChecked() ? 'Checked' : '';
    } else if (type === 'PDFRadioGroup') {
      value = field.getSelected() || '';
    } else if (type === 'PDFOptionList') {
      value = field.getSelected() || '';
    } else {
      value = ''; 
    }

    return {
      name: field.getName(),
      value: value
    };
  });

  return fieldData;
};
