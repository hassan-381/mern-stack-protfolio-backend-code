import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
  message: {
    type: String,
    minLength: [3, "Message must be at least 3 characters long"],
  },
  senderName: {
    type: String,
    minLength: [3, "Name must be at least 3 characters long"],
  },
  subject: {
    type: String,
    minLength: [3, "Subject must be at least 3 characters long"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Message = mongoose.model("Message", messageSchema);
