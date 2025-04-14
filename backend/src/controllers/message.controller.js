import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsers = async (req, res) => {
  try {
    const loggedUser = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedUser } }).select(
      "-password"
    );
    if (!filteredUsers)
      return res
        .status(404)
        .send({ success: false, message: "users not found", data: null });
    return res
      .status(200)
      .send({ success: true, message: "users found", data: filteredUsers });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "something went wrong", data: null });
  }
};

export const getMessages = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const senderId = req.user._id;
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });
      return res.status(200).send({ success: true, message: 'messages found', data: messages });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong", data: null });
  }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const receiver = req.params.id;
        const sender = req.user._id;
        let imageUrl;
        if (image) {
            const uploadResponse = cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            sender,
            receiver,
            text,
            image: imageUrl ? imageUrl : ''
        });
        await newMessage.save();
        return res.status(200).send({ success: true, message: 'message sent', data: newMessage._id });
    } catch (error) {
        return res.status(500).send({
            success: false, message: 'something went wrong', data: null
        });
    }
}
