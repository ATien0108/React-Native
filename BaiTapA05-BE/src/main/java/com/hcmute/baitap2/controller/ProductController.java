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

    // API lấy thông tin sản phẩm theo id
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable String id) {
        return productService.getProductById(id); // Trả về sản phẩm theo id
    }

    // API tìm kiếm sản phẩm theo từ khóa
    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String keyword) {
        return productService.searchProducts(keyword); // Trả về danh sách sản phẩm tìm được
    }

    // API lấy sản phẩm theo thương hiệu với sắp xếp theo giá hoặc thời gian
    @GetMapping("/brand/{brandId}")
    public List<Product> getProductsByBrand(
            @PathVariable ObjectId brandId,
            @RequestParam(defaultValue = "0") int page,  // Mặc định lấy trang 0
            @RequestParam(defaultValue = "10") int size, // Mặc định lấy 10 sản phẩm mỗi lần
            @RequestParam(defaultValue = "date") String sortBy,  // Mặc định sắp xếp theo ngày
            @RequestParam(defaultValue = "true") boolean ascending  // Mặc định sắp xếp tăng dần
    ) {
        return productService.getProductsByBrand(brandId, page, size, sortBy, ascending);
    }

    // API lấy sản phẩm theo danh mục với sắp xếp theo giá hoặc thời gian
    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategoryAll(
            @PathVariable ObjectId categoryId,
            @RequestParam(defaultValue = "0") int page,  // Mặc định lấy trang 0
            @RequestParam(defaultValue = "10") int size, // Mặc định lấy 10 sản phẩm mỗi lần
            @RequestParam(defaultValue = "date") String sortBy,  // Mặc định sắp xếp theo ngày
            @RequestParam(defaultValue = "true") boolean ascending  // Mặc định sắp xếp tăng dần
    ) {
        return productService.getProductsByCategory(categoryId, page, size, sortBy, ascending);
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
