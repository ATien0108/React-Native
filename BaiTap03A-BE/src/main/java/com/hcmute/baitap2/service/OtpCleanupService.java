package com.hcmute.baitap2.service;

import com.hcmute.baitap2.model.User;
import com.hcmute.baitap2.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OtpCleanupService {

    @Autowired
    private UserRepository userRepository;

    // Cron job để xóa các OTP hết hạn mỗi phút
    @Scheduled(fixedRate = 60000)
    public void cleanupExpiredOtp() {
        // Tìm và xóa những người dùng có OTP đã hết hạn
        List<User> usersWithExpiredOtp = userRepository.findAll()
                .stream()
                .filter(user -> user.getVerificationExpiry() != null && user.getVerificationExpiry().before(new Date())) // Kiểm tra null
                .collect(Collectors.toList());

        for (User user : usersWithExpiredOtp) {
            user.setVerificationToken(null);  // Xóa mã OTP
            user.setVerificationExpiry(null); // Xóa thời gian hết hạn
            userRepository.save(user);
        }
    }

}
