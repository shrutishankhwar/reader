const fs = require('fs');
const Document = require('../model/document');
const { extractText } = require("../controllers/pdfParseHelper");
const { extractFormFields } = require('../controllers/pdfLibHelper');
const { performOCR } = require('../controllers/tesseractHelper');

exports.uploadAndProcessPdf = async (req, res) => {
  const filePath = req.file.path;
  console.log('Processing file:', filePath);
  let textContent = '';
  let missingFields = [];

  try {

    const fieldData = await extractFormFields(filePath);
    // console.log('Extracted field data:', fieldData);


    textContent = await extractText(filePath);
    // console.log('Initial extracted text length:', textContent.length);


    for (const field of fieldData) {
      if (!field.value || !field.value.trim()) {
        missingFields.push(field.name);
      }
    }


    if (!textContent.trim()) {
      console.log('No text extracted, performing OCR...');
      textContent = await performOCR(filePath);
      console.log('OCR extracted text length:', textContent.length);
    }

    const status = missingFields.length ? 'incomplete' : 'complete';

    // console.log('PDF processing status:', status);
    // console.log('Missing fields:', missingFields);
    // console.log('Extracted text preview:', textContent.slice(0, 500) + '...');


    const doc = new Document({
      filePath,
      fieldNames: fieldData.map(f => f.name),
      status,
      missingFields
    });
    await doc.save();
    console.log('Document saved to DB:', doc);


    return res.json({
      message: 'PDF processed successfully',
      status,
      missingFields,
      fieldData,
      extractedText: textContent.slice(0, 500) + '...'
    });

  } catch (err) {
    return res.status(500).json({ message: 'Error processing PDF' });
  } finally {
    fs.unlinkSync(filePath);
  }
};
