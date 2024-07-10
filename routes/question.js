const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// @route    POST api/question
// @desc     Ask question about the uploaded file
// @access   Private
router.post('/', auth, async (req, res) => {
  const { conversationId, question, answer } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Find the conversation index by ID
    const conversationIndex = user.conversations.findIndex(
      conv => conv._id.toString() === conversationId
    );

    if (conversationIndex === -1) {
      return res.status(404).json({ msg: 'Conversation not found' });
    }

    const newChat = [
      { from: 'user', data: question },
      { from: 'assistant', data: answer }
    ];

    // Append the new chat messages to the conversation's chat array
    user.conversations[conversationIndex].chat.push(...newChat);

    // Save the updated user document
    await user.save();

    // Fetch the updated user data
    const updatedUser = await User.findById(req.user.id);

    res.json({
      conversations: updatedUser.conversations,
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
