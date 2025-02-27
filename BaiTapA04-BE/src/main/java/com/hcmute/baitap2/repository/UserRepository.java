package com.hcmute.baitap2.repository;

import com.hcmute.baitap2.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    // Thêm phương thức tìm kiếm người dùng qua email
    Optional<User> findByEmail(String email);
}