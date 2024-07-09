const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const OpenAI = require('openai');

const router = express.Router();

// @route    POST api/question
// @desc     Ask question about the uploaded file
// @access   Private
router.post('/', auth, async (req, res) => {
  const { question, conversationId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (!user.apiKey) {
      return res.status(400).json({ msg: 'No API key found. Please provide an API key first.' });
    }

    const conversation = user.conversations.id(conversationId);
    if (!conversation) {
      return res.status(404).json({ msg: 'Conversation not found' });
    }

    const fileData = Buffer.from(conversation.file.data, 'base64').toString('utf-8');

    const openai = new OpenAI({
      apiKey: user.apiKey,
    }); 

    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'user', content: `${fileData}\n\nQuestion: ${question}` },
      ],
      maxTokens: 20,
      temperature: 0.7,
    });

    res.json({ result: chatCompletion.choices[0].text });
  } catch (err) {
    console.error(err); // Log the error for debugging purposes
    if (err.response && err.response.status === 401) {
      // OpenAI error
      res.status(401).json({ msg: err.response.data.error.message });
    } else {
      // General error
      res.status(500).json({ msg: 'An error occurred while fetching the OpenAI response' });
    }
  }
});

module.exports = router;
