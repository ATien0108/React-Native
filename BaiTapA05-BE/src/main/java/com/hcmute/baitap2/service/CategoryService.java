package com.hcmute.baitap2.service;

import com.hcmute.baitap2.model.Category;
import com.hcmute.baitap2.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // Lấy tất cả danh mục chưa bị xóa
    public List<Category> getAllCategories() {
        return categoryRepository.findByIsDeletedFalse(); // Trả về danh mục chưa bị xóa
    }
}