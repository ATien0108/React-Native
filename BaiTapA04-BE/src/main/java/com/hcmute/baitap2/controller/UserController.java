package com.hcmute.baitap2.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hcmute.baitap2.model.User;
import com.hcmute.baitap2.service.UserService;
import com.hcmute.baitap2.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationService authenticationService;

    // API lấy thông tin người dùng theo email
    @GetMapping("/profile")
    public User getUserProfile(@RequestParam String email) {
        Optional<User> userOptional = userService.findByEmail(email);
        if (userOptional.isPresent()) {
            return userOptional.get();
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
    }

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

    // API cập nhật thông tin người dùng
    @PostMapping("/update")
    public String updateUser(@RequestParam("email") String email,
                             @RequestParam("username") String username,
                             @RequestParam("phoneNumber") String phoneNumber,
                             @RequestParam("address") String addressJson,
                             @RequestParam(value = "avatar", required = false) MultipartFile avatar) {
        try {
            // Chuyển đổi chuỗi JSON address thành đối tượng Address
            ObjectMapper objectMapper = new ObjectMapper();
            User.Address address = objectMapper.readValue(addressJson, User.Address.class);

            String result = userService.updateUserInfo(email, username, phoneNumber, address, avatar);
            return result;
        } catch (JsonProcessingException e) {
            return "Invalid address format!";
        }
    }
}
