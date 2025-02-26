package com.hcmute.baitap2.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Claims;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class AuthenticationService {

    private static final String SECRET_KEY = "ltddnc"; // Mã bí mật để mã hóa token

    // Tạo token JWT
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // Token hết hạn sau 1 giờ
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    // Kiểm tra token có hợp lệ và có khớp với email không
    public boolean validateToken(String token, String email) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody();

            String userEmail = claims.getSubject();
            return userEmail.equals(email);
        } catch (Exception e) {
            return false; // Token không hợp lệ hoặc gặp lỗi khi giải mã
        }
    }
}