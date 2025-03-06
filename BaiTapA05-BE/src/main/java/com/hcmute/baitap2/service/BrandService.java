package com.hcmute.baitap2.service;

import com.hcmute.baitap2.model.Brand;
import com.hcmute.baitap2.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BrandService {

    @Autowired
    private BrandRepository brandRepository;

    // Lấy tất cả thương hiệu chưa bị xóa
    public List<Brand> getAllBrands() {
        return brandRepository.findAll(); // Trả về tất cả các thương hiệu trong cơ sở dữ liệu
    }

    // Lấy thương hiệu theo id
    public Brand getBrandById(String id) {
        Optional<Brand> brand = brandRepository.findById(id); // Tìm thương hiệu theo id
        return brand.orElse(null); // Trả về thương hiệu nếu có, nếu không có thì trả về null
    }
}