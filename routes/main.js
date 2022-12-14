const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes 
router.get("/", homeController.getIndex);
router.get("/profile/:id", ensureAuth, postsController.getProfile);
router.get("/userProfile/:id", postsController.getOtherProfile)

//Route for the 'feed'
router.get("/feed", ensureAuth, postsController.getFeed);

//Login Routes
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);


router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router;
