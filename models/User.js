const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  from: {
    type: String,
    enum: ['user', 'backend'],
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
});

const ConversationSchema = new mongoose.Schema({
  file: {
    name: {
      type: String,
      required: true,
    },
    embeddingsCreated: {
      type: Boolean,
      required: true,
    }
  },
  chat: [ChatSchema],
  name: String,
});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  conversations: [ConversationSchema],
  apiKey: {
    type: String,
    required: false, // Ensure it's not required
  },
});

module.exports = mongoose.model('User', UserSchema);
