const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

router.post("/", auth, async (req, res) => {
  const { conversationId, fileName } = req.body;

  console.log({conversationId});

  try {
    // Find the user by ID
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (!user.apiKey) {
        return res.status(400).json({ msg: 'No API key found. Please provide an API key first.' });
    }
    
    if (conversationId !== '' && conversationId !== "NewConversation"){
    const conversationIndex = user.conversations.findIndex(
      conv => conv._id.toString() === conversationId
    );

    if (conversationIndex === -1) {
      return res.status(404).json({ msg: 'Conversation not found' });
    }
    }

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

      // Fetch the newly added conversation's ID
    const newConversationId = user.conversations[user.conversations.length - 1]._id;

    // Find the conversation index by ID
  

    // Remove the conversation
    if (conversationId === '' && conversationId === "NewConversation"){
    user.conversations.splice(conversationIndex, 1);
    await user.save(); // Save the updated user document
    }

    // Fetch updated user data to include updated conversations
    const updatedUser = await User.findById(req.user.id);

    // Respond with success message and updated conversations
    res.json({
      msg: "File updated successfully",
      conversationId: newConversationId,
      conversations: updatedUser.conversations,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.put("/fileName", auth, async (req, res) => {
  const { conversationId, newName } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Find the conversation by conversationId
    const conversation = user.conversations.id(conversationId);
    if (!conversation) {
      return res.status(404).json({ msg: "Conversation not found" });
    }

    // Create a new conversation with the updated file name
    const newConversation = {
      file: {
        name: newName,
        embeddingsCreated: conversation.file.embeddingsCreated,
      },
      chat: conversation.chat, // Preserve existing chat messages
      name: conversation.name || newName, // Preserve existing name or use new name
    };

    user.conversations.push(newConversation);
    await user.save(); // Save the user document to generate the new conversation ID

    // Fetch the newly added conversation's ID
    const newConversationId = user.conversations[user.conversations.length - 1]._id;

    // Find the conversation index by ID
    const conversationIndex = user.conversations.findIndex(
      conv => conv._id.toString() === conversationId
    );

    if (conversationIndex === -1) {
      return res.status(404).json({ msg: 'Conversation not found' });
    }

    // Remove the conversation
    user.conversations.splice(conversationIndex, 1);
    await user.save(); // Save the updated user document

    // Fetch updated user data to include updated conversations
    const updatedUser = await User.findById(req.user.id);

    // Respond with success message, new conversation ID, and updated conversations
    res.json({
      msg: "File name updated successfully",
      newConversationId: newConversationId,
      conversations: updatedUser.conversations,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


module.exports = router;
