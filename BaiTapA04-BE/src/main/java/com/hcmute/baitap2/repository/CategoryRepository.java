package com.hcmute.baitap2.repository;

import com.hcmute.baitap2.model.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
    List<Category> findByIsDeletedFalse();
}