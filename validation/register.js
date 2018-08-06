const Validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.c_name = !isEmpty(data.c_name) ? data.c_name : "";
  data.c_website = !isEmpty(data.c_website) ? data.c_website : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (!Validator.isLength(data.name, { min: 2, max: 15 })) {
    errors.name = "２文字以上、１５字以内で入力してください。";
  }
  if (Validator.isEmpty(data.name)) {
    errors.name = "氏名の入力は必須項目です";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Eメールの入力は必須項目です";
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = "このEメールは既に登録済みです";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "パスワードは必須項目です";
  }
  if (!Validator.isLength(data.password, { min: 4, max: 15 })) {
    errors.password = "４文字以上、１５文字以内で入力してください";
  }
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "パスワードを再入力してください";
  }
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "パスワードが一致しません";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
