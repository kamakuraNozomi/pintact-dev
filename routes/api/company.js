const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Post Model
const Company = require("../../models/Company");

// Validation
const validateCompanyInput = require("../../validation/company");
const validateCommentInput = require("../../validation/comment");
const validateActorInput = require("../../validation/actors");

// @route GET api/company/test
// @desc Tests company route
// @ access Public
router.get("/test", (req, res) => res.json({ msg: "Company Works!" }));

// @route GET api/company/
// @desc Get All company
// @ access Public
router.get("/", (req, res) => {
  Company.find()
    .sort({ date: -1 })
    .then(company => res.json(company))
    .catch(err => res.status(404).json({ nocompanyfound: "No comany found!" }));
});

// @route POST api/company
// @desc Create company
// @ access Private
// 事務所名がない場合は創り、ない場合はメンバーに自分を加える
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCompanyInput(req.body);
    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    // get fields
    const companyFields = {};
    companyFields.user = req.user.id;
    if (req.body.c_name) companyFields.c_name = req.body.c_name;
    if (req.body.c_website) companyFields.c_website = req.body.c_website;

    Company.findOne({ company: req.body.id }).then(company => {
      if (company) {
        // update
        Company.findOneAndUpdate({ $set: companyFields }, { new: true }).then(
          company => res.json(company)
        );
      } else {
        // save c_name&c_website
        new Company(companyFields).save().then(company => res.json(company));
      }
    });
  }
);

// @ route POST api/company/member/:id
// @ desc Create company's member
// @ access Private
router.post(
  "/member/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // const { errors, isValid } = validateCompanyInput(req.body);
    // if (!isValid) {
    //   return res.status(400).json(errors);
    // }
    Company.findById(req.params.id).then(company => {
      if (
        post.company.filter(
          company => company._id.toString() === req.params.company_id
        ).length === 0
      ) {
        return res
          .status(404)
          .json({ companynotexists: "Company dose not exists " });
      }
      const newMember = {
        user: req.user.id
      };
      // Add to actor array
      company.member.unshift(newMember);
      company.save().then(company => res.json(company));
    });
  }
);

// @ route POST api/company/actors/:id
// @ desc Create & Add company's actors
// @ access Private
// company's memberしか編集できない
router.post(
  "/actors/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateActorInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Company.findById(req.params.id)
      .then(company => {
        if (
          post.company.filter(
            company => company._id.toString() === req.params.id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ companynotexists: "Company dose not exists " });
        }
        const newAct = {
          a_name: req.body.a_name
        };
        // Add to actor array
        company.actors.unshift(newAct);
        company.save().then(company => res.json(company));
      })
      .catch(err =>
        res.status(404).json({ companynotfound: "No company found" })
      );
  }
);

// @ route DELETE api/company/:id/:actors_id
// @ desc Remove the actor from company's actors List
// @ access Private
// company's memberしか編集できない
router.delete(
  "/actors/:id/:actor_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Company.findById(req.params.id)
      .then(company => {
        if (
          company.actors.filter(
            actor => actor._id.toString() === req.params.actor_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ actornotexists: "Actor dose not exists// actors" });
        }
        // Get remove index
        const removeIndex = company.actors
          .map(item => item._id.toString())
          .indexOf(req.params.actors_id);
        // splice
        company.actors.splice(removeIndex, 1);
        company.save().then(company => res.json(company));
      })
      .catch(err =>
        res.status(404).json({ companytnotfound: "No company found" })
      );
  }
);

// @route   POST api/company/comment/:id
// @desc    Add comment to company's board
// @access  Private
router.post(
  "/comments/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateCommentInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Company.findById(req.params.id)
      .then(company => {
        const newComment = {
          text: req.body.text,
          user: req.user.id
        };
        company.comments.unshift(newComment);
        // Save
        company.save().then(company => res.json(company));
      })
      .catch(err =>
        res.status(404).json({ companynotfound: "No Company found." })
      );
  }
);

// @route   DELETE api/company/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete(
  "/comments/:id/:comments_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Company.findById(req.params.id)
      .then(company => {
        // CHECK TO SEE IF COMMENT EXISTS
        if (
          company.comments.filter(
            comment => comment._id.toString() === req.params.comments_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment dose not exists " });
        }
        const removeIndex = company.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comments_id);
        // splice
        company.comments.spice(removeIndex, 1);
        company.save().then(company => res.json(company));
      })
      .catch(err =>
        res.status(404).json({ companynotfound: "No company found!" })
      );
  }
);

module.exports = router;
