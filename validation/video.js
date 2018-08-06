// Validation
const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateVideoInput(data) {
  let errors = {};

  data.company = !isEmpty(data.company) ? data.company : "";
  data.a_name = !isEmpty(data.a_name) ? data.a_name : "";
  data.videoId = !isEmpty(data.videoId) ? data.videoId : "";
  data.title = !isEmpty(data.title) ? data.title : "";
  data.details = !isEmpty(data.details) ? data.details : "";
  data.thumbnail = !isEmpty(data.thumbnail) ? data.thumbnail : "";
  data.url = !isEmpty(data.url) ? data.url : "";
  data.year = !isEmpty(data.year) ? data.year : "";
  data.text = !isEmpty(data.text) ? data.text : "";

  if (Validator.isEmpty(data.a_name)) {
    errors.a_name = "役者名を入力してください";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
