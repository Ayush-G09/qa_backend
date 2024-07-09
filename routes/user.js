const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// @route    PUT api/user/apikey
// @desc     Set or update API key
// @access   Private
router.put('/apikey', auth, async (req, res) => {
    const { apikey } = req.body; // Correct key should match with your request body
  
    try {
      let user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      console.log('Existing API Key:', user.apiKey); // Ensure this logs the correct value
  
      // Update apiKey field only
      user.apiKey = apikey; // Use req.body.apikey
      await user.save();
  
      console.log('Updated User:', user); // Check the user object after saving
  
      res.json({ msg: 'API key updated successfully' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });  

module.exports = router;
