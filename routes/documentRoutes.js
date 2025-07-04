const express = require("express");
const router = express.Router();
const  multer = require("multer");
// const {verifyToken} = require("../middleware/authMiddleware")
const { uploadAndProcessPdf } = require('../controllers/Documentcontroller');
const {requireLogin}  = require('../middleware/authMiddleware');
const upload = multer({ dest: 'uploads/' });

router.put('/uploadAndProcessPdf',requireLogin,upload.single('pdf'), uploadAndProcessPdf  )
// console.log('requireLogin:', typeof requireLogin);
// console.log('uploadAndProcessPdf:', typeof uploadAndProcessPdf);
// console.log('upload.single:', typeof upload.single);

module.exports = router;
