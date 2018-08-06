const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!Validator.isEmail(data.email)) {
    errors.email = "Eメールに誤りがあります";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Eメールは必須項目です";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "パスワードは必須項目です";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
