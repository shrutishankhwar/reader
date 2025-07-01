const fs = require('fs');
const Document = require('../model/document');
const { extractText } = require("../controllers/pdfParseHelper");
const { extractFormFields } = require('../controllers/pdfLibHelper');
const { performOCR } = require('../controllers/tesseractHelper');

const REQUIRED_FIELDS = ['Address', 'Sale Price', 'Agent Name', 'Signature'];

exports.uploadAndProcessPdf = async (req, res) => {
  const filePath = req.file.path;
  console.log('Processing file:', filePath);
  let textContent = '';
  let missingFields = [];

  try {
    // pdf-parse
    textContent = await extractText(filePath);

    // pdf-lib
    const fieldNames = await extractFormFields(filePath);
     console.log('Extracted field names:', fieldNames);
    // Check required fields
    for (const field of REQUIRED_FIELDS) {
      const inText = textContent.includes(field);
      const inFields = fieldNames.some(name => name.toLowerCase().includes(field.toLowerCase()));
      if (!inText && !inFields) {
        missingFields.push(field);
      }
    }

    // OCR fallback
    if (!textContent.trim()) {
      textContent = await performOCR(filePath);
      for (const field of REQUIRED_FIELDS) {
        if (!textContent.includes(field)) {
          if (!missingFields.includes(field)) {
            missingFields.push(field);
          }
        }
      }
    }

    const status = missingFields.length ? 'incomplete' : 'complete';
    console.log('PDF processing status:', status);
    console.log('Missing fields:', missingFields);
    console.log('Extracted text:', textContent.slice(0, 500) + '...');
    // Save in DB
    const doc = new Document({
      // user: req.user.id, // Assuming user ID is available in req.user,
      filePath,
      filename: req.file.originalname,
      status,
      missingFields
    });
    await doc.save();
     console.log('Document saved to DB:', doc);
     return res.json({
      message: 'PDF processed',
      status,
      missingFields,
      fieldNames,
      extractedText: textContent.slice(0, 500) + '...'
    });

  } catch (err) {
    console.error(err);
     return res.status(500).json({ message: 'Error processing PDF' });
  } finally {
    fs.unlinkSync(filePath);
  }
};

// exports.getDocuments = async (req, res) => {
//   const docs = await Document.find({ user: req.user.id });
//   res.json(docs);
//   console.log('Fetched documents for user:', docs);
// };

// exports.getDocumentById = async (req, res) => {
//   const doc = await Document.findOne({ _id: req.params.id, user: req.user.id });
//   if (!doc) return res.status(404).json({ message: 'Document not found' });
//   res.json(doc);
// };
