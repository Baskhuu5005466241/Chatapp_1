const { addMessage, getMessages } = require("../controllers/messageController");
const router = require("express").Router();
const Chat = require("../models/messageModel")
router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);

module.exports = router;
router.delete('/:id', async (req, res) => {
    try {
      const chatId = req.params.id;
      await Chat.findByIdAndDelete(chatId);
      res.status(200).json({ message: 'Chat deleted successfully' });
    } catch (error) {
      console.error('Error deleting chat:', error);
      res.status(500).json({ message: 'Error deleting chat' });
    }
  });
  
  module.exports = router;