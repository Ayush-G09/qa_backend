const express = require('express');
const { spawn } = require('child_process');
const auth = require('../middleware/auth');

const router = express.Router();

// @route    POST api/qa
// @desc     Answer question based on uploaded content
// @access   Private
router.post('/', auth, (req, res) => {
  const { context, question } = req.body;

  const process = spawn('python', ['scripts/answer_question.py', context, question]);

  process.stdout.on('data', (data) => {
    res.json({ answer: data.toString() });
  });

  process.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    res.status(500).send('Error answering question');
  });
});

module.exports = router;
