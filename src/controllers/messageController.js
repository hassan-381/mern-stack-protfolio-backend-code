import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Message } from "../models/messageSchema.js";

export const createMessage = catchAsyncErrors(async (req, res, next) => {
  const { message, senderName, subject } = req.body;

  if (!message || !senderName || !subject) {
    return next(new ErrorHandler("Please enter all the fields", 400));
  }

  const newMessage = await Message.create({
    message,
    senderName,
    subject,
  });
  res.status(201).json({
    success: true,
    newMessage,
  });
});

export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
  const messages = await Message.find({});
  res.status(200).json({
    success: true,
    messages,
  });
});

export const deleteMessage = catchAsyncErrors(async (req, res, next) => {
  const message = await Message.findById(req.params.id);
  if (!message) {
    return next(new ErrorHandler("Message not found", 404));
  }
  await message.deleteOne();
  res.status(200).json({
    success: true,
    message: "Message is deleted",
  });
});
