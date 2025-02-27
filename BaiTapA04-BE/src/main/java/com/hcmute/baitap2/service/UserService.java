package com.hcmute.baitap2.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.hcmute.baitap2.model.User;
import com.hcmute.baitap2.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Cloudinary cloudinary;

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

            // Kiểm tra xem mã OTP đã hết hạn chưa
            if (user.getVerificationExpiry().before(new Date())) {
                return false; // OTP đã hết hạn
            }

            if (user.getVerificationToken().equals(otp)) {
                // Cập nhật thông tin người dùng
                if (user.getNewEmail() != null) {
                    user.setEmail(user.getNewEmail()); // Cập nhật email mới
                    user.setNewEmail(null); // Xóa email mới sau khi cập nhật
                }
                if (user.getNewPhoneNumber() != null) {
                    user.setPhoneNumber(user.getNewPhoneNumber()); // Cập nhật số điện thoại mới
                    user.setNewPhoneNumber(null); // Xóa số điện thoại mới sau khi cập nhật
                }

                // Xác nhận người dùng và xóa mã OTP
                user.setVerified(true);
                user.setUpdatedAt(new Date());
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

    // Cập nhật thông tin người dùng
    public String updateUserInfo(String email, String username, String phoneNumber, User.Address address, MultipartFile avatar) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (!userOptional.isPresent()) {
            return "User not found!";
        }

        User currentUser = userOptional.get();

        // Kiểm tra nếu email hoặc số điện thoại thay đổi
        boolean isEmailChanged = !currentUser.getEmail().equals(email);
        boolean isPhoneNumberChanged = !currentUser.getPhoneNumber().equals(phoneNumber);

        // Nếu email thay đổi, lưu email mới và gửi OTP
        if (isEmailChanged) {
            currentUser.setNewEmail(email); // Lưu email mới
            // Gửi OTP qua email mới
            String otp = generateOtp();
            emailService.sendOtpEmail(email, otp); // Gửi OTP
            currentUser.setVerificationToken(otp); // Lưu mã OTP cho quá trình xác thực
            long otpExpiryTime = System.currentTimeMillis() + (1000 * 60 * 10); // 10 phút
            currentUser.setVerificationExpiry(new Date(otpExpiryTime));
        }

        // Nếu số điện thoại thay đổi, lưu số điện thoại mới và gửi OTP
        if (isPhoneNumberChanged) {
            currentUser.setNewPhoneNumber(phoneNumber); // Lưu số điện thoại mới
            // Gửi OTP qua email cũ nếu thay đổi số điện thoại
            String otp = generateOtp();
            emailService.sendOtpEmail(currentUser.getEmail(), otp); // Gửi OTP
            currentUser.setVerificationToken(otp); // Lưu mã OTP cho quá trình xác thực
            long otpExpiryTime = System.currentTimeMillis() + (1000 * 60 * 10); // 10 phút
            currentUser.setVerificationExpiry(new Date(otpExpiryTime));
        }

        // Xử lý cập nhật avatar
        if (avatar != null && !avatar.isEmpty()) {
            if (currentUser.getCloudinaryPublicId() != null) {
                try {
                    cloudinary.uploader().destroy(currentUser.getCloudinaryPublicId(), ObjectUtils.emptyMap());
                } catch (IOException e) {
                    e.printStackTrace();
                    return "Failed to delete old avatar!";
                }
            }

            try {
                Map<String, Object> uploadResult = cloudinary.uploader().upload(avatar.getBytes(), ObjectUtils.emptyMap());
                String newAvatarUrl = (String) uploadResult.get("url");
                String newCloudinaryPublicId = (String) uploadResult.get("public_id");

                currentUser.setAvatar(newAvatarUrl);
                currentUser.setCloudinaryPublicId(newCloudinaryPublicId);
            } catch (IOException e) {
                e.printStackTrace();
                return "Failed to upload avatar!";
            }
        }

        // Cập nhật thông tin còn lại như username và địa chỉ
        if (username != null && !username.equals(currentUser.getUsername())) {
            currentUser.setUsername(username);
        }
        if (address != null) {
            currentUser.setAddress(address);
        }

        currentUser.setUpdatedAt(new Date());
        userRepository.save(currentUser);
        return "User information updated successfully. Please verify the changes with OTP.";
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
}