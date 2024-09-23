export const passwordValidator = {
  pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&.*]{8,}$/,
  message: "CHECK_PASSWORD_STRENGTH", // Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
};
export const phoneNumberValidator = {
  pattern: /^(0)(3\d{8}|5\d{8}|7\d{8}|8\d{8}|9\d{8})$/,
  message: "INVALID_PHONE", // Số điện thoại không cho phép nhập chữ/ký tự đặc biệt và giới hạn 10 ký tự
};
export const codeValidator = {
  pattern: /^[a-zA-Z0-9_-]+$/,
  message: "INVALID_CODE", // Mã chỉ cho phép nhập chữ và số không dấu và không khoảng trắng',
};

export const emailValidator = {
  pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  message: "FORM_VAL_EMAIL_INVAL", // Email không hợp lệ
};
