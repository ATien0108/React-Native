package com.hcmute.baitap2.controller;

import com.hcmute.baitap2.model.Product;
import com.hcmute.baitap2.service.ProductService;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    // API lấy tất cả sản phẩm
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts(); // Trả về danh sách sản phẩm
    }

    // API lấy sản phẩm theo danh mục với phân trang (Lazy loading)
    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(
            @PathVariable ObjectId categoryId,
            @RequestParam(defaultValue = "0") int page,  // Mặc định lấy trang 0
            @RequestParam(defaultValue = "10") int size   // Mặc định lấy 10 sản phẩm mỗi lần
    ) {
        return productService.getProductsByCategory(categoryId, page, size);
    }

    // API lấy sản phẩm sắp xếp theo giá
    @GetMapping("/sorted")
    public List<Product> getProductsSortedByPrice(
            @RequestParam(defaultValue = "0") int page,  // Mặc định lấy trang 0
            @RequestParam(defaultValue = "10") int size, // Mặc định lấy 10 sản phẩm mỗi lần
            @RequestParam(defaultValue = "true") boolean ascending  // Mặc định sắp xếp tăng dần
    ) {
        return productService.getProductsSortedByPrice(page, size, ascending);
    }

    // API lấy 10 sản phẩm bán chạy nhất
    @GetMapping("/top-selling")
    public List<Product> getTopSellingProducts(
            @RequestParam(defaultValue = "10") int topCount // Mặc định lấy 10 sản phẩm bán chạy nhất
    ) {
        return productService.getTopSellingProducts(topCount); // Trả về 10 sản phẩm bán chạy nhất
    }
}
