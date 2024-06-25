const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// @route    POST api/upload
// @desc     Upload file and extract content
// @access   Private
router.post('/', [auth, upload.single('file')], (req, res) => {
  const filePath = path.join(__dirname, '../uploads', req.file.filename);

  let extractScript;
  if (req.file.mimetype === 'application/pdf') {
    extractScript = path.join(__dirname, '../scripts/extract_pdf.py');
  } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    extractScript = path.join(__dirname, '../scripts/extract_word.py');
  } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    extractScript = path.join(__dirname, '../scripts/extract_excel.py');
  } else if (req.file.mimetype === 'text/plain') {
    extractScript = path.join(__dirname, '../scripts/extract_txt.py');
  } else {
    return res.status(400).send('Unsupported file type');
  }

  const process = spawn('python', [extractScript, filePath]);

  process.stdout.on('data', (data) => {
    res.json({ content: data.toString() });
  });

  process.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    res.status(500).send('Error extracting file content');
  });
});

module.exports = router;
