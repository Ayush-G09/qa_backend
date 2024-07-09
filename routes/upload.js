const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { conversationId, fileName } = req.body;

  console.log(req.body)

  try {
    // Find the user by ID
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (!user.apiKey) {
        return res.status(400).json({ msg: 'No API key found. Please provide an API key first.' });
    }

    let newConversationId = conversationId;

    // If conversationId is null or 'NewConversation', create a new conversation
    if (conversationId === '' || conversationId === "NewConversation") {
      const newConversation = {
        file: {
          name: fileName,
          embeddingsCreated: false,
        },
        chat: [],
        name: fileName, // Use provided name or default
      };
      user.conversations.push(newConversation);
      await user.save(); // Save the user document to generate _id

      // Fetch the newly added conversation from the user's conversations array
      const addedConversation =
        user.conversations[user.conversations.length - 1];
      newConversationId = addedConversation._id; // Use the new conversation's ID
    } else {
      // Update existing conversation with new file data and optionally name
      const conversation = user.conversations.id(conversationId);
      if (!conversation) {
        return res.status(404).json({ msg: "Conversation not found" });
      }
      conversation.file.name = fileName;
      await user.save(); // Save the updated user document
    }

    // Fetch updated user data to include updated conversations
    const updatedUser = await User.findById(req.user.id);

    // Respond with success message and updated conversations
    res.json({
      msg: "File name updated successfully",
      conversationId: newConversationId,
      conversations: updatedUser.conversations,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
