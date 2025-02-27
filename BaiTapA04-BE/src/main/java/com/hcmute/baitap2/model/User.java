package com.hcmute.baitap2.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "Users")
@Data
public class User {

    @Id
    private String id; // ID duy nhất của người dùng

    private String username; // Tên đăng nhập của người dùng
    private String email; // Địa chỉ email của người dùng
    private String password; // Mật khẩu của người dùng
    private String phoneNumber; // Số điện thoại của người dùng
    private String avatar; // URL ảnh đại diện của người dùng

    private Address address; // Địa chỉ của người dùng (nested object)

    private boolean isVerified; // Trạng thái xác thực email
    private String verificationToken; // Token xác thực gửi qua email
    private Date verificationExpiry; // Thời gian hết hạn của token xác thực

    private boolean isDeleted; // Trạng thái xóa mềm
    private Date createdAt; // Thời gian tạo tài khoản người dùng
    private Date updatedAt; // Thời gian cập nhật thông tin người dùng

    // Thêm các trường Cloudinary
    private String cloudinaryPublicId; // Public ID của ảnh đại diện trên Cloudinary
    private String cloudinaryUrl; // URL của ảnh đại diện trên Cloudinary

    private String newEmail; // Email mới khi người dùng muốn thay đổi
    private String newPhoneNumber; // Số điện thoại mới khi người dùng muốn thay đổi

    @Data
    public static class Address {
        private String street; // Đường phố
        private String communes; // Xã/phường
        private String district; // Quận/huyện
        private String city; // Thành phố
    }
}
