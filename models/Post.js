const mongoose = require("mongoose");
const { array } = require("../middleware/multer");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    require: true,
  },
  cloudinaryId: {
    type: String,
    require: true,
  },
  caption: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
  },
  //TODO: add array of likers
  usersWhoLiked: {
    type: [String],
    required: true,
  },
  numOfComments:{
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", //here we are referencing our "User" model from our User schema
  },
  createdBy:{
    type: String,
    ref: "User", 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Post", PostSchema);
