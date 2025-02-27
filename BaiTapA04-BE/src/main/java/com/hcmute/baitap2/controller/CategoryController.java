package com.hcmute.baitap2.controller;

import com.hcmute.baitap2.model.Category;
import com.hcmute.baitap2.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // API lấy tất cả danh mục
    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories(); // Trả về danh sách danh mục
    }
}