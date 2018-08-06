const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Validation
const validateVideoInput = require("../../validation/video");

// Load Video Model
const Video = require("../../models/Video");
// Load User Model
const User = require("../../models/User");

// @route GET api/videos/test
// @desc Tests video route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "Video Works!" }));

// @route GET api/videos
// @desc Get videos
// @access Public
router.get("/", (req, res) => {
  Video.find()
    .sort({ date: -1 })
    .limit(10)
    .then(videos => res.json(videos))
    .catch(err =>
      res
        .status(404)
        .json({ novideosfound: "アップされた資料映像はありません" })
    );
});

// @route GET api/videos/:id
// @desc Get video by id
// @access Public
router.get("/:id", (req, res) => {
  Video.findById(req.params.id)
    .then(video => res.json(video))
    .catch(err =>
      res.status(404).json({ novideofound: "No video found with that ID" })
    );
});

// @route POST api/videos
// @desc Create video post
// @access Private *
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateVideoInput(req.body);
    // Check validation
    if (!isValid) {
      // if any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    // Get fields
    const videoFields = {};
    videoFields.user = req.user.id;
    if (req.body.company) videoFields.company = req.body.company;
    if (typeof req.body.a_name !== "undefined") {
      videoFields.a_name = req.body.a_name.split("、");
    }
    if (req.body.videoId) videoFields.videoId = req.body.videoId;
    if (req.body.title) videoFields.title = req.body.title;
    if (req.body.details) videoFields.details = req.body.details;
    if (req.body.thumbnails) videoFields.thumbnails = req.body.thumbnails;
    if (req.body.url) videoFields.url = req.body.url;
    if (req.body.year) videoFields.year = req.body.year;

    Video.findOne({ videoId: req.body.videoId }).then(video => {
      if (video) {
        // update
        Video.findOneAndUpdate(
          { id: req.body.id },
          { $set: videoFields },
          { new: true }
        ).then(video => res.json(video));
      } else {
        // Create
        Video.findOne({ videoId: videoFields.videoId }).then(video => {
          if (video) {
            errors.videoId = "この資料映像はすでに登録されています";
            res.status(400).json(errors);
          }
          //Save
          new Video(videoFields).save().then(video => res.json(video));
        });
      }
    });
  }
);

// @route DELETE api/videos/:id
// @desc Delete the video from video List
// @ access Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Video.findOne({ user: req.user.id }).then(video => {
      Video.findById(req.params.id)
        .then(video => {
          // Check for post owner
          if (video.user.tostring() !== req.user.id) {
            return res
              .status(401)
              .json({ noauthorized: "User not authorized" });
          }
          // Delete
          video.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: "No post found " }));
    });
  }
);

// @route   POST api/videos/like/:id
// @desc    Like video
// @access  Private

router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Video.findOne({ user: req.user.id }).then(video => {
      Video.findById(req.params.id)
        .then(video => {
          if (
            video.likes.filter(like => like.user.toString() !== req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "User already liked this video" });
          }
          // Add user id to likes array
          video.likes.unshift({ user: req.user.id });
          video.save().then(video => res.json(video));
        })
        .catch(err => res.status(404).json({ postnofound: "No post found" }));
    });
  }
);

// @route   POST api/videos/comment/:id
// @desc    Add comment to video
// @access  Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateVideoInput(req.body);
    // Check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Video.findById(req.params.id)
      .then(video => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          user: req.user.id
        };
        // Add to comments array
        video.comments.unshift(newComment);
        // Save
        video.save().then(video => res.json(video));
      })
      .catch(err => res.status(404).json({ videonotfound: "No video found" }));
  }
);

// @route   DELETE api/videos/comment/:id/:comment_id
// @desc    Remove comment from video
// @access  Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Video.findById(req.params.id)
      .then(video => {
        // Check to see if comment exists
        if (
          video.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment dose not exists" });
        }
        // Get remove index
        const removeIndex = video.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);
        // Splice comment out of array
        video.comments.splice(removeIndex, 1);
        video.save().then(video => res.json(video));
      })
      .catch(err => res.status(404).json({ videonotfound: "No video found" }));
  }
);

module.exports = router;
