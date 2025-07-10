const express = require("express");
const router = express.Router();
const  multer = require("multer");
// const {verifyToken} = require("../middleware/authMiddleware")
const { uploadAndProcessPdf } = require('../controllers/Documentcontroller');
const {verifyToken}  = require('../middleware/authMiddleware');

const upload = multer({ dest: 'uploads/' });

router.post('/uploadAndProcessPdf',verifyToken ,upload.single('pdf') ,  uploadAndProcessPdf  )

module.exports = router;
