export class Validate {
  // Kiểm tra email hợp lệ
  static email(mail: string) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    return false;
  }

  // Kiểm tra mật khẩu có ít nhất 6 ký tự
  static Password(val: string) {
    return val.length >= 6;
  }

  // Kiểm tra số điện thoại hợp lệ (giả sử chỉ kiểm tra định dạng số điện thoại Việt Nam)
  static phoneNumber(phone: string) {
    // Định dạng số điện thoại Việt Nam bắt đầu bằng 0 và có 10 chữ số
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    return phoneRegex.test(phone);
  }
}
