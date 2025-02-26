package com.hcmute.baitap2.controller;

import com.hcmute.baitap2.model.User;
import com.hcmute.baitap2.service.CloudinaryService;
import com.hcmute.baitap2.service.UserService;
import com.hcmute.baitap2.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private CloudinaryService cloudinaryService;

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        boolean result = userService.register(user);
        if (result) {
            return "Registration successful. Check your email for OTP.";
        }
        return "Email already exists!";
    }

    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestParam String email, @RequestParam String otp) {
        boolean result = userService.verifyOtp(email, otp);
        return result ? "OTP verified successfully." : "Invalid OTP!";
    }

    // API quên mật khẩu: gửi OTP tới email
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestParam String email) {
        boolean result = userService.forgotPassword(email);
        return result ? "OTP has been sent to your email." : "Email not found!";
    }

    // API reset mật khẩu
    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam String email, @RequestParam String newPassword, @RequestParam String otp) {
        boolean result = userService.resetPassword(email, newPassword, otp);
        return result ? "Password reset successfully." : "Invalid OTP or OTP expired!";
    }

    @PostMapping("/login")
    public String login(@RequestParam String email, @RequestParam String password) {
        Optional<User> userOptional = userService.findByEmail(email);
        if (userOptional.isPresent() && userService.passwordMatches(password, userOptional.get().getPassword())) {
            String token = authenticationService.generateToken(email);
            return "Login successful. Token: " + token;
        }
        return "Invalid email or password!";
    }

    // API cập nhật thông tin người dùng và avatar
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable String id,
            @RequestBody User updatedUser,
            @RequestParam(value = "image", required = false) MultipartFile newImage) {

        try {
            User user = userService.updateUser(id, updatedUser, newImage);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Người dùng có id: " + id + " không tìm thấy.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi cập nhật dữ liệu người dùng: " + e.getMessage());
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile image,
                                         @RequestParam("userId") String userId) {
        try {
            User user = userService.getUserById(userId);
            String imageUrl = cloudinaryService.uploadImageForUser(image, user);
            return ResponseEntity.ok(new ImageResponse(imageUrl));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi tải hình ảnh lên");
        }
    }

    class ImageResponse {
        private String secure_url;

        public ImageResponse(String secure_url) {
            this.secure_url = secure_url;
        }

        public String getSecure_url() {
            return secure_url;
        }

        public void setSecure_url(String secure_url) {
            this.secure_url = secure_url;
        }
    }
}
