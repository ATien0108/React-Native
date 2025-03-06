package com.hcmute.baitap2.controller;

import com.hcmute.baitap2.model.Brand;
import com.hcmute.baitap2.service.BrandService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
public class BrandController {

    @Autowired
    private BrandService brandService;

    // API lấy tất cả thương hiệu
    @GetMapping
    public List<Brand> getAllBrands() {
        return brandService.getAllBrands(); // Trả về danh sách tất cả các thương hiệu
    }

    // API lấy thương hiệu theo id
    @GetMapping("/{id}")
    public Brand getBrandById(@PathVariable String id) {
        return brandService.getBrandById(id); // Trả về thương hiệu theo id
    }
}