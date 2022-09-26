const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id }).sort({ createdAt: "desc" });
      
      res.render("profile2.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }); //Post is the model (required above), .lean() (mongoose) is for getting the raw object from mongo (documents on mongo, while similar to "objects" actually include more than you need) this will be faster
      console.log(`These are your posts ${posts}`)
      res.render("feed2.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id); //.id is the variable from the route
      const comments = await Comment.find({post: req.params.id}).sort({ createdAt: "asc" }).lean();
      res.render("post2.ejs", { post: post, user: req.user, comments: comments });
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path); //upload is from the cloudinary package

      await Post.create({
        title: req.body.title,
        image: result.secure_url, //result declared above
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        numOfComments: 0,
        user: req.user.id,
        createdBy: req.user.userName,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate( //Post is the name of the model (first parameter) in post model file
        { _id: req.params.id },
        {
          $inc: { likes: 1 }, //$inc is a increment thing included with mongo/mongoose. This is a number because it is defined in the schema as such
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}/#commentDiv`);
    } catch (err) {
      console.log(err);
    }
  },

  //TODO add abiity to "update" (edit) post title and caption

  editPost: async (req, res) => {
    try{
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        { //didn't need $set apparently
          title: req.body.title, 
          caption: req.body.caption,
        },
        // {
        //   new: true, //apparently don't need this?
        // }
      );
      console.log("Post Updated");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },

  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id }); //Post is the model. find the post using the id from the url (this makes sure the post exists before you 'destroy' it)
      // Delete image from cloudinary

      //find comments associated with post and delete along with post
      const comments = await Comment.deleteMany({post: req.params.id})

      await cloudinary.uploader.destroy(post.cloudinaryId); //post declared above. This line is to get rid of the picture on cloudinary
      // Delete post from db
      await Post.remove({ _id: req.params.id }); //Post is the model, here we remove the post from the collection
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};
