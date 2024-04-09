// const Messages = require("../models/messageModel");

// module.exports.getMessages = async (req, res, next) => {
//   try {
//     const { from, to } = req.body;

//     const messages = await Messages.find({
//       users: {
//         $all: [from, to],
//       },
//     }).sort({ updatedAt: 1 });

//     const projectedMessages = messages.map((msg) => {
//       return {
//         fromSelf: msg.sender.toString() === from,
//         message: msg.message.text,
//       };
//     });
//     res.json(projectedMessages);
//   } catch (ex) {
//     next(ex);
//   }
// };

// module.exports.addMessage = async (req, res, next) => {
//   try {
//     const { from, to, message } = req.body;
//     const data = await Messages.create({
//       message: { text: message },
//       users: [from, to],
//       sender: from,
//     });

//     if (data) return res.json({ msg: "Message added successfully." });
//     else return res.json({ msg: "Failed to add message to the database" });
//   } catch (ex) {
//     next(ex);
//   }
// };
const Messages = require("../models/messageModel");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
        _id: msg._id // Add the message ID to projectedMessages
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};

module.exports.deleteMessage = async (req, res, next) => {
  try {
    const messageId = req.params.messageId;
    // Delete the message using the message ID
    await Messages.findByIdAndDelete(messageId);
    res.json({ msg: "Message deleted successfully." });
  } catch (ex) {
    next(ex);
  }
};
