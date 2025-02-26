package com.hcmute.baitap2.repository;

import com.hcmute.baitap2.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findById(String id);
    Optional<User> findByIdAndIsDeletedFalse(String id);

}

