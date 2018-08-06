// Validation
const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateActorInput(data) {
  let errors = {};

  data.a_name = !isEmpty(data.a_name) ? data.a_name : "";

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
