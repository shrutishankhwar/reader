const express = require("express");
const router = express.Router();
// const {verifyToken} = require("../middleware/authMiddleware")
const upload = require("../middleware/uploadMiddleware");
const { uploadAndProcessPdf,
    // getDocuments,
    // getDocumentById
} = require("../controllers/Documentcontroller");

router.put("/uploadAndProcessPdf",upload.single("pdf"),uploadAndProcessPdf);
// router.get("/getDocuments",getDocuments);
// router.get("/getDocumentById/:id",getDocumentById)

module.exports = router;