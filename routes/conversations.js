const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// GET all conversations for a user including API key
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Include API key in the response
    const { apiKey, conversations } = user;

    res.json({ apiKey, conversations });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE conversation by ID
router.delete('/delete/:conversationId', auth, async (req, res) => {
    const { conversationId } = req.params;
  
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
  
      // Remove the conversation
      user.conversations.splice(conversationIndex, 1);
      await user.save();
  
      res.json({ msg: 'Conversation deleted successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

module.exports = router;
