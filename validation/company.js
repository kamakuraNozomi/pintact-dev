// Validation
const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCompanyInput(data) {
  let errors = {};

  data.c_name = !isEmpty(data.c_name) ? data.c_name : "";
  data.c_website = !isEmpty(data.c_website) ? data.c_website : "";

  if (Validator.isEmpty(data.c_name)) {
    errors.c_name = "会社名（or フリー）を入力してください";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
