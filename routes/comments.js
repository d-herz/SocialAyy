const express = require("express");
const router = express.Router();
const commentsController = require("../controllers/comments");
const { ensureAuth, ensureGuest } = require("../middleware/auth"); //This is so the 'ensureAuth' method can be called the the get('/:id') route

//Comments Routes - simplified for now
router.post("/createComment/:id", commentsController.createComment); 

//adding comment likes
router.put("/likeComment/:commentId/:userId", commentsController.likeComment);

//TODO working on adding ability to editComment (not working yet)
router.put("/editComment/:commentId", commentsController.editComment)


router.delete("/deleteComment/:id", commentsController.deleteComment);

module.exports = router;
