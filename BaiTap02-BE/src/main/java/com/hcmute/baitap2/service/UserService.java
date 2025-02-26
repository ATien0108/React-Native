package com.hcmute.baitap2.service;

import com.hcmute.baitap2.model.User;
import com.hcmute.baitap2.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;
import java.util.Random;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Đăng ký người dùng
    public boolean register(User user) {
        // Kiểm tra nếu email đã tồn tại
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            return false; // Email đã tồn tại
        }

        // Mã hóa mật khẩu
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Lưu người dùng vào MongoDB
        user.setCreatedAt(new java.util.Date());
        user.setUpdatedAt(new java.util.Date());
        user.setVerified(false);

        // Gửi OTP qua email
        String otp = generateOtp();
        emailService.sendOtpEmail(user.getEmail(), otp);
        user.setVerificationToken(otp);

        // Thiết lập thời gian hết hạn của OTP (ví dụ: 10 phút)
        long otpExpiryTime = System.currentTimeMillis() + (1000 * 60 * 10); // 10 phút
        user.setVerificationExpiry(new Date(otpExpiryTime));

        userRepository.save(user);

        return true;
    }

    // Tìm người dùng theo email
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Xác thực OTP
    public boolean verifyOtp(String email, String otp) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Kiểm tra xem verificationExpiry có phải là null không
            if (user.getVerificationExpiry() == null || user.getVerificationExpiry().before(new Date())) {
                return false; // OTP đã hết hạn hoặc chưa được thiết lập
            }

            if (user.getVerificationToken().equals(otp)) {
                user.setVerified(true);
                user.setUpdatedAt(new java.util.Date());
                user.setVerificationToken(null); // Xóa mã OTP sau khi xác thực thành công
                user.setVerificationExpiry(null); // Xóa thời gian hết hạn OTP
                userRepository.save(user);
                return true;
            }
        }
        return false;
    }


    // Quên mật khẩu: gửi OTP tới email
    public boolean forgotPassword(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Tạo mã OTP
            String otp = generateOtp();
            emailService.sendOtpEmail(email, otp);  // Gửi OTP qua email

            // Lưu mã OTP và thời gian hết hạn
            user.setVerificationToken(otp);
            long otpExpiryTime = System.currentTimeMillis() + (1000 * 60 * 10); // 10 phút
            user.setVerificationExpiry(new Date(otpExpiryTime));

            userRepository.save(user);
            return true;
        }
        return false;
    }

    // Đổi mật khẩu khi có OTP hợp lệ
    public boolean resetPassword(String email, String newPassword, String otp) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Kiểm tra xem mã OTP đã hết hạn chưa
            if (user.getVerificationExpiry().before(new Date())) {
                return false; // OTP đã hết hạn
            }

            // Kiểm tra mã OTP có đúng không
            if (user.getVerificationToken().equals(otp)) {
                // Mã OTP hợp lệ, cập nhật mật khẩu mới
                user.setPassword(passwordEncoder.encode(newPassword));  // Mã hóa mật khẩu mới
                user.setUpdatedAt(new java.util.Date());
                user.setVerificationToken(null); // Xóa mã OTP sau khi đổi mật khẩu
                user.setVerificationExpiry(null); // Xóa thời gian hết hạn OTP
                userRepository.save(user);
                return true;
            }
        }
        return false;
    }

    // Kiểm tra mật khẩu khớp
    public boolean passwordMatches(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    // Tạo OTP ngẫu nhiên
    private String generateOtp() {
        Random rand = new Random();
        return String.format("%06d", rand.nextInt(1000000)); // 6 chữ số OTP
    }

    // Chỉnh sửa thông tin
    public boolean updateProfile(String userId, String newEmail, String newPhoneNumber, String newAvatarUrl, User.Address newAddress) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Nếu thay đổi email, gửi OTP xác nhận
            if (newEmail != null && !newEmail.equals(user.getEmail())) {
                String otp = generateOtp();
                user.setVerificationToken(otp);
                emailService.sendOtpEmail(newEmail, otp);  // Gửi OTP qua email mới

                // Thiết lập thời gian hết hạn của OTP (ví dụ: 10 phút)
                long otpExpiryTime = System.currentTimeMillis() + (1000 * 60 * 10); // 10 phút
                user.setVerificationExpiry(new Date(otpExpiryTime));
            }

            // Nếu thay đổi số điện thoại, gửi OTP xác nhận
            if (newPhoneNumber != null && !newPhoneNumber.equals(user.getPhoneNumber())) {
                String otp = generateOtp();
                user.setVerificationToken(otp);
                emailService.sendOtpEmail(user.getEmail(), otp);  // Gửi OTP qua email cũ

                // Thiết lập thời gian hết hạn của OTP (ví dụ: 10 phút)
                long otpExpiryTime = System.currentTimeMillis() + (1000 * 60 * 10); // 10 phút
                user.setVerificationExpiry(new Date(otpExpiryTime));
            }

            // Nếu có thay đổi avatar, cập nhật URL ảnh từ Cloudinary
            if (newAvatarUrl != null) {
                user.setAvatar(newAvatarUrl);  // Cập nhật avatar
            }

            // Nếu có thay đổi địa chỉ, cập nhật thông tin địa chỉ
            if (newAddress != null) {
                user.setAddress(newAddress);
            }

            user.setUpdatedAt(new java.util.Date());
            userRepository.save(user);
            return true; // Đã cập nhật thành công thông tin người dùng
        }
        return false;  // Nếu người dùng không tìm thấy
    }


    // Xác thực chỉnh sửa thong tin
    public boolean verifyUpdateOtp(String userId, String otp, String newEmail, String newPhoneNumber) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Kiểm tra OTP có hợp lệ không và không hết hạn
            if (user.getVerificationExpiry() == null || user.getVerificationExpiry().before(new Date())) {
                return false; // OTP đã hết hạn
            }

            if (user.getVerificationToken().equals(otp)) {
                // Nếu OTP hợp lệ, cập nhật email và số điện thoại nếu có thay đổi
                if (newEmail != null && !newEmail.equals(user.getEmail())) {
                    user.setEmail(newEmail); // Cập nhật email
                }
                if (newPhoneNumber != null && !newPhoneNumber.equals(user.getPhoneNumber())) {
                    user.setPhoneNumber(newPhoneNumber); // Cập nhật số điện thoại
                }

                // Sau khi xác thực OTP thành công, xóa token OTP và thời gian hết hạn
                user.setVerificationToken(null);
                user.setVerificationExpiry(null);

                // Cập nhật lại thời gian cập nhật và lưu lại
                user.setUpdatedAt(new java.util.Date());
                userRepository.save(user);
                return true;  // Xác thực và cập nhật thành công
            }
        }
        return false;  // Nếu OTP không hợp lệ
    }



}
